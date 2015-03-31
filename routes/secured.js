var koa=require('koa');
var app=koa();
var bodyParser=require('koa-body');
var Router=require('koa-router');
//var co=require('co');//4.5.1
//var request=require('co-request');//0.2.0
var rekwest=require('koa-request');//1.0.0
// var request=require('request');
var wrap=require('co-monk');
var fs=require('co-fs');

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

secured.get('/app/adduser',authed,function *(){
	var db=this.fuck;
	var allusers=wrap(db.get('users'));
	var users=yield allusers.find({});
	console.log('users :',users);
	yield this.render('adduser',{user:this.req.user,users:users});
});

secured.post('/addinguser',bodyParser({multipart:true,formidable:{}}),
function *(next){
	var db=this.fuck;
	var users=wrap(db.get('users'));
	yield users.insert({username:this.request.body.fields.username,
	                    email:this.request.body.fields.email,
						password:this.request.body.fields.password,
						role: this.request.body.fields.role});
	//console.log('in :'+this.request.body.fields.username);
this.body=JSON.stringify(this.request.body,null,2);
this.body={"rslt":this.request.body};
yield next;});
secured.get('/userbeta/:id',function *(id){
	var db=this.fuck;
	var users=wrap(db.get('users'));
	//var busers=db.get('users');
	
	var result=yield users.findById(this.params.id);
	console.log('users in result: '+result.username);
	
	/***
	busers.findById(this.params.id,function(err,user){
if(err){console.log(err);}
console.log('user: '+user);
	});***/
		console.log('this.params.id',this.params.id);
		//console.log('users in result:',result);
		yield this.body={result:result};
	});
	secured.get('/deletingUser/:id',function *(id){
	var db=this.fuck;
    var us=wrap(db.get('users'));
    yield	us.remove({_id:this.params.id});
	yield this.body={result:this.params.id,ms:"deleted!"};
	});
//iojs index	
secured.post('/edinguser',bodyParser({multipart:true,formidable:{}}),
function *(next){
	console.log(this.request.body.fields.username);
	var id=this.request.body.fields.id;
	var name=this.request.body.fields.username;
	var email=this.request.body.fields.email;
	var password=this.request.body.fields.password;
	var role=this.request.body.fields.role;
	var db=this.fuck;
	var us=wrap(db.get('users'));
	yield us.updateById(id,{username:name,email:email,password:password,role:role});
	this.body=JSON.stringify(this.request.body,null,2);
	this.body={"result":this.request.body};
	yield next;
});
secured.get('/app/files',authed,function *(){
	var paths=yield fs.readdir('view');
console.log('paths : '+paths);
	yield this.render('files',{user:this.req.user,paths:paths});
	
})
/***
secured.get('/getinguser,function*(){
var db=this.fuck;
var users_id=wrap(db.get('users'));
	var res=yield admin.findById({username:"Bob"});
})
***/
//iojs index
function *authed(next){
if(this.req.isAuthenticated() && this.req.user.role == "admin"){
 
yield next;}
else{ this.redirect('/');}}
module.exports=secured;