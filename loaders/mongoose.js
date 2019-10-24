const mongoose = require('mongooose');
const config = require('config');

exports = async app => {
    await mongoose.connect(config.get('mongoUrl'));
    return app;
}