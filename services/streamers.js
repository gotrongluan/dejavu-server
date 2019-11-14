const User = require('../models/users');
const Follow = require('../models/follows');

module.exports = {
    getStreamer: async (streamerId, userId) => {
        try {
            const streamer
                = await User.findById(streamerId)
                    .select(['name', 'gender', 'phone', 'birthday', 'avatar', 'address', 'online']);
            if (!streamer) return { error: new Error('Invalid streamer!') };
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
    getStreamers: async (page, limit, type, userId) => {
        const mapTypeToSort = {
            topPun: 'pun',
            mostView: 'view',
            near: 'pun',
            popular: 'pun'
        };
        try {
            const streamers
            = await User.find({ _id: { $ne: userId } })
                    .sort({ online: -1, [mapTypeToSort[type]]: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .select(['name', 'avatar', 'pun', 'view', 'online']);
            return { error: null, value: streamers };
        }
        catch (err) {
            return { error: err };
        }
    }
}