const Policy = require('../models/policy');

module.exports = {
    all: async () => {
        try {
            const policy = await Policy.find().sort({ coin: 1 });
            return { error: null, value: policy };
        }
        catch (err) {
            return { error: err, value: null };
        }
    }
}