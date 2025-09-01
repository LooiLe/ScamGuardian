const admin = require('firebase-admin');
const serviceAccount = require('./config/hacka-35045-firebase-adminsdk-fbsvc-3081425674.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;