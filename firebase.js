const admin = require("firebase-admin");
const serviceAccount = require("./fb_key.json"); //change to your own firebase service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;