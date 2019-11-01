const express = require('express');
const router = express.Router();
const cors = require('../middleware/cors');
const { verifyUser } = require('../middleware/auth');
const messageValidators = require('../middleware/validators/messages');
const messageServices = require('../services/messages');

router.route('/')
    .options(cors.preflight(['GET', 'POST']))
    .get(cors.simplest, verifyUser, messageValidators.getMessages, async (req, res, next) => {
        const { converId, page, limit } = req.query;
        const userId = req.user._id;
        const { error, value } = await messageServices.getMessages(userId, converId, page, limit);
        if (error) next(error);
        else res.return(value);
    })
    .post(cors.sideEffect, verifyUser, messageValidators.send, async (req, res, next) => {
        const { conversationId, partnerId, text } = req.body;
        const { error, value } = await messageServices.send(req.user, conversationId, partnerId, text);
        if (error) next(error);
        else res.return(value);
    });

module.exports = router;