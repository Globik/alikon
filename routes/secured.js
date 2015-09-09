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

//var sendgrid=require('sendgrid')('sendgrid44248@modulus.io','u1vin9v9');
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
	
	secured.post('/savefile',authed,function *(next){
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
//articles manager warum gehts nicht
secured.get('/app/articlesmanager',authed,function *(){
var db=this.fuck;
var posts=wrap(db.get('posts'));
var doc=yield posts.find({});
//var fotos=yield fs.readdir('public/images/uploads');
yield this.render('articles-manager',{user:this.req.user,posts:doc});
});
//file-upload.html

secured.get('/app/filesuploader',authed,function *(){
	yield this.render('files-upload',{user:this.req.user});
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
	title:slug,
	autor:autor,
	shorti:shorti,
	caption:caption,
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
	dataformat:post.dataformat,
	category:post.category,
	rubrik:post.rubrik,
	meta:post.meta,
	redaktiert:post.redaktiert,
	visa:post.visa,
	title:post.title,
	serial:post.serial,
	};
	}
catch(err){
yield this.body={data:err};}
});

secured.post('/saveaneditedpost', bodyParser({multipart:true,formidable:{}}),
function *(next){
var postname=this.request.body.fields.postname;
	var slug=sluger(postname);
	//slugify(postname);
// autor shorti caption maincontent dataformat meta category rubrik serial * 
//created redaktiert visa(1 2 3)
var title=slug;
console.log(title);
	var autor=this.request.body.fields.autor;
	var shorti=this.request.body.fields.shorti;
	var caption=this.request.body.fields.caption;
	var maincontent=this.request.body.fields.maincontent;
	var dataformat=this.request.body.fields.dataformat;
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
try{
var doc=wrap(db.get('posts'));
/***
yield doc.updateById(id,{
postname:postname,
title:title,
//autor:autor,
shorti:shorti,
caption:caption,
maincontent:maincontent,
meta:meta,
//dataformat:dataformat,
//category:category,
//rubrik:rubrik,
//serial:serial,
redaktiert:redaktiert,
//created:created,
visa:visa
});***/
yield doc.updateById(id,{$set:{postname:postname,title:title,
caption:caption,
maincontent:maincontent,shorti:shorti,meta:meta,visa:visa}},{$currentDate:{redaktiert:true}});
this.body=JSON.stringify(this.request.body,null,2);
this.body={"result":"OK - saved an edited post "+title}
}catch(err){this.body={err:err}}
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

secured.post('/adding_fotos',authed,bodyParser({multipart:true,formidable:{uploadDir:'./public/images/upload/tmp',
keepExtensions:true}}),function *(next){
	var errs=[];
if('post' !=this.method)return yield next;
var files;
//console.log('HEADERS :',this.headers);
//content-length,referer
var extarr=['.png','.jpg'];
var mimetypes=['image/png','image/jpeg'];
var a=this.request.body.fields.nochwas;//=name of folder(aka album ._id)
var who=this.request.body.fields.who//=user._id
console.log('A :',a);
var b=this.request.body.files.file.name;
var p=this.request.body.files.file.path;
var size=this.request.body.files.file.size;
console.log('SIZE :',size);
if(size === 0){fso.unlink(p,function(err){console.log('ERROR in err.length :',err)});
this.throw(400,"no file provided")}

var t=this.request.body.files.file.type;

 files=this.request.body.files.file;
console.log('isArray? :',Array.isArray(files));
var fils=Array.isArray(files);
console.log("PATH :",p);
var file_ext;

if(yield fs.exists('./public/images/upload/'+who)){
		console.log('exist!');
}
else{console.log('fuck');
yield fs.mkdir('./public/images/upload/'+who);
}
if(yield fs.exists('./public/images/upload/'+who+'/'+a)){
		console.log('exist!');
}
else{console.log('fuck');
yield fs.mkdir('./public/images/upload/'+who+'/'+a);
}
	var readstr;
	var writeStream;
	if(fils){
	var bs=files.length;
	var i=0;
	while(bs > 0){
		var file_ex=path.extname(files[i].name);
	if(file_ex_isvalid(file_ex) && mimetype_isvalid(files[i].type)){
	readstr=fso.createReadStream(files[i].path);
	writeStream=fso.createWriteStream(path.join('./public/images/upload/'+who+'/'+a+'/',files[i].name));
	readstr.pipe(writeStream);}
	bs--;i+=1;
	}
	//readstr.pipe(writeStream);
	readstr.on('error',function(err){console.log('In readstream :',err);});
	writeStream.on('error',function(err){console.log('In write stream: ',err);});
	readstr.on('close',function(){console.log('It looks like closed');
	for(var k=0;k<files.length;k++)
	fso.unlink(files[k].path,function(er){console.log('Error in unlink :',er);});
	});
	}else{
		var file_ex=path.extname(files.name);
	if(file_ex_isvalid(file_ex) && mimetype_isvalid(files.type)){
	readstr=fso.createReadStream(files.path);
	writeStream=fso.createWriteStream(path.join('./public/images/upload/'+who+'/'+a+'/',files.name));
	readstr.pipe(writeStream);
	
	readstr.on('error',function(err){console.log('In readstream :',err);});
	writeStream.on('error',function(err){console.log('In write stream: ',err);});
	readstr.on('close',function(){console.log('It looks like closed');
	fso.unlink(files.path,function(er){console.log('Error in unlink :',er);});
	});
	}else{
	//fso.unlink(files.path,function(er){console.log('ERR in mime type :',er);});
	try{fs.unlink(files.path);} catch(err){console.log('ERR in mime type :',er);}
	this.throw(404.3,'mime type only png and jps');
	 }
	}
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


var parse=require('co-busboy');

secured.post('/multipics',authed,function *(next){
	if ('POST' != this.method) 
return yield next;
var parts=parse(this,{autoFields:true});
//console.log('parts :',parts)
var part;
var picsSammler={};

 picsSammler.pics=[];

while(part=yield parts){
	var who=parts.field.who;
	console.log('USER ',who)
	var p=parts.field.nochwas;
if(yield fs.exists('./public/images/upload/'+who)){
		console.log('exist!');}
else{console.log('doesnt exist - moment mal');
yield fs.mkdir('./public/images/upload/'+who);
}
if(yield fs.exists('./public/images/upload/'+who+'/'+p)){
		console.log('exist!');
}
else{console.log('doesnt exist - moment mal');
yield fs.mkdir('./public/images/upload/'+who+'/'+p);
}
	if(part.length){console.log(part)}
	else{
		console.log('name :',part.filename+' k '+parts.field.nochwas);
		picsSammler.folder=parts.field.nochwas;
		//picsSammler.autor=who;
		//picsSammler.title='';
		//picsSammler.createdat=new Date();
		//picsSammler.multi=4;
	var stream= fso.createWriteStream(path.join('./public/images/upload/'+who+'/'+p+'/',part.filename));
         part.pipe(stream);
}
console.log('DONE ',parts.field.nochwas);
picsSammler.pics.push('/images/upload/'+who+'/'+p+'/'+part.filename);
part.on('error',function(er){console.log('error in part ',er)})
stream.on('error',function(er){console.log('err in stream',er)})
//part.on('end',function(){console.log('end part')});//true
 stream.on('close',function(){console.log('it looks like a close event in stream')})
}
//var db=this.fuck;
//var doc=wrap(db.get('fotoalbums'));
//var album=yield doc.insert(picsSammler);
yield this.body={inf:'ok',picssammler:picsSammler}
});
secured.post('/create_album',authed,function *(){
	var db=this.fuck;
	var docs=wrap(db.get('fotoalbums'));
	var title=this.request.body.title;
	var userId=this.request.body.userId;
	var multi=this.request.body.multi;
	var album;
	//var multi=4;
	var created_on=new Date();
	var flagexist;
	var folderexist;
	if(yield fs.exists('./public/images/upload/'+userId)){
		console.log('exist!');flagexist="schon";}
    else{console.log('doesnt exist - moment mal');
    yield fs.mkdir('./public/images/upload/'+userId);
	flagexist=true;
     }
	
	 var ind=yield docs.ensureIndex({title:1},{unique:true});
	 console.log('ensure index :',ind);
	 try{
	 album=yield docs.insert({title:title,user:userId,multi:multi,created_on:created_on});}catch(er){
		 console.log('er in catch insert',er);
		 console.log('er code :',er.code+' '+er.name);
		 if(er && (11000 === er.code || 11001 === er.code)){console.log('er ocured');
		 this.throw(400,"имя альбома уже существует. Дай другое имя.")
		 }
	 }
	
	if(album){
		if(yield fs.exists('./public/images/upload/'+userId+'/'+album._id)){
		console.log('exist!');folderexist="schon";}
        else{console.log('doesnt exist - moment mal');
        yield fs.mkdir('./public/images/upload/'+userId+'/'+album._id);
	    folderexist=true;
     }
	}
	yield this.body={info:"OK",flagexist:flagexist,folderexist:folderexist,album:album};
	 
});
secured.get('/getalbumlist',authed,function *(){
	var db=this.fuck;
	try{
	var albums=wrap(db.get('fotoalbums'));
	var folders;
	var falschf
	var album=yield albums.find({});
	
	 try{folders=yield fs.readdir('public/images/upload/'+album[0].user);
	 console.log('folders :',folders);}catch(err){console.log(err);}
	for(var i=0;i<album.length;i++){
	try{falschf=yield fs.readdir('public/images/upload/'+album[0].user+'/'+album[i]._id)}
	catch(err){console.log(err);
	console.log('falsch file :',falschf);
	try{var sa=yield albums.remove({_id:album[i]._id});console.log('sa :',sa);
	//yield doc.remove({_id:this.params.dataid});
	}catch(err){console.log('err in try of remove  :',err)}
	}}
	album=yield albums.find({});
	yield this.body={album:album,folders:folders}  
	}
	catch(err){yield this.body={err:err}}
})
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
secured.post('/multipicstodb',authed,function *(){
	var db=this.fuck;
	var doc=wrap(db.get('pics'));
	var fotos=this.request.body;
	try{var smf=yield doc.insert(fotos);
	yield this.body={info:smf};}catch(err){yield this.body={info:err};}
})
secured.post('/getdirectory',authed,function *(){
	var directory=this.request.body.directory;
	console.log('DIRECTORY :',directory);
	try{
	var folders=yield fs.readdir('public/images/upload');
	yield this.body={info:"OK",directory:directory,folders:folders}
	}catch(err){yield this.body={info:err};}
})

secured.post('/showfolder',authed,function *(){
	console.log("USER : ",this.req.user._id);
	var foldername=this.request.body.foldername;
	console.log('FolderName :',foldername);
	try{
	var fotkis=yield fs.readdir('public/images/upload/'+foldername);
	yield this.body={info:"OK",foldername:foldername,fotkis:fotkis}
	}catch(err){yield this.body={info:err};}
})
secured.post('/open_this_fold',authed,function *(){
	console.log("USER :",this.req.user._id);
	var basedir='/images/upload/';
	var foldername=this.request.body.foldername;
	var who=this.request.body.who;
	try{
	var fotkis=yield fs.readdir('public/images/upload/'+who+'/'+foldername);
	yield this.body={info:"OK",foldername:foldername,fotkis:fotkis,basedir:basedir,who:who}
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
	/*************************************
	files-manager.html
	**************************************/


	var fsplus=require('co-fs-plus');
	
	secured.get('/app/filesmanager',authed,function *(){
	
var dir='public';
try{
var folds_dir=yield fs.readdir('public');
mata=[];
var hui=[];

for(var i=0;i<folds_dir.length;i++){
	var el=folds_dir[i];
	var a= yield fs.stat('public/'+el);
	//if(a.isDirectory())
	mata.push({file:el,isFile:a.isFile(),path:path.join('',el),ext:path.extname(el)})
	}
	//console.log('alles :',mata);*/
	/**** 
	recursive
	***/
	
	var rec=co.wrap(function* (r){
var ab=[];
var inos=[];
var redr=co.wrap(function* (r){
var items=yield fs.readdir(r);
for(var i=0;i<items.length;i++){
//for(let i of items){
var fp=path.join(r,items[i]);
var stats=yield fs.stat(fp);
inos.push(stats.ino);
ab.push({name:items[i],/*_id:items[i],*/
/*parent_id:str.split("\\")[str.split("\\").length-2]*/
/*parent_id:str.split(path.sep)[str.split(path.sep).length-2],*/ino_id:stats.ino,
ino_prev_id:(inos[inos.length-2] == undefined ? "0" : inos[inos.length-2]),
_id:fp,parent_id:path.dirname(fp),is_file:stats.isFile()
});
if (stats.isDirectory()) yield redr(fp);
} 
return {ab:ab};
});
//console.log(' :',ab);
return redr(r).then(function(re){return re;}).catch(function(e){throw e;})
});
var answerfiles;
yield rec('public').then(function(d){
//console.log(d);
answerfiles=d;}).catch(function(err){console.log(err);});
/*** end of recursive ************************************************** ***/
	
yield this.render('files-manager',{user:this.req.user,foldsdir:folds_dir,mata:mata,
answerfiles:answerfiles});
}catch(err){this.flash={fucker:err.toString()};this.redirect('/error-view');}
});

secured.post('/that_direction',authed,function *(){
	var mata=[];
	var dublic='public/';
	var name=this.request.body.foldername;
	console.log("NAME :",name);
	var basedir=this.request.body.basedir;
	console.log("BASEDIR :",basedir);
	try{
	var folds_dir=yield fs.readdir(dublic+basedir+name);
	for(var i=0;i<folds_dir.length;i++){
var el=folds_dir[i];
	var a=yield fs.stat(path.join(dublic+basedir+name,el));
	mata.push({file:el,isFile:a.isFile(),relpath:path.join(''+basedir,name+'/'),path:path.join(''+basedir,name+'/'+el),ext:path.extname(el)});
	
	//console.log('this path :',this.path);
	//console.log('url :',this.url);
	}
	}
    catch(er){this.throw(404,"No such dir : "+er);}
	//console.log('ALLES MATA :',mata);
yield this.body={folds_dir:folds_dir,mata:mata}
});

secured.get('/app/filesmanager/:name',authed,function *(name){
		console.log('this.params.name',this.params.name);
		var ds=this.params.name;
		var ps=ds.replace(/[8]/g,"/");
		console.log('ps :',ps);

		try{
		var file_content=yield fs.readFile('./public/'+ps,'utf-8');}
		catch(err){console.log(err);this.flash={fucker:err.toString()};qu=err.toString();}
		//console.log('file content: '+file_content);
		yield this.render('fileedition',{user:this.req.user,file_content:file_content,file_path:ps,
		error_message:this.flash.fucker})
	});
	
	secured.post('/save_file_content',authed,function *(next){
		if ('POST' != this.method) return yield next;
		var path=this.request.body.path;
		console.log('path :',path);
	var val=this.request.body.val;
if(val=="") this.throw(404,"must be some content");	
		try{
			var ws=yield fs.writeFile('./public/'+path,val);
		}
		catch(err){
			this.throw(404,`Some error :${err}`);
		}
		//node index
	yield this.body={info:"ok - saved!"};
	});
	secured.post('/create_that_folder',authed,function *(next){
	if ('POST' != this.method) return yield next;	
	var pat=this.request.body.path;
	var name=this.request.body.name;
	console.log('name :',name)
	//if(name="") this.throw(404,"Give a name for folder")
try{
//if(yield fs.exists(path.join('./public',name))){
		//console.log('exist!');}
//else{console.log('doesnt exist - moment mal');
yield fs.mkdir(path.join('./public/',pat+name));
//console.log('b :',b)

}catch(err){this.throw(404,"Some error :"+err);}	
yield this.body={info:"ok - the folder created!"}
	});
	
	secured.post('/delete_that_pass',authed,function *(next){
		if('POST' !==this.method) return yield next;
		var error=[];
		var pat=this.request.body.path;
		console.log('removing this path:',pat);
		var isfile=this.request.body.isfile;
		try{yield fs.unlink(path.join('./public/',pat));}catch(err){
			console.log('About deleting the file');
			error.push(err);
			
			try{yield fs.rmdir(path.join('./public/',pat))}catch(err){
				error.push(err)
				console.log('About deleting dir in co-fs',path.join('./public/',pat));
				try {console.log('About deleting dir in co-fs-plus :',path.join('./public/',pat))
					yield fsplus.rimraf(path.join('./public/',pat));
				}catch(err){error.push(err);this.throw(404,err)}
				
				}
		}
		//try{yield fs.rmdir(path.join('./public/',pat));}catch(err){this.throw(404,"err :"+err)}
		yield this.body={info:"ok - deleted!",body:this.request.body,error:error}
	})
	
	/*
	secured.post('/savefile',authed,function *(next){
		//if(this.is('json')=='json')
		var bu=this.request.body;
		console.log('is this json? '+this.is('json'))
		console.log('bu filename '+bu.file_name);
		console.log('bu file content:  '+bu.file_content);
		yield fs.writeFile('./view/includes/footer.html',bu.file_content);
		this.body=JSON.stringify(this.request.body,null,2);
	this.body={resultA:this.request.body,result:"OK - saved!"};
	yield next;
	});*/
/******************************************************************************************/
//iojs index
function *authed(next){
if(this.req.isAuthenticated() && this.req.user.role == "admin"){
 
yield next;}
else{ this.redirect('/');}}
/*
function * main(){return ret=yield Promise.all([ 'hi, man!',2,3]);}
run(main).then(function fulfilled(v){console.log('promise success :',v);},function rejected(reason){
	console.log('reason :',reason);
})
function run(gen){
	var args=[].slice.call(arguments,1),it;
	it=gen.apply(this,args);
	return Promise.resolve()
	.then(function handlenext(value){
		var next=it.next(value);
		return(function handleresult(next){
			if(next.done){
				return next.value;
			}else{
				return Promise.resolve(next.value)
				.then(handlenext,function handleerr(err){
					return Promise.resolve(it.throw(err)).then(handleresult);
				})
			}
		})(next);
	});
}
function go_(machine,step){
	while(!step.done){
		var arr=step.value(),state=arr[0],value=arr[1];
		switch (state){
			case "park":
			setImmediate(function(){go_(machine,step);});
			return;
			case "continue":
			step=machine.next(value);
			break;
		}
	}
}

function go(machine){
	var gen=machine();
	go_(gen,gen.next());
}
function put(chan,val){
	return function(){
		if(chan.length == 0){
			chan.unshift(val);
			return ["continue",null];
		}else{return ["park",null];}
	};
}
function take(chan){
	return function(){
		if(chan.length == 0){
			return ["park",null];
		}else{var val=chan.pop();
		return ["continue",val]}
	};
}
var c=[];
go(function *(){
	for(var i=0;i<10;i++){
		yield put(c,i);
		console.log('process one put ',i);
	}
	yield put(c,null);
});
go(function *(){
	while(true){
		var val=yield take(c);
		if(val == null){break;}
else{console.log('process two took ',val);}	}
});*/
module.exports=secured;