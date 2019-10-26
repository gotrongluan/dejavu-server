const config = require('config');
const jwtoken = require('jsonwebtoken');

exports.getToken = data => {
    const options = {
        expiresIn: 120
    };
    return jwtoken.sign(data, config.get('secretKey'), options);
};