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
  });
}

