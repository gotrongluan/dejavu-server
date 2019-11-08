const cors = require('cors');
const config = require('config');

const whiteList = config.get('whiteList');

module.exports = {
    simplest: cors(),
    preflight: methods => cors((req, callback) => {
        const origin = req.header('Origin');
        if (!origin || whiteList.indexOf(origin) !== -1) {
            const options = {
                origin: true,
                methods: methods
            };
            callback(null, options);
        }
        else callback(new Error('CORS error!'));
    }),
    sideEffect: cors((req, callback) => {
        const origin = req.header('Origin');
        if (!origin || whiteList.indexOf(origin) !== -1) callback(null, { origin: true });
        else callback(new Error('CORS error!'));
    })
};