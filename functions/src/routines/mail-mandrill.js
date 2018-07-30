const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const mandrillTransport = require('nodemailer-mandrill-transport');

// firebase functions:config:set mandrill.key="..."
const apiKey = functions.config().mandrill.key;

var mailTransport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: apiKey
  }
}));

module.exports.send = function (message, callback) {
  return mailTransport.sendMail(message).then(() => {
  	callback({
  		ok: true
  	});
    return console.log('Email was sent via Mandrill');
  }).catch((error) => {
    throw new Error("Mandrill send error");
  });
}

/*
https://www.npmjs.com/package/nodemailer-mandrill-transport

transport.sendMail({
  from: 'sender@example.com',
  to: 'user@example.com',
  subject: 'Hello',
  html: '<p>How are you?</p>'
}, function(err, info) {
  if (err) {
    console.error(err);
  } else {
    console.log(info);
  }
});

*/
