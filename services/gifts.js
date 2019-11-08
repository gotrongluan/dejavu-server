const Gift = require('../models/gifts');
const User = require('../models/users');
const ioServices = require('./socket.io');

module.exports = {
    getGifts: async () => {
        try {
            const gifts = await Gift.find().sort({ coin: 1 });
            return { error: null, value: gifts };
        }
        catch (err) {
            return { error: err };
        }
    },
    createGift: async gift => {
        try {
            let newGift = new Gift({
                ...gift
            });
            newGift = await newGift.save();
            return { error: null, value: newGift };
        }
        catch (err) {
            return { error: err };
        }
    },
    sendGift: async (user, giftId, streamerId) => {
        try {
            const gift = await Gift.findById(giftId);
            if (!gift) return { error: new Error('Invalid gift!') };
            const { pun, coin } = gift;
            if (user.coin < coin) return { error: new Error('You don\'t have enough coin!') };
            const streamer = await User.findById(streamerId);
            if (!streamer) return { error: new Error('Invalid streamer!') };
            streamer.pun += pun;
            await streamer.save();
            await User.updateOne({ _id: user._id }, {
                $inc: {
                    coin: -coin
                }
            });
            await ioServices.sendGift(user.name, user.avatar, streamerId, gift.name, streamer.pun);
            return { error: null, value: {
                status: true,
                coin: user.coin - coin
            }}
        }
        catch (err) {
            console.log(err);
            return { error: err };
        }
    }
}