var koa=require('koa');
var app=koa();
var port=process.env.PORT || 5000;
//var api_key='key-4a36b59263e3b48b86d3979bf0d2a12f';
//var domain='alikon.herokuapp.com';//'localhost:5000';
//var domain='postmaster@appb17d1ae4924645aab6a69471af346072.mailgun.org'
var api_key='key-ccc5240f6321d65a0851accd7b2f4d98';
var domain='sandboxad7b6f5bd4044d34a8c0df473092b78c.mailgun.org';
var mailgun=require('mailgun-js')({apiKey: api_key, domain:domain});
app.use(function*(next){
var start=new Date;
yield next;
var ms=new Date - start;
console.log('%s %s - %s ',this.method,this.url,ms);
});
app.use(function*(){
this.body="Hello World(koa.js)!";
});

var data={
from: 'Excited users <me@samples.mailgun.org>',
to:'gru5@yandex.ru',
subject:'Hello world!',
text:'Testing some mailgunomness!'
};

mailgun.messages().send(data, function(error, body){
if(error) console.log('error: ',error);
console.log('Body: ', body);
});
app.listen(port);
console.log('Server is running on port ',port);
/*

You are receiving this because you (or someone else) have requested the reset of the password for your
account. Please click on the following link, or paste this into your browser to complete the process:
http://localhost:5000/reset/378fd4...
If you did not request this, please ignore this email and your password will remain unchanged.
===
sunject: Your password has been changed

Hello,
this is a confirmation that the password for your account 555 has just been changed.

*/
