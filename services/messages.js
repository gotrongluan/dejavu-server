const Conversation = require('../models/conversations');
const Message = require('../models/messages');
const ioServices = require('../services/socket.io');
const fcmServices = require('../services/fcm');
const debug = require('debug')('dejavu-server:messages');

module.exports = {
    send: async (user, converId, partnerId, text) => {
        try {
            let conversationId = converId;
            let conversation;
            if (converId) {
                conversation = Conversation.findOne({ _id: converId });
                if (!conversation) return { error: new Error('Conversation doesn\'t exists!') };
            }
            else {
                conversation = new Conversation({
                    users: [user._id, partnerId],
                });
                conversation = await conversation.save();
                conversationId = conversation._id;
            }
            let message = new Message({
                userId: user._id,
                conversationId: conversationId,
                content: text
            });
            message = await message.save();
            conversation = await Conversation.findOneAndUpdate({ _id: conversationId }, { $set: { lastMessage: message._id } }, { new: true });
            console.log(conversation);
            if (ioServices.check(converId, partnerId)) {
                ioServices.sendMessage({
                    message: message.toObject(),
                    converUpdatedTime: conversation.updatedAt,
                });
                message.seenAt = Date.now();
                message = await message.save();
            }
            else {
                //firebase
                fcmServices.data(partnerId, {
                    converId: conversationId,
                    lastMessage: message.content,
                    updatedAt: conversation.updatedAt,
                    name: user.name,
                    avatar: user.avatar,
                    type: 1000
                });
            }
            console.log(message.toObject());
            return {
                error: null,
                value: {
                    message: {
                        ...message.toObject(),
                        userName: user.name,
                        avatar: user.avatar
                    },
                    conversation: {
                        _id: conversation._id,
                        updatedAt: conversation.updatedAt,
                        lastMessage: message.content,
                        name: user.name,
                        avatar: user.avatar
                    }
                }
            };
        }
        catch (err) {
            debug(err)
            return { error: err };
        }
    }
}