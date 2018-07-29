const functions = require('firebase-functions');

exports.echo = functions.https.onRequest((request, response) => {
  response.send({
    message: "Echo",
    param: 1
  });
});