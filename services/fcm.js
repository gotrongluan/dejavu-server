const admin = require('firebase-admin');
const User = require('../models/users');
const debug = require('debug')('dejavu-server:fcm');

module.exports = {
    notification: async (userId, title, body) => {
        try {
            const user = await User.findById(userId);
            const fcmToken = user && user.fcmToken;
            if (fcmToken) {
                admin.messaging().send({
                    notification: {
                        title, body
                    },
                    token: fcmToken
                });
            }
        }
        catch(err) {
            debug('FCM Error: \n', err.message);
        }
        
    },
    data: async (userId, payload) => {
        try {
            const user = await User.findById(userId);
            const fcmToken = user && user.fcmToken;
            if (fcmToken) {
                admin.messaging().send({
                    data: {
                        payload: JSON.stringify({ ...payload })
                    },
                    token: fcmToken
                });
            }
        }
        catch(err) {
            debug('FCM Error: \n', err.message);
        }
    }
}