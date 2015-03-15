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
//var mongodb=require('mongodb');
//var mongo=mongodb.MongoClient;

//var parse=require('co-body');
//var bodyParser=require('koa-bodyparser');
var bodyParser=require('koa-body');
var session=require('koa-generic-session');
var MongoStore=require('koa-generic-session-mongo');

var passport=require('koa-passport');
var fuckall=require('./routes/database');
var configDB=require('./config/database.js');

var monk=require('monk');
var wrap=require('co-monk');
  var db=monk(configDB.url,{w:1});
  //var db=monk(configDB.localurl);
 //var db=monk(process.env.MONGOHQ_URL,{w:1});
 //var db=monk("mongodb://alik:123456@dogen.mongohq.com:10004/alikon-fantastic-database");

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
//var mess=wrap(db.get('sessions'));

require('./config/passport')(passport);
/***
passport.serializeUser(function(user, done) {
  done(null, user._id);});
//iojs index
passport.deserializeUser(function(_id, done) {
busers.findById(_id,function(err,user){
if(err){return done(err);}
done(null,user);
});
});

var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
function(username, password, done) {
process.nextTick(function () {
busers.findOne({'username':username}, function(err, user) {
if (err) { return done(err); }
if (!user) { 
return done(null, false, { message: 'Unknown user ' + username }); }
if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
return done(null,user);
});});}));
***/

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
 var fucksession=this.session;
//fucksession.fucker="admin"
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
	//this.session.dorthin=null;
	//this.flash={otkuda:this.path};
  } else
  if (this.method === 'GET') {
	  //console.log(this.flash.error);
	  //this.flash={otkuda:this.path};
	 // console.log("this.flash.otkuda: "+this.flash.otkuda);
	  //this.session.dorthin=null;
	  //this.flash={}
	  //this.locals="Notice";
	  //yield next;
	  console.log("This path in ap use",this.path);
	  this.flash={woane:this.path};
    //this.body = this.flash.error || 'No flash data.';
  } 
  yield next;
});

//iojs index
/***
//iojs index
var dbl = {
  tobi: {id:1, name: 'tobi', species: ['ferret','kino'] },
  loki: {id:2, name: 'loki', species: ['internet','theater'] },
  jane: {id:3, name: 'jane', species: ['sport','lesen'] }
};
var users=[{name:'Dead Horse'},{name:'Jack'},{name:'Tom'}];

var pets = {
  list: function *(){
//var names = Object.keys(db);
  var dbs=dbl;
    yield this.render('show',{pets:dbs,users:users});
  },

  show: function *(name){
    var pet = dbl[name];
    if (!pet) return this.error('cannot find that pet', 404);
    yield this.render('sh',{pets:"1"});
  }
};
***/
//iojs index
var forall=new Router();
/***
forall.post('/gamma',bodyParser({multipart:true,formidable:{}}),
function *(next){
	
console.log('this.request.body.fields: ',this.request.body.fields);
this.body=JSON.stringify(this.request.body,null,2);
this.body={"OK":"2222 formidable"}
yield next;}
);
***/
//var forall=new Router();

forall.post('/login',
  passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/'
  }));


forall.get('/logout', function*(next) {

  this.logout();
  this.redirect('/');
});

/***
forall.get('/show/:name',getUser);

function *getUser(name){
var user=dbl[name];

 if(!user) this.throw(404,'invalid user name');
console.log(user);
yield this.render('showName',{user:user.name});
};

forall.get('/show',pets.list);
***/

// iojs index

forall.get('/', function *(){
	
var admin=wrap(db.get('users'));
try{
var res=yield admin.findOne({username:"Bob"});

//var res=yield db.findOne({username:"Bob"});
console.log('db :'+res.username);}catch(er){console.log("error in username :"+er);}
var body=this.req.user;
//this.flash={woane:this.path};
this.session.dorthin=this.path;
//message: req.session.messages
console.log('this.session in content: '+this.session.messages);
console.log("flash error in content: "+this.flash.berror);
yield this.render('content',{user:body,message:this.flash.berror});});




/***
forall.post('/custom', function*(next) {
var ctx = this;
yield* passport.authenticate('local', function*(err, user,info) {
if (err) throw err;
//console.log('err',err);//null or type
if (user === false) {
	//console.log('user'+user);this is user object from db
	//this.session.messages =  [info.message];
	ctx.flash={berror: info.message};
	//console.log('session: '+ctx.session);
	
	ctx.session.messages=[info.message];
	//console.log('session.messages: '+ctx.session.messages);
	//console.log('info :'+info+':++ '+[info.message]);
 ctx.status = 401;
 ctx.body = { success: false,info:[info.message] }
 ctx.redirect('/');

    } 
else {
  yield ctx.login(user); console.log('user',user);
  
  console.log('Where are you from :'+ctx.session.dorthin);
  
  console.log("You are from the this.flash.woane direction in custom :"+ctx.flash.woane);
  ctx.redirect(ctx.session.dorthin || '/app');
  
  //ctx.body = { success: true }
    }
  }).call(this, next)
});
***/
forall.post('/custom2', function*(next) {
var ctx = this;
yield* passport.authenticate('local',function*(err, user,info) {
if (err) throw err;
//console.log('err',err);//null or type
if (user === false) {
	//console.log('user'+user);this is user object from db
	//this.session.messages =  [info.message];
	//ctx.flash={berror: info.message};
	//console.log('session: '+ctx.session);
	
	//ctx.session.messages=[info.message];
	//console.log('session.messages: '+ctx.session.messages);
	//console.log('info :'+info+':++ '+[info.message]);
 ctx.status =401;
 ctx.body = { success: false,info:[info.message] }
 //ctx.status=401;
 //ctx.redirect(null);

    } 
else {
  yield ctx.login(user); 
  //console.log('user',user);
  //iojs index
  console.log('Where are you from :'+ctx.session.dorthin);
  console.log("You are from the this.flash.woane direction in custom :"+ctx.flash.woane);
  ctx.body={success:true,redirect:ctx.session.dorthin || '/app'};
  //ctx.redirect(ctx.session.dorthin || '/app');
  
  //ctx.body = { success: true }
    }
  }).call(this, next)
});

// iojs index
/***
forall.get('/alfa',function *(){
	var result=this.req.mata;
 console.log('result:'+result);
	yield this.body={str:"OK xhr"};});
	***/
	/***
	forall.get('/beta/:name',function *(name){
		console.log('this.params.name',this.params.name);
		console.log('this..req.body',this.req.body);
		yield this.body={str:this.params.name};
	})
***/
app.use(forall.middleware());
app.use(fuckall.middleware());
var secured=new Router();


secured.get('/app',authed,function *(){
var body= this.req.user.username;
console.log('this.req.user.username in app: '+body);
yield this.render('app',{user:this.req.user});});
app.use(secured.middleware());
function *authed(next){
if(this.req.isAuthenticated()){
 
yield next;}
else{ this.redirect('/');}}


if(process.env.NODE_ENV === 'test'){
module.exports=app.callback();}
else{

console.log(3000);
app.listen(process.env.PORT || 3000);}
