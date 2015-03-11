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
var passport=require('koa-passport');

var monk=require('monk');
var wrap=require('co-monk');
  //var db=monk("mongodb://localhost:27017/todo");
 var db=monk(process.env.MONGOHQ_URL,{w:1});

var tasks=wrap(db.get('tasks'));
var busers = db.get('users');

busers.findOne({username:"Bob"}).on('success',function(doc){
console.log('Document',doc);
console.log(doc.username);
//_id: 54c7815186d37cb8a2f49639
console.log('busers:'+busers);});


var us=wrap(db.get('users'));

passport.serializeUser(function(user, done) {
  done(null, user._id);});

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


var app=koa();



var locals={
version:'0.0.1',
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
app.use(session());
app.keys=['your-session-secret'];
//app.use(bodyParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(Router(app));
app.use(bodyParser());
app.use(flash());
app.use(function *(next) {
  if (this.method === 'POST') {
    this.flash = { error: 'This is a flash error message.' };
  } else if (this.method === 'GET') {
	  console.log(this.flash.error);
    this.body = this.flash.error || 'No flash data.';
  } yield next;
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
forall.post('/gamma',bodyParser({multipart:true,formidable:{}}),
function *(next){
	
console.log('this.request.body.fields: ',this.request.body.fields);
this.body=JSON.stringify(this.request.body,null,2);
this.body={"OK":"2222"}
yield next;}
);

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
// logger
// iojs index
forall.get('/', function *(){
var users=[{name:'Dead Horse'},{name:'Jack'},{name:'Tom'}];
/***
var tslist=yield tasks.find({});
console.log(tslist);
***/
var body=this.req.user;

if(body !=undefined){
 body= this.req.user;
console.log('this.req.user: '+body);
console.log('this.req.error'+this.flash.error);
console.log("this.flash " +this.flash.message);
}
//message: req.session.messages
console.log('this.session in content: '+this.session.messages);
console.log("flash error in content: "+this.flash.berror);
yield this.render('content',{user:body,/*message:this.session.messages*/message:this.flash.berror});});

forall.get('/insert2',function *(){
yield this.render('insert2',{user:this.req.user});
});

forall.post('/custom', function*(next) {
var ctx = this;
yield* passport.authenticate('local', function*(err, user,info) {
if (err) throw err;console.log('err',err);
if (user === false) {
	console.log('user'+user);
	//this.session.messages =  [info.message];
	ctx.flash={berror: info.message};
	console.log('session: '+ctx.session);
	ctx.session.messages=[info.message];
	console.log('session.messages: '+ctx.session.messages);
	console.log('info :'+info+':++ '+[info.message]);
 ctx.status = 401;
 ctx.body = { success: false,info:[info.message] }
//ctx.redirect('/');
//yield ctx.render('content',{messages:"2"});
    } 
else {
  yield ctx.login(user); console.log('user',user);
  ctx.redirect('/app');
  //ctx.body = { success: true }
    }
  }).call(this, next)
});
// iojs index
forall.get('/alfa',function *(){
	var result=this.req.mata;
 console.log('result:'+result);
	yield this.body={str:"OK xhr"};});
	
	forall.get('/beta/:name',function *(name){
		console.log('this.params.name',this.params.name);
		console.log('this..req.body',this.req.body);
		yield this.body={str:this.params.name};
	})

app.use(forall.middleware());

var secured=new Router();


secured.get('/app',authed,function *(){
var body= this.req.user.username;
console.log('this.req.user.username in app: '+body);
yield this.render('app',{user:this.req.user});});
app.use(secured.middleware());
function *authed(next){
if(this.req.isAuthenticated()){yield next;}
else{ this.redirect('/');}}

if(process.env.NODE_ENV === 'test'){
module.exports=app.callback();}
else{

console.log(3000);
app.listen(process.env.PORT || 3000);}