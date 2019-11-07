const express = require('express');
const createError = require('http-errors');
const path = require('path');
const { redToHttps } = require('../middleware');

const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');
const followsRouter = require('../routes/follows');
const policyRouter = require('../routes/policy');
const transactionsRouter = require('../routes/transactions');
const notificationsRouter = require('../routes/notifications');
const conversationRouter = require('../routes/conversations');
const streamersRouter = require('../routes/streamers');
const messagesRouter = require('../routes/messages');

module.exports = async app => {
    app.use(redToHttps);
    app.use(express.static(path.join(__dirname, '../public')));

    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/follows', followsRouter);
    app.use('/policy', policyRouter);
    app.use('/transactions', transactionsRouter);
    app.use('/notifications', notificationsRouter);
    app.use('/conversations', conversationRouter);
    app.use('/messages', messagesRouter);
    app.use('/streamers', streamersRouter);
    
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