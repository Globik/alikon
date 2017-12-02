const crypto=require('crypto')
const aes256gcm=key=>{
if(!key){throw new Error("ENVIRONMENT BITPAYS_KEY must be provided. Run libs/randombit.js and copypaste output into environment.")}
const algo='aes-256-gcm';
const encrypt=(str,awd)=>{
if(!str || str.length==0 || !awd){throw new Error("No text or aad for ecrypting provided!")}
let b=new Buffer.from(awd)
const iv=new Buffer(crypto.randomBytes(128),'utf8'),
cipher=crypto.createCipheriv(algo,key,iv)
cipher.setAAD(b)
let enc=cipher.update(str,'utf8','base64')
	enc+=cipher.final('base64')
let text=[cipher.getAuthTag().toString('base64'),iv.toString('base64'),enc].join(':')
return text;
}
const decrypt=(txt,awd)=>{
if(!txt || txt.length==0 || !awd){throw new Error("No encrypted text or aad provided!")}
let b=new Buffer.from(awd),a=txt.split(':')
if(a.length !==3){throw new Error("Decryption error - unexpected number of encrypted components.")}
let [authTag,iv,enc]=a,
ab=Buffer(authTag,'base64'),
iv2=Buffer.from(iv,'base64')
const decipher=crypto.createDecipheriv(algo,key,iv2);
decipher.setAAD(b)
decipher.setAuthTag(ab)
let str=decipher.update(enc,'base64','utf8');
str+=decipher.final('utf8')
return str;}
return {encrypt,decrypt}
}
module.exports=aes256gcm;