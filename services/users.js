const User = require('../models/users');
const Follow = require('../models/follows');

module.exports = {
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