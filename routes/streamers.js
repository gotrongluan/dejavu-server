const express = require('express');
const router = express.Router();
const cors = require('../middleware/cors');
const streamerValidators = require('../middleware/validators/streamers');
const streamerServices = require('../services/streamers');
const { verifyUser } = require('../middleware/auth');

router.route('/')
    .options(cors.preflight(['GET']))
    .get(cors.simplest, verifyUser, streamerValidators.getStreamers, async (req, res, next) => {
        const { page, limit, type } = req.query;
        const userId = req.user._id;
        const { error, value } = await streamerServices.getStreamers(page, limit, type, userId);
		if (error) next(error);
		else res.return(value);
    });

router.route('/:id')
	.options(cors.preflight(['GET']))
	.get(cors.simplest, verifyUser, streamerValidators.getStreamer, async (req, res, next) => {
		const { id: streamerId } = req.params;
		const userId = req.user._id;
		const { error, value } = await streamerServices.getStreamer(streamerId, userId);
		if (error) next(error);
		else res.return(value);
    });
    
module.exports = router;