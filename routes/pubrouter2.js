'use strict';
const valuid=require('uuid-validate');
const passport=require('koa-passport');
const bodyParser=require('koa-body');
const Router=require('koa-router');
//var moment=require('moment');
const cofs=require('co-fs');
const pub=new Router();
//var debug=require('debug');^.+@.+\..+$^.+@.+\..+$

const limit=3;
pub.get('/',function *(){
this.session.dorthin=this.path;
	console.log('THIS>REQ: ', this.response);
this.body=this.render('haupt_page',{buser:this.req.user});
});

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

pub.get('/fucker',function*(){
let db=this.db;var error=null; var email="drug@yandex";
	try{var bu=yield db.query(`insert into lab(email) values('${email}')`);
	   }catch(er){console.log(er);error=er;}
	this.body={"error":error,"result":bu}
});

/* ========================
xhr_failed_login
===========================
*/
pub.post('/xhr_failed_login', function*(){
this.body={body:this.request.body};
})

pub.get('/articles', pagination, function *(){
	this.session.dorthin=this.path;
let db=this.db; var posts;
	var locals=this.locals;
	var mamba="where status='active'";
	if(this.req.isAuthenticated()){
	console.log('THIS.REQ.USER.ROLE: ', this.req.user.role);
		if(this.req.user.role==='superadmin'){mamba='';}
	}
try{
//var posts=yield docs.find().limit(limit).skip(0).sort({_id:-1}).toArray();
posts=yield db.query(`select*from articles ${mamba} order by id desc offset 0 limit ${limit}`);
}
catch(e){console.log('e :',e);}
	console.log('POSTS ARTICLES: ', posts.rows);
this.body=this.render('articles_page',{buser:this.req.user, posts:posts.rows, locals:locals});});

pub.param('page',function *(page,next){
	console.log('page :',page);
	console.log('isNumb :',isNumb(page))
if(isNumb(page)==false){this.status=404;this.redirect('/articles')}
else if(page==0 || page==1){this.status=404;this.redirect('/articles');}else{yield next;}
}).get('/articles/:page', pagination, function *(page){
	this.session.dorthin=this.path;
	var locals=this.locals;var err;
	//let {dob,locals}=this, docs=dob.collection('posts');var err=null;
	let db=this.db;
	var mamba="where status='active'";
	if(this.req.isAuthenticated()){
	console.log('THIS.REQ.USER.ROLE: ', this.req.user.role);
		if(this.req.user.role==='superadmin'){mamba='';}
	}
	if(locals.page <= locals.total_pages){
		try{
			console.log('LOCALS.PAGE: ',locals.page);
			console.log('locals.total_pages: ',locals.total_pages);
		//var posts=yield docs.find().limit(limit).skip(limit*(locals.page-1)).sort({_id:-1}).toArray();
var posts=yield db.query(`select*from articles ${mamba} order by id desc offset ${(locals.page - 1) * limit } limit ${limit}`);
		}catch(e){console.log('err in db:',e);err=e;}
	this.body=this.render('articles_page',{locals:locals,buser:this.req.user,posts:posts.rows});
	}
	else{this.status=404;this.redirect('/articles');}
});

//var article_view=rel('../views/article_view.js');
pub.get('/articles/:date_url/:slug',function *(){
	//let {dob,bid}=this, docs=dob.collection('posts'); 
	this.session.dorthin=this.path;
	let db=this.db;
	var vpost;
	console.log('Slug and date_url: ', this.params.slug, this.params.date_url)
	/*
try{
post=yield docs.findAndModify({slug:this.params.slug,date_url:this.params.date_url},[],{$inc:{gesamt_seen:1}},{new:true});
if(post.value !==null){post=post.value;}else{console.log("Found Null Matches");this.redirect('/articles')}
}catch(e){console.log('MMMMMmodify error :',e);this.redirect('/articles');}
*/
	try{
	var post=yield db.query(`select*from articles where slug='${this.params.slug}' and date_url='${this.params.date_url}'`);
		if(post.rows.length){
		console.log('HERE IS POST: ', post.rows[0]);
			vpost=post.rows[0];
			this.body=this.render('article_view',{buser:this.req.user,post: vpost});
		}else{
			//this.status(404);
			this.session.dorthin=null;
			this.session.error="Yopt - not found, guy";
			  this.redirect('/error');}
	}catch(e){console.log(e);}
	//this.body=this.render('article_view',{buser:this.req.user,post: vpost});
	});
pub.post('/photo_failure',function *(){
	console.log("PHOTO FAILURE OCCured");
	let {dob, bid}=this, b=this.request.body, docs=dob.collection('posts');
	try{let a=yield docs.updateOne({_id:bid(b._id)},{$addToSet:{'meta.fail':b.fail_src}});console.log('a :',a.result);}
	catch(e){this.throw(404,`not found ${e}`)}
	this.body={info:this.request.body,somels:"OK - accepted!"}
});
pub.post('/module_cache',function *(){
	this.body={body:this.request.body};
});
pub.get('/get_an_article/:dataid',function *(){
//let db=this.dob,bid=this.bid,docs=db.collection('posts');
let {dob,bid}=this,docs=dob.collection('posts');
var post;
try{
 post= yield docs.findOne({_id:bid(this.params.dataid)});
 //console.log('Post: ',post);
//{_id,title,slogan,sub_title,author,leader,body,tags,category,rubrik,part,description,type,status,slug,
//created_on,last_modified,date_url}; todo{checked{by,when},pic}
	}catch(e){ console.error('error find article: ',e);this.throw(404,e);}
	this.body={post};});
	
pub.get('/labs',function *(){
	this.body='str';
	});
	
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
//npm start
//var mob={foo:"bar",["prop"+foo()]:42};
//console.log('mob :',mob);
console.log('TOTALS: ',Math.ceil(12/3));
module.exports=pub;

function *pagination(next){
this.locals={};
var qu=parseInt(this.params.page) || 1;
	var page=qu;
	var num=page*limit;
var w=5,ab=[],deg=2;var map=new Map();

let db=this.db;
//var docs=db.collection('posts');
try{var total_articles=yield db.query('select from articles');
   console.log('TOTAL_ARTICLES: ',total_articles.rowCount);
   }catch(e){console.log(e);return next(e);}
var total_pages=Math.ceil(Number(total_articles.rowCount)/limit);
	console.log('TOTAL_PAGES: ',total_pages);
//var pid_tot=Math.trunc(total_articles/limit);
//console.log(total_pages,pid_tot);
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
//if(this.locals.page <= this.locals.total_pages){this.locals.maxlimit=}
yield next;
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
function isNumb(str){var numstr=/^\d+$/;return numstr.test(str);}