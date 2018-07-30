const functions = require('firebase-functions');

exports.error = functions.https.onRequest((request, response) => {
  throw new Error('Test error function');
});