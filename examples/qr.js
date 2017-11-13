var qr=require('qrcode-js')
var url="http://example.com"
var b=qr.toDataURL(url,4)
console.log('b: ',b);