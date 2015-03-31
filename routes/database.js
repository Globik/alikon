var passport=require('koa-passport');
var Router=require('koa-router');
var bodyParser=require('koa-body');
var wrap=require('co-monk');
// var sendgrid=require('sendgrid')('sendgrid44248@modulus.io','u1vin9v9');

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
var catalog=wrap(db.get('catalog'));
var bloggies=yield catalog.find({});
console.log('bloggies :'+bloggies);
yield this.render('insert2',{user:this.req.user,bloggies:bloggies});
});
//iojs index

fuckall.get('/labo',function *(){
	yield this.render('labo',{user:this.req.user});
});
fuckall.get('/alfa',function *(){
	
 /***
 sendgrid.send({to:'gru5@yandex.ru',
               from:'ag1@yandex.ru',
               subject:'Hello Hujarkus!!!',
               text:'Sending email from heroku, eine Probe,alikon.herokuapp,  by admin Globi. OK?'},
function(err,json){
if(err){return console.log(err);}
console.log(json);});
***/
	yield this.body={str:"get alfa: OK xhr"};});
	
	
	fuckall.get('/beta/:name',function *(name){
		console.log('this.params.name',this.params.name);
		yield this.body={str:this.params.name};
	});

module.exports=fuckall;