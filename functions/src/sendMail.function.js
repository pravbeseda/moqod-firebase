const functions = require('firebase-functions');
const https = require('https');
const cors = require('cors')({origin: true});    

const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
// firebase functions:config:set gmail.email="..." gmail.password="..."
// Example: https://github.com/firebase/functions-samples/blob/master/quickstarts/email-users/functions/index.js
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.sendMail = functions.https.onRequest((request, response) => {
  const mailOptions = {
    from: `Moqod <noreply@moqod.com>`,
    to: 'pravbeseda@yandex.ru',
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `New message from Moqod.com`;
  mailOptions.text = `Wow! It's work!`;
  return mailTransport.sendMail(mailOptions).then(() => {
    response.send("Done!");
    return console.log('New welcome email sent');
  });
})
