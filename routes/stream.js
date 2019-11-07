const express = require('express');
const router = express.Router();
const cors = require('../middleware/cors');
const { verifyUser } = require('../middleware/auth');
const streamServices = require('../services/stream');
const streamValidators = require('../middleware/validators/stream');

router.options('/check-wowza', cors.preflight(['GET']));
router.get('/check-wowza', cors.simplest, verifyUser, async (req, res, next) => {
    const userId = req.user._id;
    const { error, value } = await streamServices.checkWowza(userId);
    if (error) next(error);
    else res.return(value);
});

router.options('/save-wowza', cors.preflight(['PUT']));
router.put('/save-wowza', cors.sideEffect, verifyUser, streamValidators.saveWowza, async (req, res, next) => {
    const userId = req.user._id;
    const { wowza } = req.body;
    const { error, value } = await streamServices.saveWowza(userId, wowza);
    if (error) next(error);
    else res.return(value);
});

router.options('/online', cors.preflight(['PUT']));
router.put('/online', cors.sideEffect, verifyUser, async (req, res, next) => {
    const userId = req.user._id;
    const { error, value } = await streamServices.online(userId);
    if (error) next(error);
    else res.return(value);
});

router.options('/offline', cors.preflight(['PUT']));
router.put('/offline', cors.sideEffect, verifyUser, async (req, res, next) => {
    const userId = req.user._id;
    const { error, value } = await streamServices.offline(userId);
    if (error) next(error);
    else res.return(value);
});

module.exports = router;