const config = require('config');
const jwtoken = require('jsonwebtoken');

exports.getToken = data => {
    return jwtoken.sign(data, config.get('secretKey'));
};