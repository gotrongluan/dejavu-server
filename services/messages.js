const Conversation = require('../models/conversations');
const _ = require('lodash');
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
            conversation = await Conversation.findOneAndUpdate({ _id: conversationId }, { $set: { lastMessage: message._id } }, { new: true }).populate('users', 'name avatar online');
            const partner = _.find(conversation.users, u => u._id.equals(partnerId));
            if (ioServices.check(conversationId, partnerId)) {
                ioServices.sendMessage(conversationId, partnerId, {
                    message: {
                        ...message.toObject(),
                        userName: user.name,
                        avatar: user.avatar,
                    },
                    conversation: {
                        _id: conversationId,
                        updatedAt: conversation.updatedAt,
                    }
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
                        userName: partner.name,
                        avatar: partner.avatar
                    }
                }
            };
        }
        catch (err) {
            debug(err)
            return { error: err };
        }
    },
    getMessages: async (userId, converId, page, limit) => {
        try {
            let partnerId;
            await Conversation.findOne({ _id: converId, users: userId }).exec((err, conversation) => {
                if (err || !conversation) return { error: new Error('Invalid conversation!') };
                console.log(conversation);
                partnerId = _.find(conversation.users, uId => !uId.equals(userId));
            });
            const seenAt = Date.now();
            let messages
                = await Message.find({ conversationId: converId })
                    .sort({ createdAt: -1 })
                    .populate('userId', 'name avatar')
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .lean();
            const messageIds = _.map(_.filter(messages, m => m.seenAt === null && !m.userId._id.equals(userId)), m => m._id);
            messages = _.map(messages, m => {
                const newMess = { ...m };
                if (m.seenAt === null && !m.userId._id.equals(userId))
                    newMess.seenAt = seenAt;
                newMess.userName = m.userId.name;
                newMess.avatar = m.userId.avatar;
                newMess.userId = m.userId._id;
                return newMess;
            });
            await Message.updateMany(
                { _id: { $in: messageIds } },
                { 
                    $set: {
                        seenAt: seenAt
                    }
                }
            );
            if (ioServices.check(converId, partnerId)) {
                console.log('abc');
                ioServices.sendSeenStatus(converId, partnerId, messageIds);
            }
            return {
                error: null,
                value: messages,
            }

        }
        catch(err) {
            debug(err);
            return { error: err };
        }
    }
}