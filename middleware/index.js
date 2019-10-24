const config = require('config');

exports.redToHttps = (req, res, next) => {
    if (req.secure) return next();
    res.redirect(307, `https://${req.hostname}:${config.get('securePort')}${req.url}`);
};