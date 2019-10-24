const express = require('express');
//const cookieParser = require('cookie-parser');
const debug = require('debug')('dejavu-server:express-loader');
const logger = require('morgan');

module.exports = async app => {
    if (app.get('env') === 'dev') {
        app.use(logger('dev'));
        debug('Morgan enables...');
    }
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    //app.use(cookieParser());
    return app;
}