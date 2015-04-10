var koa=require('koa');
var app=koa();
var bodyParser=require('koa-body');
var Router=require('koa-router');
var co=require('co');//4.5.1
//var request=require('co-request');//0.2.0
var rekwest=require('koa-request');//1.0.0
// var request=require('request');
var wrap=require('co-monk');
var fs=require('co-fs');
//var parse=require('co-body');

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
domain: "alikon.herokuapp.com",
application: "default",
room: "default",
secure: 1}};

 var result=yield rekwest.post(uri,ops);
//var inf=JSON.parse(result.body);
var inf=result.body;//verno pravilno
console.log('fuck-info :'/*+inf.d.iceServers*/+inf.d);
console.log('this.request.body.fields: ',this.request.body.fields);
this.body=JSON.stringify(this.request.body,null,2);
this.body={"OK":"2222 formidable","was namlich":this.request.body.fields,"inf":inf};
yield next;
}
);
/***
//Users Management
http://lh:3000/app/adduser
=============================================================================================
=============================================================================================
***/
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
/*** end of Users Management ***/
/***
FilesManager
http://localhost:3000/app/files
 ================================================================================
 ============================================================================================= ***/
secured.get('/app/files',function *(){
	var paths=yield fs.readdir('view');
console.log('paths : '+paths[0]);
	yield this.render('files',{user:this.req.user,paths:paths});
	
})
secured.get('/alfafile/:name',authed,function *(name){
		console.log('this.params.name',this.params.name);
		//var b=yield fs.readFile('./view/'+this.params.name,'utf-8');
		var b=yield fs.readFile('view/includes/footer.html','utf-8');
		console.log('file content: '+b);
		yield this.body={str:this.params.name,file:b};
	});
	
	secured.post('/savefile',function *(next){
		//if(this.is('json')=='json')
		var bu=this.request.body;
		console.log('is this json? '+this.is('json'))
		console.log('bu filename '+bu.file_name);
		console.log('bu file content:  '+bu.file_content);
		yield fs.writeFile('./view/includes/footer.html',bu.file_content);
		this.body=JSON.stringify(this.request.body,null,2);
	this.body={resultA:this.request.body,result:"OK - saved!"};
	yield next;
	});
	/*** end of FilesManager ***/
	/*** modules 
	=******************************************************************************
	*******************************************************************************=
	= ***/
	secured.get('/app/modules',function *(){
		var db=this.fuck;
	var modules=wrap(db.get('modules'));
	var jobs=wrap(db.get('agendaJobs'));
	var mods=yield modules.find({});
	var job=yield jobs.find({});
	var data=job.map(function(ob){return ob.data;});
	//console.log('data',data);
	//console.log(job[4].data);
    console.log('modules : ',mods);
	yield this.render('modules',{user:this.req.user,mods:mods,jobs:job,data:data});
	});
	secured.post('/insertmodule',bodyParser({multipart:true,formidable:{}}),function *(next){
		var modulname=this.request.body.fields.modulname;
		var status=this.request.body.fields.status;
		var isfree=this.request.body.fields.isfree;
		console.log(modulname+status+isfree);
		var db=this.fuck;
		var modules=wrap(db.get('modules'));
	yield modules.insert({modulname:modulname,status:status,isfree:isfree});
	this.body=JSON.stringify(this.request.body,null,2);
	this.body={"result":this.request.body};
	yield next;	
	});
	/***
	secured.post('/savemodule',function *(next){
		var db=this.fuck;
		var bu=this.request.body;
		console.log(bu.is_free);
		console.log(bu.modul_id);
		var id=bu.modul_id;
		var mods=wrap(db.get('modules'));
		
		//yield us.updateById(id,{username:name,email:email,password:password,role:role});
		yield mods.updateById(id,{$set:{isfree:bu.is_free}}); 
		//--{$set:{completed:true}}
		this.body=JSON.stringify(this.request.body,null,2);
	this.body={resultRequest:this.request.body,result:"OK - saved!"};
	yield next;
	});
	***/
	secured.post('/savemodule',function *(next){
		var db=this.fuck;
		var bu=this.request.body;
		console.log(bu.status);
		console.log(bu.modul_id);
		var id=bu.modul_id;
		var mods=wrap(db.get('modules'));
		
		//yield us.updateById(id,{username:name,email:email,password:password,role:role});
		yield mods.updateById(id,{$set:{status:bu.status}}); 
		//--{$set:{completed:true}}
		this.body=JSON.stringify(this.request.body,null,2);
	this.body={resultRequest:this.request.body,result:"OK - saved!"};
	yield next;
	});
