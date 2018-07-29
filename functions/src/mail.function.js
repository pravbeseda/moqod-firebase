const functions = require('firebase-functions');
const https = require('https');
const cors = require('cors')({origin: true});
//const mail = require('./routines/mail-gmail');
const mail = require('./routines/mail-mandrill');

exports.sendMail = functions.https.onRequest((request, response) => {
  cors(request, response, () => {});
  let messageData = {};
  try {
    messageData = JSON.parse(request.body) || {};  
  } catch (e) {
    console.log('strange request.body', request.body, e);
  }  
  const message = {
    from: /*messageData.from ||*/ `Moqod <info@moqod.com>`,
    to: 'info@moqod.com',
    subject: messageData.subject || `New message`,
    text: messageData.text || `No text`
  };
  let res = {};
  res.status = 'error';
  try {
    mail.send(message, (result) => {
      if (result && result.ok) {
        res.status = 'ok';
      }
      response.send(JSON.stringify(res));
    });
  } catch (e) {
    response.send(JSON.stringify(res));
  }
})
