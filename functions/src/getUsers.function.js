const cacheTimeLife = 300; // seconds 

const functions = require('firebase-functions');
const https = require('https');
const cors = require('cors')({origin: true});    
const cache = require('./routines/cache');

// firebase functions:config:set slack.tokens.usersList="..."
const slackTokenUsersList = functions.config().slack.tokens.users;

function prepareData(rawData) {
  let result = { success: false };
  let jsonRawData = {};
  try {
    jsonRawData = JSON.parse(rawData);  
  } catch (err) {
    result.message = "Parse rawData error";
    result.error = err;
    return result;
  }
 
  if (jsonRawData.ok && jsonRawData.members) {
    result.success = true;
    result.items = [];
    if (jsonRawData.members) {
      let length = jsonRawData.members.length;
      for (i = 0; i < length; i++) {
        if (!jsonRawData.members[i].deleted && !jsonRawData.members[i].is_bot && jsonRawData.members[i].name !== 'slackbot') {
          result.items.push({
            name: jsonRawData.members[i].profile.real_name || '',
            title: jsonRawData.members[i].profile.title || '',
            image: jsonRawData.members[i].profile['image_192'] || jsonRawData.members[i].profile['image_512'] || ''
          });          
        }
      }
    }
  }
  cache.write('users', cacheTimeLife, result);

  return result;
}


exports.getUsers = functions.https.onRequest((request, response) => {
    cors(request, response, () => {});
    cache.read('users', (cachedData) => {
      if (cachedData) {
        console.log('Data from cache');
        response.status(200).send(cachedData);
        return;
      }
      // No actual cache. Try to download data
      let agent = new https.Agent({keepAlive: true});
      req = https.request({
          host: 'slack.com',
          port: 443,
          path: '/api/users.list?token=' + slackTokenUsersList,
          method: 'GET',
          agent: agent,
      }, res => {
          let rawData = '';
          res.setEncoding('utf8');
          res.on('data', chunk => { rawData += chunk; });
          res.on('end', () => {
              console.log('Data from web');
              //cors(request, response, () => {
                response.status(200).send(prepareData(rawData));
              //});

          });
      });
      req.on('error', e => {
          response.status(500).send(`Error: ${e.message}`);
      });
      req.end();    
    });
});
