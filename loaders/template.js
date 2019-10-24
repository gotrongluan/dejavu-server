const path = require('path');

module.exports = async app => {
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'jade');
    return app;
};