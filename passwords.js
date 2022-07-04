const crypto = require("crypto");

function create(password, _callback) {
  //let salt = generateSalt(10);
    //Salting is disabled because there is no way to identify the key in the database with a salt unless you use a username or id system
 /* let hash = crypto
    .createHash("md5")
    .update(password + salt)
    .digest("hex");*/
    let hash = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");
 // _callback(salt + hash);
 _callback(hash);
}



function generateSalt(len) {
  let set = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ",
    setLen = set.length,
    salt = "";
  for (var i = 0; i < len; i++) {
    let p = Math.floor(Math.random() * setLen);
    salt += set[p];
  }
  return salt;
}

module.exports = {
  create: create,
  random: generateSalt,
};
