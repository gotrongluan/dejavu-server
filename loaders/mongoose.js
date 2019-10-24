const mongoose = require('mongoose');
const config = require('config');

module.exports = async app => {
    await mongoose.connect(config.get('mongoUrl'));
    return app;
}