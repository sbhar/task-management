// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Download this from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://betterdoctorfinder.firebaseio.com"
});

const db = admin.database();

module.exports = db;
