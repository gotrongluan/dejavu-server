const mongoose = require('mongoose');
const config = require('config');
const Fawn = require('fawn');

module.exports = async () => {
    await mongoose.connect(config.get('mongoUrl'));
    Fawn.init(mongoose);
}