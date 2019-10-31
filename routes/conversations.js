const express = require('express');
const router = express.Router();
const conversationValidators = require('../middleware/validators/conversations');
const cors = require('../middleware/cors');
const { verifyUser } = require('../middleware/auth');
const conversationServices = require('../services/conversations');

router.route('/')
    .options(cors.preflight(['GET']))
    .get(cors.simplest, verifyUser, conversationValidators.getConversations, async (req, res, next) => {
        const { page, limit } = req.query;
        const userId = req.user._id;
        const { error, value } = await conversationServices.getConversations(userId, page, limit);
        if (error) next(error);
        else res.return(value);
    });

router.route('/check')
    .options(cors.preflight(['GET']))
    .get(cors.simplest, verifyUser, conversationValidators.checkConversation, async (req, res, next) => {
        const { partnerId } = req.query;
        const userId = req.user._id;
        const { error, value } = await conversationServices.checkConversation(userId, partnerId);
        if (error) next(error);
        else res.return(value);
    });

module.exports = router;