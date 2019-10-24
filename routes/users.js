const _ = require('lodash');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const userValidators = require('../middleware/validators/users');
const User = require('../models/users');

router.post('/signup', userValidators.signup, (req, res, next) => {
	const password = req.body.password;
	const userObj = _.pick(req.body, ['phone', 'name', 'birthday', 'address', 'avatar', 'gender']);
	User.register(new User({
		...userObj
	}), password, (err, user) => {
		if (err) return next(err);
		passport.authenticate('local', { session: false })(req, res, () => {
			res.success('Signup successfully!');
		});
	});
})

module.exports = router;
