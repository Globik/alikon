'use strict';
const valuid=require('uuid-validate');
const passport=require('koa-passport');
const bodyParser=require('koa-body');
const Router=require('koa-router');
//var moment=require('moment');
const cofs=require('co-fs');
const fs=require('fs');
var bitpay=require('bitpay-rest');
var bitauth=require('bitauth');

//var privkey=bitauth.decrypt('',fs.readFileSync('/home/globik/.bitpay/api.key','utf8'));
var privkey=bitauth.decrypt('',process.env.BITPAY_TEST_APIKEY);
console.log('privkey: ',privkey);

const pub=new Router();
//var debug=require('debug');^.+@.+\..+$^.+@.+\..+$
var bpclient=bitpay.createClient(privkey);
bpclient.on('error',err=>console.log(err));

bpclient.on('ready',()=>{console.log('bitpay ready')})
const limit=3;
pub.get('/',function *(){
this.session.dorthin=this.path;
this.body=this.render('haupt_page',{buser:this.req.user});
});

pub.post('/create_invoice',function*(){
var mata=this.request.body;
/*bpclient.as('merchant').post('invoices',mata,(err,invoice)=>{
if(err){console.log('err in bitpay: ', err);}
else{
console.log('invoice data: ', invoice);
}
});
*/
	console.log('mata: ',mata);
	function bitp(d){
	return new Promise((resolve,reject)=>{bpclient.as('merchant').post('invoices',d,(err,invoice)=>err?reject(err):resolve(invoice))
	})
	}
	try{
	var invoice=yield bitp(mata);
		console.log('invoice resultat: ',invoice);
	}catch(e){console.log(e);this.throw(400,e.message);}
	this.body={id:invoice.id};
})

pub.get('/login',function *(){
var m=this.session.messaga;
	this.body=this.render('login',{message:m});
this.session.messaga=null;
});

pub.get('/signup',function *(){
	if(this.req.isAuthenticated()) this.redirect(this.session.dorthin || '/');
var m=this.session.messaga;
	console.log('isRequest is Authenticated?: => ',this.req.isAuthenticated());
	this.body=this.render('signup',{message:'signing up: '+m});
this.session.messaga=null;
});
pub.post('/login', function*(next) {
var ctx = this;yield* passport.authenticate('local',function*(err, user,info) {
	if (err) throw err;
console.log('USER IN POST LOGIN : ', user);
if (!user) {ctx.session.messaga=[info.message];
	ctx.redirect('/login');} else {
		ctx.session.messaga=null;
		yield ctx.login(user);ctx.redirect(ctx.session.dorthin || '/');}}).call(this, next)}
		);

pub.post('/signup', function*(next){
var ctx = this;yield* passport.authenticate('local-signup',function*(err, user,info) {
	//console.log('ERR, USER, INFO: ',err.message,user,info);
	
	if (err) {
		// 23514: new row for relation "busers" violates check constraint "busers_email_check"
		// 23505: email is already in use
		/*if(err.code==23505){ctx.throw(420,"Another user with this email already exists.");}
		else if(err.code==23514){ctx.throw(421,"The email address you entered is not valid. Please try again.");}
		else{ctx.throw(409,err.message);}*/
		ctx.throw(409,err);
	}
if (!user) {ctx.session.messaga=[info.message];
			console.log('USER IN POST SIGN_UP: ', user);
			ctx.body={"message":ctx.session.messaga};
		   } 
	else {yield ctx.login(user);
		  console.log('USER IN POST SIGN_UP ELSE: ', user);
		  ctx.session.messaga=null;
//ctx.redirect(ctx.session.dorthin || '/');
	ctx.body={"message": `You're almost finished.<br><br>
We've sent an account activation email to you at <strong>${ctx.request.body.email}</strong>.
Head over to your inbox and click on the "Activate My Account" button to validate your email address.`, redirect:"/"};	 
		 }}).call(this, next)}
		
		)
//pub.post('/login',passport.authenticate('local',{successRedirect:'/',failureRedirect:'/'}));
pub.get('/logout', function*() {this.logout();this.redirect(this.session.dorthin || '/');});
pub.get('/forgot', function*(){
//if(this.req.isAuthenticated()) this.redirect(this.session.dorthin || '/');
this.body=this.render('forgot',{});	

});
pub.post('/forgot',function*(){
	if(!this.request.body.email) this.throw(400,"Please, provide your email!");
	let db=this.db;
	//fordert LISTEN reset
	//notif-antwort:{email,token,toke_type='reset'}
	try{
var mid=yield db.query(`select request_password_reset('${this.request.body.email}')`);
	}catch(e){
		//console.log('err in post forgot!!!: ',e.message);
			  this.throw(409, e.message);}
this.body={"message": `We have sent a password reset email to your email address: ${this.request.body.email}.<br> Please check your inbox to continue.`};
});

pub.get('/reset/:token',function*(){
if(!valuid(this.params.token)) {
//return; 
	return this.redirect('/error');
}
	//if(this.req.isAuthenticated()) this.redirect(this.session.dorthin || '/');
console.log('this.params.token: ', this.params.token);
let db=this.db;var error=null;
try{
var resu=yield db.query(`select*from tokens where token='${this.params.token}' and created_at > now() - interval '2 days'`);
	}catch(e){this.body={"error":e};error=e;}
if(resu && resu.rows[0]){
this.body=this.render('reset',{"reset-token":this.params.token});
	}else{
		
		this.session.error="Link expired.";
		this.redirect('/error');

	
	}
	});
