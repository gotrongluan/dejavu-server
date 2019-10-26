const _ = require('lodash');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const userValidators = require('../middleware/validators/users');
const debug = require('debug')('dejavu-server:users');
const cors = require('../middleware/cors');
const User = require('../models/users');
const { getToken } = require('../utils/auth');

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
router.post('/login', cors.sideEffect, userValidators.login, passport.authenticate('local', { session: false }), (req, res, next) => {
	//login success, return token
	const user = _.pick(req.user, ['_id', 'name', 'phone', 'avatar', 'coin', 'pun', 'online', 'birthday', 'address', 'gender']);
	const token = getToken({ _id: req.user._id });
	//get Unread Message
	res.return({
		user: {
			...user,
			token
		},
		unreads: {
			message: 0,
			notification: 0,
		}
	});
})


module.exports = router;
