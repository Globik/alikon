var koa=require('koa');
var app=koa();
var bodyParser=require('koa-body');
var Router=require('koa-router');
//var co=require('co');//4.5.1
//var request=require('co-request');//0.2.0
var rekwest=require('koa-request');//1.0.0
// var request=require('request');

var sendgrid=require('sendgrid')('sendgrid44248@modulus.io','u1vin9v9');
var secured=new Router();

secured.get('/app',authed,function *(){
var body= this.req.user.username;
console.log('this.req.user.username in app: '+body);
yield this.render('app',{user:this.req.user});});
var iceConfig=[];
secured.post('/gamma',bodyParser({multipart:true,formidable:{}}),
function *(next){
	/***
	sendgrid.send({to:'gru5@yandex.ru',
               from:'ag1@yandex.ru',
               subject:'Hello Hujarkus!!!',
               text:'Sending email from heroku, eine Probe,alikon.herokuapp,  by admin Globi. OK?'},
function(err,json){
if(err){return console.log(err);}
console.log(json);});});
***/
/***
request.post('https://api.xirsys.com/getIceServers', {
form: {
ident: "rony",
secret: "ff6a4897-e05c-4a19-9d2d-f555857a024a",
domain: "globibot.herokuapp.com",
application: "default",
room: "default",
secure: 1},
json: true},
function (error, response, body) {
if (!error && response.statusCode == 200) {
// body.d.iceServers is where the array of ICE servers lives
iceConfig = body.d.iceServers;  
 console.log(iceConfig);
 //callback(null, iceConfig);
 }});
 ***/
 
//POST example:
/***
  co(function* () {
  var result = yield request({
  	uri: 'https://api.xirsys.com/getIceServers',
  	method: 'POST',
	form: {
ident: "rony",
secret: "ff6a4897-e05c-4a19-9d2d-f555857a024a",
domain: "globibot.herokuapp.com",
application: "default",
room: "default",
secure: 1},
json: true
  });
})();
***/
var uri="https://api.xirsys.com/getIceServers"; 
var ops={form:{ident: "rony",
secret: "ff6a4897-e05c-4a19-9d2d-f555857a024a",
domain: "globibot.herokuapp.com",
application: "default",
room: "default",
secure: 1}};

 var result=yield rekwest.post(uri,ops);
//var inf=JSON.parse(result.body);
var inf=result.body;//verno pravilno
console.log('fuck-info :'/*+inf.d.iceServers*/+inf);
console.log('this.request.body.fields: ',this.request.body.fields);
this.body=JSON.stringify(this.request.body,null,2);
this.body={"OK":"2222 formidable","was namlich":this.request.body.fields,"inf":inf};
yield next;
}
);
//iojs index
function *authed(next){
if(this.req.isAuthenticated()){
 
yield next;}
else{ this.redirect('/');}}
module.exports=secured;