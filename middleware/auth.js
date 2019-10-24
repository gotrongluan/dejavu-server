const passport = require('passport');

exports.verifyUser = passport.authenticate('jwt', { session: false });