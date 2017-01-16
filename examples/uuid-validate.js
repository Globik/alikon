var validate=require('uuid-validate');
var b='2d70b88d-2770-4d5e-a68d-2825c4f80bc3';
var c='9e52b2ff-2d56-4a00-92e7-fca0a439c7e6';
var f='fake9e52b2ff-2d56-4a00-92e7-fca0a439c7e6';

var a=validate(b);
var d=validate(c);
var e=validate(f);
console.log('a, d, e: ', a,d,e);
var ab=validate.version(c);
console.log('ab version: ',ab);
var ab2=validate(c,4);
console.log('ab2 is 4: ',ab2);