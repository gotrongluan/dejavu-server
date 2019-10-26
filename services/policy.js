const Policy = require('../models/policy');

module.exports = {
    all: async () => {
        try {
            const policy = Policy.find().sort(['coin']);
            return { error: null, value: policy };
        }
        catch (err) {
            return { error: err, value: null };
        }
    }
}