function getUserByEmail(email, database) {
  for (let key in database){
if (email === database[key].email) {
  return database[key];
   }
  }
  return undefined;
}

function urlsForUser(userid, urldatabase) {
  let userURLs = {}
  for (let url in urldatabase) {
    if (urldatabase[url].userid === userid) {
      userURLs[url] = urldatabase[url];
    }
  }
   return userURLs;
  }
  
function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generateRandomString() {
  return makeid(6);
}


module.exports = {
  generateRandomString,
  urlsForUser,
  getUserByEmail
};
