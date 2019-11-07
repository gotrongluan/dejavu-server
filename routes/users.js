const _ = require('lodash');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const userValidators = require('../middleware/validators/users');
const debug = require('debug')('dejavu-server:users');
const cors = require('../middleware/cors');
const User = require('../models/users');
const userServices = require('../services/users');
const notificationServices = require('../services/notifications');
const { getToken } = require('../utils/auth');
const { verifyUser } = require('../middleware/auth');

router.options('/signup', cors.preflight(['POST']));
router.post('/signup', cors.sideEffect, userValidators.signup, (req, res, next) => {
	const password = req.body.password;
	const userObj = _.pick(req.body, ['phone', 'name', 'birthday', 'address', 'avatar', 'gender']);
	User.register(new User({
		...userObj
	}), password, (err, user) => {
		if (err) return next(err);
		passport.authenticate('local', { session: false })(req, res, () => {
			res.return('Signup successfully!');
		});
	});
});

router.options('/login', cors.preflight(['POST']));
router.post('/login', cors.sideEffect, userValidators.login, passport.authenticate('local', { session: false }), async (req, res, next) => {
	//login success, return token
	const user = _.pick(req.user, ['_id', 'name', 'phone', 'avatar', 'coin', 'pun', 'online', 'birthday', 'address', 'gender']);
	const token = getToken({ _id: req.user._id });
	const unreadMessage = 0;
	const { error, value: unreadNotification } = await notificationServices.getNumUnread(user._id);
	if (error) return next(error);
	//get Unread Message
	res.return({
		user: {
			...user,
			token
		},
		unreads: {
			message: unreadMessage,
			notification: unreadNotification,
		}
	});
});

router.options('/me', cors.preflight(['GET']))
router.get('/me', cors.simplest, verifyUser, async (req, res, next) => {
	const user = _.pick(req.user, ['_id', 'name', 'phone', 'avatar', 'coin', 'pun', 'online', 'birthday', 'address', 'gender']);
	const unreadMessage = 0;
	const { error, value: unreadNotification } = await notificationServices.getNumUnread(user._id);
	if (error) return next(error);
	res.return({
		user,
		unreads: {
			message: 0,
			notification: unreadNotification
		}
	});
});

router.options('/saveFCMToken', cors.preflight(['PUT']));
router.put('/saveFCMToken', cors.sideEffect, verifyUser, userValidators.saveFCMToken, async (req, res, next) => {
	const userId = req.user._id;
	const { fcmToken } = req.body;
	const { error, value } = await userServices.saveFCMToken(userId, fcmToken);
	if (error) next(error);
	else res.return(value);
});

module.exports = router;
