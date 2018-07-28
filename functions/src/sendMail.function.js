const functions = require('firebase-functions');
const https = require('https');
const cors = require('cors')({origin: true});
const gmail = require('./routines/mail-gmail');

exports.sendMail = functions.https.onRequest((request, response) => {
  const letter = {
    from: `Moqod <noreply@moqod.com>`,
    to: 'pravbeseda@yandex.ru',
    subject: `New message from Moqod.com`,
    text: `Text of letter`
  };
  gmail.send(letter, (result) => {
    if (result && result.ok) {
      response.send("Done!");
    } else {
      response.send("Error!");
    }
  });
})
