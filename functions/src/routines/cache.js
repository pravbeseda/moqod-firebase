const admin = require('firebase-admin');
admin.initializeApp();

module.exports.read = function (name, callback) {
  admin.database().ref('users').once('value', (snapshot) => {
    console.log('readCache');
    let data = snapshot.val();
    let now = Date.now();
    let expire = (data && data.expire) ? data.expire : 0;
    if (expire > now) {
      return callback(data);
    } else {
      console.log('Cache is outdated', {
        expire: expire,
        date: now
      });
      return callback(false);
    }    
  }, (error) => {
    console.error('Error while read cache!');
    return callback(false);
  });
}

module.exports.write = function (name, timeLife, data) {
  console.log('writeCache, timeLife=' + timeLife);
  data.expire = Date.now() + timeLife * 1000;
  admin.database().ref('users').set(data);
}
