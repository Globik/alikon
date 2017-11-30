const mstring="What the fuck are you doing here??";
const crypto=require('crypto');
const ew=require('../libs/aes256gcm.js')

const lu='user_id';
const key=new Buffer(crypto.randomBytes(32),'utf8')//process.env.BP_KEY
const aes256gcm=(key)=>{
const algo='aes-256-gcm';


const encrypt=(str,awd)=>{
let b=new Buffer.from(awd)
const iv=new Buffer(crypto.randomBytes(128),'utf8');
const cipher=crypto.createCipheriv(algo,key,iv);
cipher.setAAD(b);
console.log('setAAD: ',b.toString('utf8'))
let enc=cipher.update(str,'utf8','base64');
		enc+=cipher.final('base64');
		console.log('iv: ',iv.toString('base64'),' authTag: ',cipher.getAuthTag().toString('base64'))
		var text=[cipher.getAuthTag().toString('base64'),iv.toString('base64'),enc].join(':');
		console.log('text: ',text)
		var text2=text.split(':');
	console.log('TEXT2: ',text2)
	console.log('tag: ',text2[0])
	console.log('iv: ',text2[1])
	console.log('enc: ',text2[2])
		//return [enc,iv,cipher.getAuthTag()];
	return text;
};
const decrypt=(txt,awd)=>{
let b=new Buffer.from(awd)
let a=txt.split(':')
console.log('A: ',a)
if(a.length !==3){throw new Error("fuck length not does")}
let [authTag,iv,enc]=a
//iv.toString('base64')
console.log('authTag: ',authTag);
	let ab=new Buffer(authTag,'base64');
	//let iv2=new Buffer(iv,'base64')
	let iv2=Buffer.from(iv,'base64')
	
const decipher=crypto.createDecipheriv(algo,key,iv2);
	decipher.setAAD(b)
	decipher.setAuthTag(ab)
	let str=decipher.update(enc,'base64','utf8');
		str+=decipher.final('utf8')
		return str;
	}
	return {encrypt,decrypt}
}

console.log('key: ',key.toString('hex'))
console.log('key length: ',key.toString('base64').length)
console.log('key base64: ',key.toString('base64'))
const aescipher=aes256gcm(key)
const encrypted=aescipher.encrypt(mstring,lu)
console.log('encrypted: ',encrypted)
try{
const decrypted=aescipher.decrypt(encrypted,lu)
console.log('decrypted: ',decrypted)
}catch(e){console.log('err: ',e.message)}

const ewa=ew(key)
const enci=ewa.encrypt('mama geht ins дурак.',lu)
console.log('ENCI: ',enci)
const denci=ewa.decrypt(enci,lu)
console.log('DENCI: ',denci)