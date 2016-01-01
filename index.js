'use strict';
//var crypto=require('crypto');
const koa=require('koa');
const render=require('./libs/render.js');
const path=require('path');
var wait=require('co-wait');
var logger=require('koa-logger');
var serve=require('koa-static');
//var route=require('koa-route');
//var Router=require('koa-router');
var flash=require('koa-flash');
var koaws=require('koa-ws');
var moment=require('moment');
//var parse=require('co-body');
//var bodyParser=require('koa-bodyparser');
var bodyParser=require('koa-body');
var session=require('koa-generic-session');
var MongoStore=require('koa-generic-session-mongo');

var passport=require('koa-passport');
var fs=require('co-fs');
//var fuckall=require('./routes/database');
var pubrouter=require('./routes/pubrouter.js');
var adminrouter=require('./routes/admin.js');
//var secured=require('./routes/secured');

var configDB=require('./config/database.js');
var {MongoClient,ObjectID}=require('mongodb');
//db.posts.update({$set:{urlformat:new Date().getTime().toString().slice(0,8),{multi:true}})
//var MongoClient=require('mongodb').MongoClient;var ObjectId=require('mongodb').ObjectID;
/*
db.posts.findOne({postname:"pidara2",urlf:"14507100"})
var mod=wrap('fuckers');
//14507100
//var db=wrap.db;
mod.find().then(function(d){console.log('data :',d)},function(e){console.log('er :',e)})*/
//var fid=module.exports=hex=>mongojs.ObjectId(hex);
var dob;
MongoClient.connect((configDB.url || configDB.localurl),function(e,db){
if(e){console.log(e)}else{ 
console.log('est kontakt');
dob=db;
require('./config/passport')(db,passport);
}});
 
/*var va=new Date('2015-07-11');
var fa=Math.floor(va/1000).toString(16)+'';
console.log('va :',va);
console.log('fa :',fa);*/
  
  //var db=module.exports=monk(configDB.url || configDB.localurl);//prod
  //var db=module.exports=monk(process.env.MONGOHQ_URL_TEST); //remote test
  //var Agenda=require('agenda');
  
  //var agenda=new Agenda({db:{address:configDB.url || configDB.localurl}});//prod
  //var agenda=new Agenda({db:{address:process.env.MONGOHQ_URL_TEST}});//remote test

//node --harmony --harmony_destructuring --harmony_rest_parameters --harmony_default_parameters index
//--harmony_proxies index
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
//npm start
var low = require('lowdb')
var lowdb = low('db.json')
//lowdb('posts').push({ title: 'home',href:'/'});
//var qu=lowdb('posts').find({title:'lowdb is awesome'});
//console.log('LOWDB :',qu);

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
ldb:function *(){try{var s=yield fs.readFile('db.json','utf-8');return JSON.parse(s);}
catch(err){console.log('LOWDB API err :',err);}},
path:function (){var b;if(this.method === 'GET'){b=this.path} return b;},
signup:function *(){try{
	var mdsignup=yield db.collection('modules').findOne({modulname:"signup"});
return mdsignup.status} catch(err){
	//console.log(err);
}
},
module:function *(){try{
		var mdl=yield mod.findOne({modulname:"aside"});
//console.log('mdl.status :'+ mdl.status);
return mdl.status}catch(err){
	//console.log('err :'+err);
	}} ,
ip: function *(){
yield wait(100);
return this.ip;},
menu:[{name:"home",href:'/'},{name:"articles",href:"/articles"},{name:"labs",href:"/labo"}]
};
const filts=require('./libs/filters.js');
var esc2_html = filts.esc2_html,html_pretty=filts.html_pretty,
esc_html=filts.esc_html,js_pretty=filts.js_pretty,css_pretty=filts.css_pretty,advec=filts.advec;

const filters={
    format: time => time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate(),
	subtime:date =>{var mate=moment(date);return mate.format('MMM D, YYYY');},
	js_pretty,
    esc_html,
	esc2_html,
    css_pretty,
	html_pretty,
    aprecoded: advec
 };
 
 //node --harmony index
 /*
render(app,{
root:path.join(__dirname,'view'),
layout:'template',
viewExt:'html',
cache:false,
debug:true,
filters:filters});
*/
/*
render(app,{root:path.join(__dirname,'view'),layout:'template',viewExt:'html',cache:false,
debug:true,_with:true,rmWhitespace:true});*/

render(app,{})
app.use(serve(__dirname+'/public'));

app.use(function *(next){
  const start = new Date;
  yield next;
  const ms = new Date - start;
  console.log(`${this.method} ${this.url} - ${ms}ms`);
});

//app.use(logger());
app.keys=['fg'];

 //remote db test:
 //app.use(session({store:new MongoStore({url:process.env.MONGOHQ_URL_TEST+"/alikon-fantastic-database"})}));
 app.use(session({store:new MongoStore({url:configDB.url || configDB.localurl})}));
 //app.use(session({store:new MongoStore({url:configDB.newUrl})}))
 
app.use(passport.initialize());
app.use(passport.session());
//app.use(Router(app));
//app.use(bodyParser());

//app.use(flash());
 //node index
 //app.use(function *(next){this.state=locals;yield next;})
 app.use(function *(next){
	 this.state.subadmin="Hallo Subadmin!";
 yield next;})
 app.use(function *(next){this.lowdb=lowdb;yield next;});
 /*app.use(function *(){
	 var sz=this.page;
	 console.log(this);
	 console.log('SZ :',sz({user:"us",fi:"fi",good:"good"}));
 })
 */
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
  } else
  if (this.method === 'GET') {
	  //console.log(this.flash.error); 
	  console.log("This path in ap use",this.path);
	  //console.log('this.session.err :',this.message);
	  //console.log("THIS FLASH FUCKER : ",this.flash.fucker);
	  this.flash={woane:this.path};
  } 
  yield next;
});
//node index
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

//node index
app.on('error',function(err,ctx){
	console.log('some err in app on error :', err.message);
	console.log('in ctx :',ctx.request.url);
})
if(process.env.NODE_ENV === 'test'){
module.exports=app.callback();}
else{

console.log(3000);
app.listen(process.env.PORT || 3000);}
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
//undone
***/
