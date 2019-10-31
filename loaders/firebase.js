const admin = require('firebase-admin');
const config = require('config');
const serviceAccount = require('../bin/firebase-admin-pkey.json');

module.exports = async () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://dejavu-elec-ecom-1611.firebaseio.com"
    });
}