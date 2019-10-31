const Conversation = require('../models/conversations');
const Message = require('../models/messages');
const ioServices = require('../services/socket.io');
const fcmServices = require('../services/fcm');

module.exports = {
    send: async (user, converId, partnerId, text) => {
        try {
            let conversationId = converId;
            let conversation;
            if (converId) {
                conversation = Conversation.findById(converId);
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
            conversation.lastMessage = message._id;
            conversation = await conversation.save();
            if (ioServices.check(converId, partnerId)) {
                ioServices.sendMessage({
                    message: message,
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
                });
            }
            
            return {
                error: null,
                value: {
                    message: {
                        ...message,
                        userName: user.name,
                        avatar: user.avatar
                    },
                    conversation: {
                        _id: conversation._id,
                        updatedAt: conversation.updatedAt,
                        lastMessage: message.content,
                    }
                }
            };
        }
        catch (err) {
            return { error: err };
        }
    }
}