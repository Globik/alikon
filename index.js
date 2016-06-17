'use strict';
const koa=require('koa');
const render=require('./libs/render.js');
const path=require('path');
var wait=require('co-wait');
var serve=require('koa-static');
var flash=require('koa-flash');
var koaws=require('koa-ws');
var moment=require('moment');
var bodyParser=require('koa-body');
var session=require('koa-generic-session');
var MongoStore=require('koa-generic-session-mongo');
var passport=require('koa-passport');
var fs=require('co-fs');
var pubrouter=require('./routes/pubrouter.js');
var adminrouter=require('./routes/admin.js');
var configDB=require('./config/database.js');
var {MongoClient,ObjectID}=require('mongodb');
var dob;
//console.log(process.env.MONGOHQ_URL_TEST);
var burl=configDB.url || configDB.localurl;
MongoClient.connect(burl,function(e,db){
if(e){ throw(e);}else{ 
console.log('est kontakt');
dob=db;
require('./config/passport')(db,passport);
}});
  //var Agenda=require('agenda');
  //var agenda=new Agenda({db:{address:configDB.url || configDB.localurl}});//prod
  //var agenda=new Agenda({db:{address:process.env.MONGOHQ_URL_TEST}});//remote test
/*
node --harmony --harmony_destructuring --harmony_rest_parameters --harmony_default_parameters --harmony_proxies index
*/
var app=koa();
/***app.use(function *(next){var mdl=yield mods.findOne({modulname:"aside"});console.log('mdl.status :',mdl.status);yield next;});***/
/*var options={
serveClientFile:true,
clientFilePath:'/koaws.js',
heartbeat:true,
heartbeatInterval:5000};
app.use(koaws(app,options));
app.ws.register('hello',function *(){this.result('world!');});
*/
var low = require('lowdb')
var lowdb = low('db.json')
//lowdb('posts').push({ title: 'home',href:'/'});
//var qu=lowdb('posts').find({title:'lowdb is awesome'});
var locals={
version:'0.0.1',
site_name:"Atariku",
site_creator:"Globik",
site_url:"http://alikon.herokuapp.com",
main_site_description:"Attariku blog codelab",
fb_app_id:"833998660009097",
fb_admins:"100002318783216",
og_plugin:true,
schema_plugin:true,
shema_canonical_href:"http://alikon.herokuapp.com/",
message:'message must be',
somefunc:"alert('some Func')",
getgi(){return 1;},
* showmodule(){try{var mn=yield fs.readFile('app.json','utf-8');

return mn;}catch(e){console.log(e);}},
path:function (){var b;if(this.method === 'GET'){b=this.path} return b;},
signup:function *(){try{
var mdsignup=yield db.collection('modules').findOne({modulname:"signup"});
return mdsignup.status} catch(err){}},
module:function *(){try{
var mdl=yield mod.findOne({modulname:"aside"});return mdl.status}catch(err){}} ,
ip: function *(){yield wait(100);return this.ip;},
menu:[{name:"home",href:'/'},{name:"articles",href:"/articles"},{name:"labs",href:"/labo"}]
};
const {esc_html,esc2_html,html_pretty,js_pretty,css_pretty,advec}=require('./libs/filters.js');
var {script}=require('./libs/filter_script.js');
const filters={
    format: time => time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate(),
	subtime:date =>{var mate=moment(date);return mate.format('MMM D, YYYY');},
	js_pretty,esc_html,esc2_html,css_pretty,html_pretty,aprecoded: advec};
 render(app,{})
app.use(serve(__dirname+'/public'));
/*app.use(function *(next){
  const start = new Date;
  yield next;
  const ms = new Date - start;
  console.log(`${this.method} ${this.url} - ${ms}ms`);
});*/
var lasha=true;
app.keys=['fg'];
app.use(session({store:new MongoStore({url:burl})}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser());
var mobject={};
//app.use(flash());
 //app.use(function *(next){this.state=locals;yield next;})
 app.use(function *(next){this.state.subadmin="Hallo Subadmin!";
 this.state.filter_script=script;
 
 var sa;
if(lasha) {sa=yield locals.showmodule();
sa=JSON.parse(sa);
mobject.showmodule=sa;
lasha=false;}
 this.state.showmodule=mobject.showmodule;
 this.state.showmodulecache=lasha;
 if(this.path=='/module_cache'){
	 //console.log('ReqBody: ',this.request.body);
 lasha=true;}
 yield next;})
 app.use(function *(next){this.lowdb=lowdb;yield next;});
 
app.use(function *(next){
this.dob=dob;
this.bid=ObjectID;
this.agenda="agenda";
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
//node index

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
  } else if (this.method === 'GET') {
	  console.log("This path in ap use",this.path);
	  this.flash={woane:this.path};
  } yield next;});

app.use(pubrouter.routes());
app.use(adminrouter.routes());
app.use(function *(){
	this.message=this.session.err;
	this.status=302;
	this.redirect('/');
})
/*app.use(function *(next){
if(404 !=this.status) return;
	this.status=404;
	//console.log('NOW status :',this.status+':'+this.flash.fucker)
	yield this.render('/error-view',{err:this.message,fly:this.flash.fucker,status:this.status,user:this.req.user});
})*/
app.on('error',function(err,ctx){
	console.log('some err in app on error :', err.message);
	console.log('in ctx :',ctx.request.url);
})
if(process.env.NODE_ENV === 'test'){module.exports=app.callback();}
else{console.log(3000);app.listen(process.env.PORT || 3000);}
/***
3. mongod --dbpath ../data/db --auth
4. mongo --port 27017 -u manager -p admin --autheticationDatabase admin?
use admin
//1. create a system user administrator
db.createUser({
	user:"admin",//siteUserAdmin
	pwd:"admin",
	roles:[{role:'userAdminAnyDatabase',
	db:'admin'}]
})
//done
//check: db.getUser("admin")
//2. create an user administrator for a single database
use todo
db.createUser({
	user:'todouseradmin',
	pwd:'admin',
	roles:[{role:'userAdmin',db:'todo'}]
})
//undone***/
/*
cd mon3/bin
mongod -dbpath ../data/db

*/