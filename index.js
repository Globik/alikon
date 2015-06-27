'use strict';
var crypto=require('crypto');
var koa=require('koa');
var render=require('koa-ejs');
var path=require('path');
var wait=require('co-wait');
var logger=require('koa-logger');
var serve=require('koa-static');
//var route=require('koa-route');
var Router=require('koa-router');
var flash=require('koa-flash');
var koaws=require('koa-ws');
var moment=require('moment');
//var parse=require('co-body');
//var bodyParser=require('koa-bodyparser');
var bodyParser=require('koa-body');
var session=require('koa-generic-session');
var MongoStore=require('koa-generic-session-mongo');

var passport=require('koa-passport');
var fuckall=require('./routes/database');
var secured=require('./routes/secured');
var configDB=require('./config/database.js');

var monk=require('monk');
var wrap=require('co-monk');
  //var db=module.exports=monk('mongodb://127.0.0.1:27017/todo');
  
  //poe
  var db=module.exports=monk(configDB.url || configDB.localurl);
  //var db=module.exports=monk(process.env.MONGOHQ_URL_TEST);
  var Agenda=require('agenda');
  
  var agenda=new Agenda({db:{address:configDB.url || configDB.localurl}});
  //var agenda=new Agenda({db:{address:process.env.MONGOHQ_URL_TEST}});
  //in index.js::bson=require('../browser_build/bson');c://bson/ext

/***	
var status;
agenda.on('start', function(job) {
	
  console.log("Job %s starting", job.attrs.name);
  //status=job.attrs.name;
  //return status;
  
});
***/
//console.log(status);


/***
exports.showMessage=function(agenda){
agenda.define('show message',function(job,done){
console.log('Shows message.');
done();
});
}***/
//collection from mongodb: db.agendaJobs.find()
  /***
 //var db=monk(process.env.MONGOHQ_URL,{w:1});***/
 //var jobSchedule=require('./routes/job-schedule.js');
    // jobSchedule.setupJobs("fucker");
//console.log("string: "+jobSchedule.setupJobs("fucker"));

var tasks=wrap(db.get('tasks'));
var busers = db.get('users');
/***
busers.findOne({username:"Bob"}).on('success',function(doc){
console.log('Document',doc);
console.log(doc.username);
//_id: 54c7815186d37cb8a2f49639
});
***/

//iojs index
var us=wrap(db.get('users'));


require('./config/passport')(passport);

var app=koa();
var mods=wrap(db.get('modules'));
    /***
	app.use(function *(next){
		var mdl=yield mods.findOne({modulname:"aside"});
		console.log('mdl.status :',mdl.status);
		yield next;
	});***/
var options={
serveClientFile:true,
clientFilePath:'/koaws.js',
heartbeat:true,
heartbeatInterval:5000};
app.use(koaws(app,options));
app.ws.register('hello',function *(){
this.result('world!');
});
/***
on client use koaws js
 koaws.register('session', function (err, payload) {
        if (err) console.error('Something went wrong', err);
        console.log(payload) // should include our session
    });

Connect to the server:

    koaws.connect();

    koaws.method('hello', function (err, result) {
        if (err) console.error('Something went wrong', err);
        console.log(result) // should log 'world!'
    });

***/

var locals={
version:'0.0.1',
message:'message must be',
signup:function *(){try{
	var mdsignup=yield mods.findOne({modulname:"signup"});
return mdsignup.status} catch(err){console.log(err);}
},
module:function *(){try{
		var mdl=yield mods.findOne({modulname:"aside"});
//console.log('mdl.status :'+ mdl.status);
return mdl.status}catch(err){console.log('err :'+err);}} ,
now:function(){
return moment(new Date()).format('MMM D');},
ip: function *(){
yield wait(100);
return this.ip;}
};
var filters={
    format: function (time){
    return time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate();
	
 }};

render(app,{
root:path.join(__dirname,'view'),
layout:'template',
viewExt:'html',
cache:false,
debug:true,
locals:locals,
filters:filters});



//mongodb://alik:123456@dogen.mongohq.com:10004/alikon-fantastic-database
app.use(serve(__dirname+'/public'));
app.use(logger());
app.keys=['fg'];
 //app.use(session({store:new MongoStore({db:"todo"})}));
 //app.use(session({store:new MongoStore({url:process.env.MONGOHQ_URL_TEST,db:"alikon-fantastic-database"})}));
 app.use(session({store:new MongoStore({url:configDB.url,db:"alikon-fantastic-database"})}));

app.use(passport.initialize());
app.use(passport.session());
app.use(Router(app));
app.use(bodyParser());
app.use(flash());
 //iojs index
app.use(function *(next){
this.fuck=db;
yield next;});

app.use(function *(next){
	this.agenda=agenda;
	yield next;
});
app.use(function *(next) {
  switch (this.path) {
  case '/get':
    get.call(this);
    break;
  case '/remove':
    remove.call(this);
    break;
default:yield next;
  }
});
//iojs index

function get() {
  var session = this.session;
  session.count = session.count || 0;
  session.count++;
  this.body = session.count;
}
function remove() {
  this.session = null;
  this.body = 0;
}


app.use(function *(next) {
  if (this.method === 'POST') {
    this.flash = { error: 'This is a flash error message.' };
	console.log('sess dorth in apuse :'+this.session.dorthin);
  } else
  if (this.method === 'GET') {
	  //console.log(this.flash.error);
	  console.log("This path in ap use",this.path);
	  this.flash={woane:this.path};
    //this.body = this.flash.error || 'No flash data.';
  } 
  yield next;
});
app.use(fuckall.middleware());
app.use(secured.middleware());

if(process.env.NODE_ENV === 'test'){
module.exports=app.callback();}
else{

console.log(3000);
app.listen(process.env.PORT || 3000);}
