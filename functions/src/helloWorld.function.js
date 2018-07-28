const functions = require('firebase-functions');

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send({
    message: "Hello from Alexander Ivanov!",
    param: 34
  });
});