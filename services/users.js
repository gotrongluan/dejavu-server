const User = require('../models/users');
const Follow = require('../models/follows');

module.exports = {
    getStreamer: async (streamerId, userId) => {
        try {
            const streamer
                = await User.findById(streamerId)
                    .select(['name', 'gender', 'phone', 'birthday', 'avatar', 'address', 'online']);
            const pairs
                = await Follow.findOne({ followed: streamerId, follower: userId });
            let followed = false;
            if (pairs) followed = true;
            return { error: null, value: { streamer, followed } };
        }
        catch(err) {
            return { error: err, value: null };
        }
    },
    saveFCMToken: async (userId, fcmToken) => {
        try {
            await User.updateOne({ _id: userId }, {
                $set: {
                    fcmToken
                }
            });
            return { error: null, value: 'Successfully!' };
        }
        catch(err) {
            return { error: err, value: null };
        }
    }
}