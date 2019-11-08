const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const giftSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    pun: {
        type: Number,
        required: true
    },
    coin: {
        type: Number,
        required: true
    }
});

const Gift = mongoose.model('Gift', giftSchema);

module.exports = Gift;