/*** 
end of modules =********************************************************************= 
***/
/***
agenda *******************************************************************************
***/
//node index
  //var Agenda=require('./index');//('Agenda');
  //var Agenda=require('Agenda');
  //var config=require('../config/database.js');
  //var locurl=config.localurl;
  //var produrl=config.url;
  //var agenda=new Agenda({db:{address: produrl}});//production
  //var agenda=new Agenda({db:{address:locurl}});//development
  //'localhost:27017/todo'}});
  //var agenda=require('../index');
  
secured.get('/app/agenda',function *(){
	//var db=this.fuck;
	yield this.render('agenda',{user:this.req.user});
});
secured.get('/agendall',authed,function *(){
	var db=this.fuck;
	var jobs=wrap(db.get('agendaJobs'));

	var job=yield jobs.find({});
	var data=job.map(function(ob){return ob.data;});
	console.log('data',data);
	this.body={result:"OK - agenda!",job:job,data:data};
});
secured.get('/delagenda/:name',function *(name){
	var db=this.fuck;
	/***
    var us=wrap(db.get('users'));
    yield	us.remove({_id:this.params.id});
	***/
	
	var agenda=this.agenda;
	agenda.cancel({name: this.params.name}, function(err, numRemoved) {
		if(err)console.log(err);
		console.log(numRemoved);
});
	yield this.body={result:this.params.name,ms:"deleted!"};
	});
	
	secured.post('/createagenda',bodyParser({multipart:true,formidable:{}}),
function *(next){
var name=this.request.body.fields.name;
var rubilnik=this.request.body.fields.rubilnik;

	var job = agenda.create(name, {to: rubilnik});
job.save(function(err) {
	if(err)console.log(err);
  console.log("Job successfully saved");
});


var db=this.fuck;
var agenda=this.agenda;
var modules = db.get('users');
agenda.define('reklama',{priority:'high',concurrency:10},function (job,done){

modules.find({}).on('success',function(doc){
	console.log("yes!!!!");
	console.log(doc);
	var data=job.attrs.data;
	console.log(data.to);
});
done();
});
//node index
this.body=JSON.stringify(this.request.body,null,2);
this.body={"rslt":this.request.body};
agenda.schedule('in 5 seconds','reklama',{to:'off'});
agenda.start();
yield next;});
//node index
secured.get('/agendafuck',authed,function *(){
	//sidebar ausschalten
	var db=this.fuck;
	var agenda=this.agenda;
    var us=db.get('modules');
	agenda.define('reklama',{priority:'high',concurrency:10},function (job,done){
	var data=job.attrs.data;
	us.update({modulname:"aside"},{$set:{status:data.to}},function(err,doc){
	if(err)console.log(err);
			//return done(err);
			console.log(doc);
	console.log(data.to);
	done();
	});
	});
	agenda.schedule('in 30 minutes','reklama',{to:'off'});
agenda.start();
	this.body={result:"OK - agenda!"};
});

secured.get('/agendamuck',authed,function *(){
	//sidebar einschalten
	var db=this.fuck;
	var agenda=this.agenda;
    var us=db.get('modules');
    var modules=wrap(db.get('modules'));
	var as=wrap(db.get('users'));
	agenda.define('reklama',{priority:'high',concurrency:10},function(job,done){
	co(function *(){
    try{	
//yield Promise.resolve(1)			
		var data=job.attrs.data;
		var mods=yield modules.update({modulname:"aside"},{$set:{status:data.to}});
	console.log('updated');
    console.log(data.to);
    }catch(err) {
	console.log(err);
    }}).catch(onerr)
	function onerr(err){console.log(err+' : '+err.stack);done(err);}
	done();
	});
	agenda.schedule('in 30 minutes','reklama',{to:'on'});
agenda.start();

	this.body={result:"OK - agenda Yiedable!"};
});


//************************************************************************
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