pub.get('/error', function(){
	this.session.dorthin=this.path;
this.body=this.render('error',{message:this.message, error:this.session.error});
})
// heroku pg:psql --app alikon
pub.post('/reset/:token', function*(token){
	if(!this.request.body.email && !this.request.body.token && !this.request.body.password) this.throw(400,"Please fill in folders");
	let db=this.db;
try{
//select reset_password(email,token,pwd)
yield db.query(`select reset_password('${this.request.body.email}','${this.request.body.token}','${this.request.body.password}')`);
	}catch(e){
		//console.log('ERRRORRR IN RESETING!!!!!!!!!!!!!!!!!!!: ', e.message);
			 this.throw(404, e.message);
			 }
		 console.log('token: ', token);
		 this.body={"message":`Your password has been changed! You may log into your account <a href='/login'>log in</a> 
					or go direct to <a href='/'>home</a>`};
		 });


pub.get('/email_validation/:token',function*(){
	if(!valuid(this.params.token)) {
		return; //this.redirect('/');
	}
	//if(this.req.isAuthenticated()) this.redirect(this.session.dorthin || '/');
	console.log('this.params.token: ', this.params.token);
	let db=this.db;var pmail;var error=null;
	
	try{yield db.query(`select say_yes_email('${this.params.token}')`);}catch(e){
		//console.log('ERROR!!!:', e);
	error=e.message;
	};
	
	this.body=this.render('email_validation',{"message":"<h1>Your email address validated!</h1>", "redirect":"/", error:error});
	
});
/*
======================================================
Social authentication
======================================================
*/
pub.get('/auth/facebook', passport.authenticate('facebook',{scope:['email'],fields:'name,email',returns_scopes:true}));
pub.get('/auth/facebook/callback',passport.authenticate('facebook',{successRedirect:'/',failureRedirect:'/login'}));

pub.get('/auth/vkontakte',    passport.authenticate('vkontakte'));
pub.get('/auth/vkontakte/cb', passport.authenticate('vkontakte', {successRedirect:'/',failureRedirect:'/login'}));

/* ========================
xhr_failed_login
===========================
*/
pub.post('/xhr_failed_login', function*(){
this.body={body:this.request.body};
})
/* 
========
articles 
========
*/
const {get_all_articles, get_all_articles_page, article_slug}=require('./pub/article.js');

pub.get('/articles', pagination, get_all_articles);
pub.param('page', param_page).get('/articles/p/:page', pagination, get_all_articles_page);
pub.get('/articles/:slug', article_slug);

function* param_page(page,next){
if(isNumb(page)==false){this.redirect('/articles')}
else
	if(page==0 || page==1){this.redirect('/articles');}else{yield next;}
}
/* end of articles */

pub.post('/photo_failure',function *(){
console.log("PHOTO FAILURE OCCured");
let {dob, bid}=this, b=this.request.body, docs=dob.collection('posts');
try{let a=yield docs.updateOne({_id:bid(b._id)},{$addToSet:{'meta.fail':b.fail_src}});console.log('a :',a.result);}
catch(e){this.throw(404,`not found ${e}`)}
this.body={info:this.request.body,somels:"OK - accepted!"}
});
pub.post('/module_cache',function *(){this.body={body:this.request.body};});
pub.get('/labs',function *(){this.body='str';});
	
function readStr(n){
return new Promise((res,rej)=>{
let resu=[];let resul='';
n.on('data',dat=>{console.log('data :',dat);resu.push(dat);resul+=dat;})
.once('end',()=>{console.log('end of f');res(resu)}).once('error',err=>{rej(err)});
})
}
function readStr2(n){return new Promise((res,rej)=>{
	let resu=[];
	n.on('readable',()=>{
	var buf;while((buf=n.read()) !==null) resu.push(buf);
		}).once('end',()=>{res(resu)}).once('error',err=>{rej(err)})
	})
}

module.exports=pub;

function *pagination(next){
this.locals={};
var qu=parseInt(this.params.page) || 1;
var page=qu;
var num=page*limit;
var w=5,ab=[],deg=2;var map=new Map();

let db=this.db;
try{var total_articles=yield db.query('select from articles');
}catch(e){console.log(e);return next(e);}
var total_pages=Math.ceil(Number(total_articles.rowCount)/limit);
for(var i=1;i<=total_pages;i++){ab.push(i);}
ab.forEach(y=>{
if(total_pages >=15){
if(y<=w){map.set(y,ab.slice(0,w));}
if(y>w && y <(total_pages-w)){map.set(y,ab.slice((y-1)-deg,y+deg));;}
if(y>=total_pages-w){map.set(y,ab.slice(total_pages-w,total_pages));}
}else{
map.set(y,ab.slice(0,total_pages))
}
});
this.locals.total_articles=total_articles.rowCount;
this.locals.total_pages=total_pages;
this.locals.page=page;
this.locals.rang_page=map;
if(num<total_articles) {this.locals.next=true;}
if(num>limit) {this.locals.prev=true;}
yield next;
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
function isNumb(str){var numstr=/^\d+$/;return numstr.test(str);}