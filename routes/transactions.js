const express = require('express');
const router = express.Router();
const cors = require('../middleware/cors');
const transactionValidators = require('../middleware/validators/transactions');
const { verifyUser } = require('../middleware/auth');
const transactionServices = require('../services/transactions');

router.route('/')
    .options(cors.preflight(['GET']))
    .get(cors.simplest, verifyUser, transactionValidators.transactions, async (req, res, next) => {
        const { page, limit } = req.query;
        const { _id: userId } = req.user;
        const { error, value } = await transactionServices.getTransactions(userId, page, limit);
        if (error) next(error);
        else res.return(value);
    });

router.route('/buy-coins')
    .options(cors.preflight(['POST']))
    .post(cors.sideEffect, verifyUser, transactionValidators.buyCoins, async (req, res, next) => {
        const { money } = req.body;
        const { _id: userId } = req.user;
        const { error, value } = await transactionServices.buyCoins(userId, money);
        if (error) next(error);
        else res.return(value);
    });

module.exports = router;