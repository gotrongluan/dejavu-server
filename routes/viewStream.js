const express = require('express');
const router = express.Router();
const cors = require('../middleware/cors');
const { verifyUser } = require('../middleware/auth');
const viewStreamServices = require('../services/viewStream');
const viewStreamValidators = require('../middleware/validators/viewStream');

router.options('/streamer/:id', cors.preflight(['GET']));
router.get('/streamer/:id', cors.simplest, verifyUser, viewStreamValidators.getStreamer, async (req, res, next) => {
    const userId = req.user._id;
    const { id: streamerId } = req.params;
    const { error, value } = await viewStreamServices.getStreamer(streamerId, userId);
    if (error) next(error);
    else res.return(value);
});

module.exports = router;