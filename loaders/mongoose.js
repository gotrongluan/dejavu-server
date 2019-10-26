const mongoose = require('mongoose');
const config = require('config');
const Fawn = require('fawn');

module.exports = async app => {
    await mongoose.connect(config.get('mongoUrl'));
    Fawn.init(mongoose);
    return app;
}