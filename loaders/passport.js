const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('config');
const User = require('../models/users');

module.exports = async app => {
    passport.use(new LocalStrategy({ usernameField: 'phone', passwordField: 'password' }, User.authenticate()));

    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.get('secretKey')
    }, (jwtoken, done) => {
        try {
            const user = User.findById(jwtoken._id);
            if (!user) return done(null, false);
            done(null, user);
        }
        catch (err) {
            done(err, false);
        }
    }));

    app.use(passport.initialize());

    return app;
}