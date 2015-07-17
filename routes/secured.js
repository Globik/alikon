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
var fso=require('fs');
var path=require('path');
var moment=require('moment');
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
	sendgrid.send({to:'gru@yandex.ru',
               from:'ag@yandex.ru',
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
/***
secured.post('/app/upload',authed,bodyParser({multipart:true,formidable:{uploadDir:'./public/images/uploads',keepExtensions:true}}),function *(next){
var form= new formidable.IncomingForm();
console.log(this.request.body.fields);
console.log(this.request.body.files);
this.body=JSON.stringify(this.request.body,null,2);
yield next;})***/


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
	//console.log('users in result: '+result.username);
	
	/***
	busers.findById(this.params.id,function(err,user){
if(err){console.log(err);}
console.log('user: '+user);
	});***/
		//console.log('this.params.id',this.params.id);
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
//articles manager
secured.get('/app/articlesmanager',authed,function *(){
var db=this.fuck;
var posts=wrap(db.get('posts'));
var doc=yield posts.find({});
var fotos=yield fs.readdir('public/images/uploads');
yield this.render('articles-manager',{user:this.req.user,fotos:fotos,posts:doc});
});
var sluger=require('limax');
secured.post('/createpost',bodyParser({multipart:true,formidable:{}}),
function *(next){
	var postname=this.request.body.fields.postname;
	var slug=sluger(postname);//slugify(postname);
	
	var autor=this.request.body.fields.autor;
	var shorti=this.request.body.fields.shorti;
	var caption=this.request.body.fields.caption;
	var maincontent=this.request.body.fields.maincontent;
	var meta=this.request.body.fields.meta;
	var category=this.request.body.fields.category;
	var rubrik=this.request.body.fields.rubrik;
	var serial=this.request.body.fields.serial;
	
	var date=moment();
	var forma=date.format('YYYY[/]MM[/]DD');
	//format('YYYY[/]MM[/]DD[/]')
	var db=this.fuck;
	var posts=wrap(db.get('posts'));
yield posts.insert({
	postname:postname,
	title:slug,autor:autor,
	shorti:shorti,caption:caption,
	maincontent:maincontent,
	meta:meta,
	category:category,
	rubrik:rubrik,
	serial:serial,
	created:new Date(),
	dataformat:forma,
	redaktiert:new Date(),
	visa:2
	});
this.body=JSON.stringify(this.request.body,null,2);
this.body={"result":this.request.body,"slugified":slug,"time":forma};
yield next;});

function slugify(text){
	return text.toString().toLowerCase().replace(/\s+/g,'-')
	.replace(/[^\w\-]+/g,'').replace(/\-\-+/g,'-').replace(/^-+/,'').replace(/-+$/,'');
}

secured.get('/takePost/:dataid',function *(dataid){
var db=this.fuck;
var doc=wrap(db.get('posts'));
try{
 var post= yield doc.findById(this.params.dataid);
//console.log('post.maincontent',post.maincontent);
yield this.body={
	postname:post.postname,
	autor:post.autor,
	created:post.created, 
	shorti:post.shorti,
	caption:post.caption,
	maincontent:post.maincontent,
	category:post.category,
	rubrik:post.rubrik,
	meta:post.meta,
	redaktiert:post.redaktiert,
	visa:post.visa,
	title:post.title,
	serial:post.serial};
	}
catch(err){
yield this.body={data:err};}
});

secured.post('/saveaneditedpost',bodyParser({multipart:true,formidable:{}}),
function *(next){
var postname=this.request.body.fields.postname;
	var slug=sluger(postname);//slugify(postname);
// autor shorti caption maincontent meta category rubrik serial * 
//created redaktiert visa(1 2 3)
var title=slug;
console.log(title);
	var autor=this.request.body.fields.autor;
	var shorti=this.request.body.fields.shorti;
	var caption=this.request.body.fields.caption;
	var maincontent=this.request.body.fields.maincontent;
	var meta=this.request.body.fields.meta;
	var category=this.request.body.fields.category;
	var rubrik=this.request.body.fields.rubrik;
	var serial=this.request.body.fields.serial;
	var redaktiert=new Date();
	var created=this.request.body.fields.created;
var visa=this.request.body.fields.visa;
console.log('visa :'+visa);
var id=this.request.body.fields.id;
var db=this.fuck;

var doc=wrap(db.get('posts'));
yield doc.updateById(id,{
postname:postname,
title:title,
autor:autor,
shorti:shorti,
caption:caption,
maincontent:maincontent,
meta:meta,
category:category,
rubrik:rubrik,
serial:serial,
redaktiert:redaktiert,
created:created,
visa:visa
});
this.body=JSON.stringify(this.request.body,null,2);
this.body={"result":"OK - saved an edited post "+title}
});

secured.get('/deletePost/:dataid',authed,function *(dataid){
var db=this.fuck;
var doc=wrap(db.get('posts'));

try{
 var post= yield doc.remove({_id:this.params.dataid});
yield this.body={"info":"ok - deleted!"}
}
catch(err){
yield this.body={data:err};}
});

secured.post('/addingfotos',authed,bodyParser({multipart:true,formidable:{uploadDir:'./public/images/upload/tmp',
keepExtensions:true}}),function *(next){
if('POST' !=this.method)return yield next;
var files;
var extarr=['.png','.jpg','.gif'];
var mimetypes=['image/png','image/jpeg'];
var a=this.request.body.fields.nochwas;
console.log('A :',a);
var b=this.request.body.files.file.name;
var p=this.request.body.files.file.path;
var size=this.request.body.files.file.size;
var t=this.request.body.files.file.type;

 files=this.request.body.files.file;
console.log('isArray? :',Array.isArray(files));
var fils=Array.isArray(files);
console.log("PATH :",p);
var file_ext;
if(yield fs.exists('./public/images/upload/'+a)){
		console.log('exist!');
}
else{console.log('fuck');
yield fs.mkdir('./public/images/upload/'+a);
}

if(fils == true){
for(var i=0;i<files.length;i++){
console.log('PATH[i] :',files[i].path);
p=files[i].path;
b=files[i].name;
t=files[i].type;
console.log('PATH.EXTNAME of FILENAME :',path.extname(b));
renameFile(a,p,b,t);
}} else{
	console.log('PATH.EXTNAME of FILENAME :',path.extname(b));
renameFile(a,p,b,t);
	 }
	 /***
function renameFile(papka,srcpath,targetname){
	var file_ex=path.extname(targetname);
	switch(file_ex){ case file_ex='.jpg':case file_ex='.png':
	fso.rename(srcpath,path.join('./public/images/upload/'+papka+'/',targetname),function(err){
	if(err)
    fso.unlink(srcpath);
fso.rename(p,path.join('./public/images/upload/'+papka+'/',targetname),function(err){console.log('Erst some err im ersten unlink');});
console.log('Files downloaded finally');});
	break;
	default:console.log('DEFAULT');
	fso.unlink(srcpath,function(err){console.log('Some err im zweiten unlink');});
	}}
	***/
	function renameFile(papka,srcpath,targetname,mtype){
	var file_ex=path.extname(targetname);
	
	if(file_ex_isvalid(file_ex) == true && mimetype_isvalid(mtype) == true){
	fso.rename(srcpath,path.join('./public/images/upload/'+papka+'/',targetname),function(err){
	if(err)
    fso.unlink(srcpath);
    fso.rename(p,path.join('./public/images/upload/'+papka+'/',targetname),function(err){
	console.log('Erst some err im ersten unlink');});
    console.log('Files downloaded finally');});	
		}else{console.log('DEFAULT');
	fso.unlink(srcpath,function(err){console.log('Some err im zweiten unlink');});}
	}
	
	/***function file_ex_isvalid(ext){
		var res=extarr.some(elem => elem == ext.toLowerCase());
            return res;
	}***/
	function file_ex_isvalid(ext){
		var res=extarr.some(function(el,i,ar){return el == ext.toLowerCase()});
		return res;
	}
	function mimetype_isvalid(mtype){
		var res=mimetypes.some(function(el,i,ar){return el==mtype;});
		return res;
	}
	
yield this.body={inf:"OK",fields:a,files:b,headers:this.request.body}
yield next;
});


secured.post('/picstopost',authed,function *(){
var db=this.fuck;
var bu=this.request.body;

console.log('is this json? ',this.is('json'));
console.log('images data ',bu.images);
console.log('Identificator: ',bu.bi);
var doc=wrap(db.get('posts'));
try{
var post=yield doc.updateById(bu.bi,{$set:{images:bu.images}});
yield this.body={info:"OK",body:bu}
}
catch(err){yield this.body={info:err}
}
});
secured.post('/getdirectory',authed,function *(){
	var directory=this.request.body.directory;
	console.log('DIRECTORY :',directory);
	try{
	var folders=yield fs.readdir('public/images/upload');
	yield this.body={info:"OK",directory:directory,folders:folders}
	}catch(err){yield this.body={info:err};}
})

secured.post('/showfolder',authed,function *(){
	var foldername=this.request.body.foldername;
	console.log('FolderName :',foldername);
	try{
	var fotkis=yield fs.readdir('public/images/upload/'+foldername);
	yield this.body={info:"OK",foldername:foldername,fotkis:fotkis}
	}catch(err){yield this.body={info:err};}
})
/* config.html */

secured.get('/app/config',authed,function *(){
yield this.render('configur',{user:this.req.user})	
})
secured.post('/lowaddtitle',authed,bodyParser({multipart:true,formidable:{}}),function *(next){
var lowdb=this.lowdb;
var req=this.request.body.fields;
var s=lowdb("navigation").push({ title:req.title,name:req.name,href:req.href});
yield this.body={info:"OK", res:this.request.body,s:s}	
	})
secured.post('/updatenavigation',authed,function *(){
var lowdb=this.lowdb;
//pervoje popavshee
var s=lowdb("navigation").chain().find({ name: 'sign up' }).assign({status: 'on'}).value(2);	
	yield this.body={s:s}
})	
	
//iojs index
function *authed(next){
if(this.req.isAuthenticated() && this.req.user.role == "admin"){
 
yield next;}
else{ this.redirect('/');}}
module.exports=secured;