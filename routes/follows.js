const express = require('express');
const router = express.Router();
const cors = require('../middleware/cors');
const followValidators = require('../middleware/validators/follows');
const { verifyUser } = require('../middleware/auth');
const followServices = require('../services/follows');

router.route('/followers')
    .options(cors.preflight(['GET']))
    .get(cors.simplest, verifyUser, followValidators.followers, async (req, res, next) => {
        const { userId = req.user._id, page, limit } = req.query;
        const { error, value } = await followServices.getFollowers(userId, page, limit);
        if (error) next(error);
        else res.return(value);
    });

router.route('/followings')
    .options(cors.preflight(['GET']))
    .get(cors.simplest, verifyUser, followValidators.followings, async (req, res, next) => {
        const { userId = req.user._id, page, limit } = req.query;
        const { error, value } = await followServices.getFollowings(userId, page, limit);
        if (error) next(error);
        else res.return(value);
    });

router.route('/follow')
    .options(cors.preflight(['POST']))
    .post(cors.sideEffect, verifyUser, followValidators.follow, async (req, res, next) => {
        const { followedId } = req.body;
        const userId = req.user._id;
        const { error, value } = await followServices.follow(followedId, userId);
        if (error) next(error);
        else res.return(value);
    });

router.route('/:id/unfollow')
    .options(cors.preflight(['DELETE']))
    .delete(cors.sideEffect, verifyUser, followValidators.unfollow, async (req, res, next) => {
        const { id: followedId } = req.params;
        const userId = req.user._id;
        const { error, value } = await followServices.unfollow(followedId, userId);
        if (error) next(error);
        else res.return(value);
    });

router.route('/num-followers')
    .options(cors.preflight(['GET']))
    .get(cors.simplest, verifyUser,followValidators.numOfFollower,  async (req, res, next) => {
        const { userId = req.user._id } = req.query;
        const { error, value } = await followServices.getNumOfFollower(userId);
        if (error) next(error);
        else res.return(value);
    });

router.route('/num-followings')
    .options(cors.preflight(['GET']))
    .get(cors.simplest, verifyUser, followValidators.numOfFollowing, async (req, res, next) => {
        const { userId = req.user._id } = req.query;
        const { error, value } = await followServices.getNumOfFollowing(userId);
        if (error) next(error);
        else res.return(value);
    })
module.exports = router;