var crypto=require('crypto');
var algo='aes-256-ctr';
var pwd="world";
var em=require('../libs/email_enc.js')

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
console.log('fuck');


var emailhw=em.encrypt('ag1@yandex.ru');
console.log('emailhw: ',emailhw)
var email=em.decrypt(emailhw)
console.log('email: ',email);

var count=0;
var counti=()=>{
return count++;
}
module.exports={counti}