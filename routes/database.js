var passport=require('koa-passport');
var Router=require('koa-router');
var bodyParser=require('koa-body');
var wrap=require('co-monk');
var moment=require('moment');//2.10.0
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

fuckall.post('/signup',
passport.authenticate('local-signup',
{successRedirect:'/',
 failureRedirect:'/',
failureFlash:true}));

fuckall.get('/logout', function*(next) {
this.logout();
  this.redirect('/');
});

fuckall.post('/addingfuckinguser2',bodyParser({multipart:true,formidable:{}}),
function *(next){
	var db=this.fuck;
	var username=this.request.body.fields.username;
	var email=this.request.body.fields.email;
	var password=this.request.body.fields.password;
	this.body=JSON.stringify(this.request.body,null,2);
	var dbus=wrap(db.get('users'));
	try{
	var users=yield dbus.findOne({email:email});
	console.log(users.email);
	this.status=401;
	this.body={success:false,info:"user exists"}
	}catch(err){
		//this.login('user')
 this.body = { success: true,info:'success!!!!' }
		console.log(err);
	
	//node index
	/***
	yield users.insert({username:username,
	                    email:email,
						password:password,
						role: "simple"});
	//console.log('in :'+this.request.body.fields.username);
	***/
	}
yield next;});
//node index

fuckall.post('/addingfuckinguser', function*(next) {
var ctx = this;
yield* passport.authenticate('local-signup',function*(err, user,info) {
if (err) throw err;

if (user == false) {
	//if(info.message == false){
 ctx.status =401;
 console.log('un user',user);
 ctx.body = { success: true,info:[info.message], infod:"Es gibt schon einer"}
 } 
 else{
//if(info.message == true){
	console.log('user in database',user)
	//ctx.status=401;
  yield ctx.login(user);
//here is false  
  //iojs index
  //console.log('Where are you from :'+ctx.session.dorthin);
  //console.log("You are from the this.flash.woane direction in custom :"+ctx.flash.woane);
  ctx.body={success:"ok",info:[info.message],infod:'Noch nicht gibt es. OK.',redirect:'/insert2',user:user};
  //ctx.redirect(ctx.session.dorthin || '/app');
   }
  }).call(this, next)
});

fuckall.get('/', function *(){
	/***
var db=this.fuck;	
var admin=wrap(db.get('users'));
try{
var res=yield admin.findOne({username:"Bob"});
console.log('db :'+res.username);}catch(er){console.log("error in username :"+er);}
***/
var body=this.req.user;
this.session.dorthin=this.path;
yield this.render('content',{user:body,message:this.flash.berror});});

fuckall.get('/articles',function *(){
var db=this.fuck;
/***
var admin=wrap(db.get('users'));
try{
var res=yield admin.findOne({username:"Bob"});
console.log('db :'+res.username);}catch(er){console.log("error in username :"+er);}
***/
this.session.dorthin=this.path;
var doc=wrap(db.get('posts'));
var posts=yield doc.find({});
var date=moment(posts[0].created);
//console.log('date posts created :',date);
console.log('posts.created :',posts[0].created);
var formated=date.format('YYYY[/]MM[/]DD[/]');
var datefake=date.format('MMM D');
yield this.render('insert2',{user:this.req.user,posts:posts,formated:formated,datefake:datefake});
});

//iojs index

fuckall.get('/articles/:year/:month/:day/:title',function *(){
	var db=this.fuck;
 var doc=wrap(db.get('posts'));
 try{
 var post= yield doc.findOne({'title':this.params.title});
 console.log('post :',post.postname);
var date=moment(post.created);
var formated=date.format('YYYY[/]MM[/]DD[/]');
var datedurak=date.format('MM DD');
var datefake=date.format('MMM D');
console.log('formated :',formated);

yield this.render('formated-article-view',{user:this.req.user,
	parametr:this.params.year+this.params.month+this.params.title,post:post,formated:formated,datedurak:datedurak,datefake:datefake});
 }catch(err){
	 yield this.render('error-view',{user:this.req.user,err:err});
 }
});

fuckall.get('/labo',function *(){
	yield this.render('labo',{user:this.req.user});
});




fuckall.get('/alfa',function *(){
	
 /***
 sendgrid.send({to:'gr@yandex.ru',
               from:'a@yandex.ru',
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
/***
fuckall.get('/takePost/:dataid',function *(dataid){
//console.log('this.params.dataid',this.params.dataid);
var db=this.fuck;
var doc=wrap(db.get('posts'));
try{
 var post= yield doc.findById(this.params.dataid);
//console.log('post.maincontent',post.maincontent);
yield this.body={data:post.maincontent};}
catch(err){
//console.log('err',err);
yield this.body={data:err};}
});
***/

module.exports=fuckall;