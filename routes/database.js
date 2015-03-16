var passport=require('koa-passport');
var Router=require('koa-router');
var bodyParser=require('koa-body');
var wrap=require('co-monk');

var fuckall=new Router();

fuckall.post('/custom2', function*(next) {
var ctx = this;
yield* passport.authenticate('local',function*(err, user,info) {
if (err) throw err;
if (user === false) {
 ctx.status =401;
 ctx.body = { success: false,info:[info.message] }
 } 
else {
  yield ctx.login(user); 
  //iojs index
  console.log('Where are you from :'+ctx.session.dorthin);
  console.log("You are from the this.flash.woane direction in custom :"+ctx.flash.woane);
  ctx.body={success:true,redirect:ctx.session.dorthin || '/app'};
  //ctx.redirect(ctx.session.dorthin || '/app');
    }
  }).call(this, next)
});

fuckall.post('/login',
  passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/'
  }));
fuckall.get('/logout', function*(next) {
this.logout();
  this.redirect('/');
});

fuckall.get('/', function *(){
var db=this.fuck;	
var admin=wrap(db.get('users'));
try{
var res=yield admin.findOne({username:"Bob"});
console.log('db :'+res.username);}catch(er){console.log("error in username :"+er);}
var body=this.req.user;
this.session.dorthin=this.path;
yield this.render('content',{user:body,message:this.flash.berror});});

fuckall.get('/insert2',function *(){
var db=this.fuck;
var admin=wrap(db.get('users'));
try{
var res=yield admin.findOne({username:"Bob"});
console.log('db :'+res.username);}catch(er){console.log("error in username :"+er);}
this.session.dorthin=this.path;
yield this.render('insert2',{user:this.req.user});
});
//iojs index
fuckall.get('/alfa',function *(){
	yield this.body={str:"get alfa: OK xhr"};});
	
	fuckall.get('/beta/:name',function *(name){
		console.log('this.params.name',this.params.name);
		yield this.body={str:this.params.name};
	});

module.exports=fuckall;