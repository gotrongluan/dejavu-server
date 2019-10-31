const express = require('express');
const router = express.Router();
const cors = require('../middleware/cors');
const { verifyUser } = require('../middleware/auth');
const messageValidators = require('../middleware/validators/messages');
const messageServices = require('../services/messages');

router.route('/')
    .options(cors.preflight(['GET', 'POST']))
    .post(cors.sideEffect, verifyUser, messageValidators.send, async (req, res, next) => {
        const { conversationId, partnerId, text } = req.body;
        const { error, value } = await messageServices.send(req.user, conversationId, partnerId, text);
        if (error) next(error);
        else res.return(value);
    });

module.exports = router;