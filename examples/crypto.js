const str="Mama geht ins Kino";
const pwd="secret";
const rc="BTCvb1EkcMq3UanuFacxRpW9Ei4ePLt9HQ8SXTgZVhSQFRA4NB7Le";

const crypto=require('iocane').crypto;
/*
crypto.encryptWithPassword(str,rc).then(v=>{
console.log('v: ',v)
})
*/


const v2='2+I6IGD+nJowjfi+nkgTBjpQ1qYYJ22AcwSokrRGVpQ=$029b7fb0b9ee7974a5365ae0667c6a0f$58d78fd5e6e3$b5f7a65ff4cf6bf6185f983ef0c7dff33e3c59dc454818608224a2d92cce80b3$218503';
//globik@globik-laptop:~/alikon/examples$ node crypto
const  v3='Hqy+8rS3+lbwispAhKffdIL6s1M4dYC+/j3vtZG72VE=$630e3ce0bbf7d9ceb60a664c9e684128$475bba7f9770$71bcbc1de80f863d73d73d1f4c2e2d872d9b962ca5251424ebda2322be5cc946$225331';
const rc2='mrr55RA2vDOr6u+eHezC3DsV1MD/aQpcCrh0Hz4dAuZFA1/AvXvTFpYmGQmXgrMsHnVgVtCqZposI9OQtvTOfQ==$008b1991c7d3a73361bf8db13c3f5ead$f85ba501be5b$eda116766b301f809f09f9df5169ee7d5e677cba214aad73a8cbc0ba7835ee74$229337';
console.log('len: ',rc2.length,' : ', rc.length)

crypto.decryptWithPassword(v2,pwd).then(decr=>{
console.log('Result of decoding word: ',decr)
}).catch(e=>{console.log(e)})

/*
crypto.decryptWithPassword(rc2,pwd).then(decr=>{
console.log('decr v3: ',decr)
}).catch(er=>{console.log('err3: ',er)})
*/
/*var crypto=require('crypto')
crypto.pbkdf2('secret','salt',10,64,'sha512',(err,k)=>{//pwd,salt,numberofrounds,bits
if(err)throw err;
	console.log('hmac k?: ',k.toString('hex'))
})
let iv=new Buffer(crypto.randomBytes(16)),
	ivhex=iv.toString('hex');
console.log('ivhex: ',ivhex)
*/

/*
 iocane decrypting using password +0ms
  iocane unpacking encrypted content +3ms
  iocane generating derived key using build-in method +5ms
  iocane decrypting content +2s
  iocane decrypting using build-in method +1ms
decr v2:  Mama geht ins Kino
globik@globik-laptop:~/alikon/examples$ node crypto
  iocane encrypting using password +0ms
  iocane generating salt of length: 12 +11ms
  iocane generating salt using build-in method +9ms
len:  206  :  53
  iocane generating derived key using build-in method +5ms
  iocane encrypting content +2s
  iocane encrypting using build-in method +1ms
  iocane generating IV +1ms
  iocane generating IV using build-in method +0ms
  iocane packing encrypted content +7ms
v:  2E+laxzUsYYrdWdc+h7F2cwAOmjseLBR0DQq6y/v0sw=$003c0d2ed4a69d694fcf7bf1a9741d48$e63cd5ebaf7f$458a542d77f9def94699695018afa2
*/