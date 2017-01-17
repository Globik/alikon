var koa=require('koa');
var app=koa();
var co=require('co');
var port=process.env.PORT || 5000;


var api_key=process.env.TMAILGUNAPIKEY;
console.log('mailgun api key: ', api_key);

var domain=process.env.TMAILGUN_DOMAIN;
console.log('mailgun domain: ', domain);
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

var mdata={
from: 'Excited users <me@samples.mailgun.org>',
to:'gru5@yandex.ru',
subject:'Hello world!',
text:'Testing some mailgunomness!'
};

/*mailgun.messages().send(mdata, function(error, body){
if(error) console.log('error: ',error);
console.log('Body: ', body);
});
*/
/*
mailgun.messages().send(mdata).then(function(data){
console.log(data);},function(err){console.log(err);});
*/

function doit(rdata){
co(function*(){
try{
var sda=yield mailgun.messages().send(rdata);
console.log('sda: ',sda);
}catch(er){console.log(er);}
}).catch(function(e){console.log('e: ',e);});
}
doit(mdata);
/*
async function m(){
try{
var sda=await mailgun.messages().send(mdata);
console.log('sda: ',sda);
}catch(e){console.log('e: ',e);}
}
m();
*/
mailgun.lists('my_list@'+domain).info().then(data=>{console.log(data);}, err=>{console.log(err);});
app.listen(port);
console.log('Server is running on port ',port);
/*

You are receiving this because you (or someone else) have requested the reset of 
the password for your account. 
Please click on the following link, or paste this into your browser to complete the process:
http://localhost:5000/reset/378fd4...
If you did not request this, please ignore this email and your password will remain unchanged.
===
sunject: Your password has been changed

Hello,
this is a confirmation that the password for your account 555 has just been changed.

*/
