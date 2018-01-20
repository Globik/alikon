const {measure}=require('/home/globik/globibot/measure.js');
var qr=require('qrcode-js')
//var url="http://example.com"
var url="mama";
//var b=qr.toDataURL(url,4)
function boo(n){
for(var i=0;i<n;i++){
var b=qr.toBase64(url,4)
console.log('b: ',b.toString('base64').substring(0,16));
}
}

var boo=measure(boo);
//boo(1);
//boo(1);
boo(100);
//test also
//github.com/JianmingXia/QRCoddeJs