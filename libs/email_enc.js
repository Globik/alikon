var crypto=require('crypto');
var algo='aes-256-ctr';
var pwd="world";

function encrypt(text){
var cipher=crypto.createCipher(algo,pwd);
var crypted=cipher.update(text,'utf8','hex');
crypted+=cipher.final('hex');
return crypted;
}

function decrypt(text){
var decipher=crypto.createDecipher(algo,pwd)
var dec=decipher.update(text,'hex','utf8')
dec+=decipher.final('utf8')
return dec;
}

module.exports={encrypt, decrypt}