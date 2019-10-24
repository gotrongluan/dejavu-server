const express = require('express');
const createError = require('http-errors');
const path = require('path');
const { redToHttps } = require('../middleware');

const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');

module.exports = async app => {
    app.use(redToHttps);
    app.use(express.static(path.join(__dirname, '../public')));

    app.use('/', indexRouter);
    app.use('/users', usersRouter);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(createError(404));
    });

    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'dev' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
    
    return app;
}