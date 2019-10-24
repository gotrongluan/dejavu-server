const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const passportLoader = require('./passport');
const routesLoader = require('./routes');

module.exports = async ({ expressApp }) => {
    let app = expressApp;
    //mongoose
    app = await mongooseLoader(app);
    //express
    app = await expressLoader(app);
    //passport
    //app = await passportLoader(app);
    //routes
    app = await routesLoader(app);

    return app;
};