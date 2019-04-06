const crypto=require('crypto')
const key=new Buffer(crypto.randomBytes(32),'utf8')
//console.log(key)
let a=key.toString('base64')
console.log('copy this to process.env.BITPAYS_KEY: \n',a)
//let b=Buffer.from(a,'base64')
//console.log('b: ',b)
//sudo leafpad /etc/environment
// echo $BITAPS_KEY