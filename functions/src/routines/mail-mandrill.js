const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const mandrillTransport = require('nodemailer-mandrill-transport');

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// firebase functions:config:set mandrill.key="..."
const apiKey = functions.config().mandrill.key;

var mailTransport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: apiKey
  }
}));

/*const mailTransport = nodemailer.createTransport({
  service: 'Mandrill',
  auth: {
    apiKey: apiKey
  },
});

module.exports.send = function (message, callback) {
  return mailTransport.sendMail(message).then(() => {
  	callback({
  		ok: true
  	});
    return console.log('Email was sent via Mandrill');
  });
}*/

module.exports.send = function (message, onDone) {
  let xhr = new XMLHttpRequest();
  if (!onDone) {
    onDone = () => {
    };
  }
  let messageData = {
    key: apiKey,
    message: {
      text: message.text,
      subject: message.subject,
      from: message.from,
      /*from_name: 'moqod.com/contacts',
      from_email: 'info@moqod.com',*/
      to: [
        {
          email: message.to,
          type: 'to'
        }
      ],
      send_at: new Date().toUTCString()    
    }
  };

  xhr.open('POST', 'https://mandrillapp.com/api/1.0/messages/send.json');
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      let res = JSON.parse(xhr.responseText)[0];
      // Call success/error function based on response status
      switch (res.status) {
        case 'sent':
        case 'queued':
        case 'scheduled':
          onDone({
            ok: true,
          });
          break;
        case 'rejected':
        case 'invalid':
        default:
          onDone({
            ok: false,
            res: res
          });
          console.log(res);
          break;
      }
    }
  };
  xhr.send(JSON.stringify(messageData));
}
