const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followSchema = new Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    followed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;