const functions = require('firebase-functions');
const https = require('https');
const cors = require('cors')({origin: true});
const mail = require('./routines/mail-gmail');
//const mail = require('./routines/mail-mandrill');

exports.sendMail = functions.https.onRequest((request, response) => {
  cors(request, response, () => {});
  const messageData = JSON.parse(request.body) || {};
  const message = {
    from: messageData.from || `Moqod <noreply@moqod.com>`,
    to: messageData.to || 'pravbeseda@yandex.ru',
    subject: messageData.subject || `New message`,
    text: messageData.text || `No text`
  };
  mail.send(message, (result) => {
    let res = {};
    if (result && result.ok) {
      res.status = 'ok';
    } else {
      res.status = 'error';
    }
    response.send(JSON.stringify(res));
  });

  //console.log();
  //response.send();
})
