'use strict';
var koa=require('koa');
var render=require('koa-ejs');
var path=require('path');
var wait=require('co-wait');
var logger=require('koa-logger');
var serve=require('koa-static');
//var route=require('koa-route');
var Router=require('koa-router');
var flash=require('koa-flash');

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
  var db=monk(configDB.url,{w:1});
  //var db=module.exports=monk(configDB.localurl);
 //var db=monk(process.env.MONGOHQ_URL,{w:1});
 

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



var locals={
version:'0.0.1',
message:'message must be',
now:function(){
return new Date();},
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
app.use(serve(__dirname+'/public'));
app.use(logger());
app.keys=['fg'];
 //app.use(session({store:new MongoStore({db:"todo"})}));
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
