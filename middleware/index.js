const config = require('config');

exports.redToHttps = (req, res, next) => {
    if (req.secure) return next();
    res.redirect(307, `https://${req.hostname}:${config.get('securePort')}${req.url}`);
};

exports.resWrapper = (req, res, next) => {
    res.return = (payload, statusCode = 200) => {
        res.statusCode = statusCode;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            error: statusCode >= 400,
            data: payload
        });
    };
    next();
};