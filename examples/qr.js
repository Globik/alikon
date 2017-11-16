var qr=require('qrcode-js')
var url="http://example.com"
//var b=qr.toDataURL(url,4)
var b=qr.toBase64(url,4)
console.log('b: ',b);
//test also
//github.com/JianmingXia/QRCoddeJs