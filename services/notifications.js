const User = require('../models/users');
const _ = require('lodash');

module.exports = {
    getNotifications: async (userId, page, limit) => {
        try {
            const user
                = await User.findById(
                    userId,
                    {
                        notifications: { $slice: [(page - 1) * limit, limit] }
                    }
                ).lean();
            const notifications = user.notifications;
            return { error: null, value: notifications };
        }
        catch (err) {
            return { error: err };
        }
    },
    getNumUnread: async userId => {
        try {
            const user
                = await User.findById(userId).lean();
            const unread = _.filter(user.notifications, noti => !noti.seen).length;
            return { error: null, value: unread };
        }
        catch (err) {
            return { error: err };
        }
    },
    read: async (userId, id) => {
        try {
            const user
                = await User.findOneAndUpdate(
                    { 
                        _id: userId,
                        notifications: {
                            $elemMatch: { '_id': id }
                        } 
                    },
                    {
                        $set: { "notifications.$.seen": true }
                    },
                    { new: true }
                ).lean();
            if (!user) return { error: new Error('Notification not found') };
            const unread = _.filter(user.notifications, noti => !noti.seen).length; 
            
            return { error: null, value: unread}
        }
        catch(err) {
            return { error: err }
        }
    }
}