const config = require('config');
const jwtoken = require('jsonwebtoken');

exports.getToken = data => {
    const options = {
        expiresIn: "2d"
    };
    return jwtoken.sign(data, config.get('secretKey'), options);
};