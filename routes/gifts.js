const express = require('express');
const router = express.Router();
const _ = require('lodash');
const cors = require('../middleware/cors');
const { verifyUser } = require('../middleware/auth');
const giftServices = require('../services/gifts');
const giftValidators = require('../middleware/validators/gifts');

router.route('/')
    .options(cors.preflight(['GET', 'POST']))
    .get(cors.simplest, verifyUser, async (req, res, next) => {
        const { error, value } = await giftServices.getGifts();
        if (error) next(error);
        else res.return(value);
    })
    .post(cors.sideEffect, verifyUser, giftValidators.createGift, async (req, res, next) => {
        const gift = _.pick(req.body, ['name', 'avatar', 'pun', 'coin']);
        const { error, value } = await giftServices.createGift(gift);
        if (error) next(error);
        else res.return(value);
    });

module.exports = router;