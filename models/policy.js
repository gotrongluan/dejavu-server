const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const policySchema = new Schema({
    coin: Number,
    money: Number
});

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;