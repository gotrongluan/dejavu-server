const mongooseLoader = require('./mongoose');
const firebaseLoader = require('./firebase');
const expressLoader = require('./express');
const passportLoader = require('./passport');
const routesLoader = require('./routes');
const templateLoader = require('./template');

module.exports = async ({ expressApp }) => {
    let app = expressApp;
    //mongoose
    await mongooseLoader();
    //firebase
    await firebaseLoader();
    //template
    app = await templateLoader(app);
    //express
    app = await expressLoader(app);
    //passport
    app = await passportLoader(app);
    //routes
    app = await routesLoader(app);

    return app;
};