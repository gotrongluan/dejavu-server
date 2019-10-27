const express = require('express');
const router = express.Router();
const cors = require('../middleware/cors');
const notificationValidators = require('../middleware/validators/notifications');
const { verifyUser } = require('../middleware/auth');
const notificationServices = require('../services/notifications');

router.route('/')
    .options(cors.preflight(['GET']))
    .get(cors.simplest, verifyUser, notificationValidators.getNotifications, async (req, res, next) => {
        const userId = req.user._id;
        const { page, limit } = req.query;
        const { error, value } = await notificationServices.getNotifications(userId, page, limit);
        if (error) next(error);
        else res.return(value);
    });

router.route('/num-unread')
    .options(cors.preflight(['GET']))
    .get(cors.simplest, verifyUser, async (req, res, next) => {
        const userId = req.user._id;
        const { error, value } = await notificationServices.getNumUnread(userId);
        if (error) next(error);
        else res.return(value);
    });

router.route('/:id/read')
    .options(cors.preflight(['PUT']))
    .put(cors.sideEffect, verifyUser, notificationValidators.read, async (req, res, next) => {
        const userId = req.user._id;
        const { id } = req.params;
        const { error, value } = await notificationServices.read(userId, id);
        if (error) next(error);
        else res.return(value);
    });

module.exports = router;