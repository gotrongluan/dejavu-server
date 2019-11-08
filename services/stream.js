const User = require('../models/users');
const _ = require('lodash');

module.exports = {
    checkWowza: async streamerId => {
        try {
            const data = await User.findById(streamerId).select('wowza');
            if (!data.wowza || _.isEmpty(data.wowza)) data.wowza = null;
            return { error: null, value: data };
        }
        catch(err) {
            return { error: err };
        }
    },
    saveWowza: async (streamerId, wowza) => {
        try {
            await User.updateOne({ _id: streamerId }, {
                $set: {
                    wowza: wowza
                }
            }, { runValidators: true });
            return { error: null, value: 'Successfully!' };
        }
        catch(err) {
            return { error: err };
        }
    },
    online: async streamerId => {
        try {
            await User.updateOne({ _id: streamerId }, {
                $set: {
                    online: true
                }
            });
            return { error: null, value: 'Successfully!' };
        }
        catch (err) {
            return { error: null };
        }
    },
    offline: async streamerId => {
        try {
            await User.updateOne({ _id: streamerId }, {
                $set: {
                    online: false
                }
            });
            return { error: null, value: 'Successfully!' };
        }
        catch (err) {
            return { error: null };
        }
    }
}