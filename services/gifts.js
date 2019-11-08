const Gift = require('../models/gifts');

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
    }
}