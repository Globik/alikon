'use strict';
var passport=require('koa-passport');
var bodyParser=require('koa-body');
var Router=require('koa-router');
//var moment=require('moment');
var cofs=require('co-fs');
var pub=new Router();
//var debug=require('debug');

const limit=10;
pub.get('/',function *(){
this.session.dorthin=this.path;
this.body=this.render('haupt_page',{buser:this.req.user});
});

pub.get('/login',function *(){
var m=this.session.messaga;
	this.body=this.render('login',{message:'test_mess: '+m});
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
var ctx = this;yield* passport.authenticate('local',function*(err, user,info) {if (err) throw err;
if (!user) {ctx.session.messaga=[info.message];
	ctx.redirect('/login');} else {yield ctx.login(user);ctx.redirect(ctx.session.dorthin || '/');}}).call(this, next)}
		);

pub.post('/signup', function*(next){
var ctx = this;yield* passport.authenticate('local-signup',function*(err, user,info) {
	if (err) throw err;
if (!user) {ctx.session.messaga=[info.message];
	//ctx.redirect('/signup');
			ctx.body={"message":ctx.session.messaga};
		   } 
	else {yield ctx.login(user);
//ctx.redirect(ctx.session.dorthin || '/');
	ctx.body={"message":"success. Email verification needed"};	 
		 }}).call(this, next)}
		
		)
//pub.post('/login',passport.authenticate('local',{successRedirect:'/',failureRedirect:'/'}));
pub.get('/logout', function*() {this.logout();this.redirect('/');});


pub.get('/articles', pagination, function *(){
let {dob,locals}=this, docs=dob.collection('posts');
try{
var posts=yield docs.find().limit(limit).skip(0).sort({_id:-1}).toArray();}
catch(e){console.log('e :',e);}
this.type="html";
this.body=this.render('articles_page',{buser:this.req.user,posts,locals});});

pub.param('page',function *(page,next){
	console.log('page :',page);
	console.log('isNumb :',isNumb(page))
if(isNumb(page)==false){this.status=404;this.redirect('/articles')}
else if(page==0 || page==1){this.status=404;this.redirect('/articles');}else{yield next;}
}).get('/articles/:page',pagination,function *(page){
	//var locals=this.locals;
	let {dob,locals}=this, docs=dob.collection('posts');var err=null;
	if(locals.page <= locals.total_pages){
		try{
		var posts=yield docs.find().limit(limit).skip(limit*(locals.page-1)).sort({_id:-1}).toArray();
		}catch(e){console.log('err in db:',e);err=e;}
		this.type="html";
	this.body=this.render('articles_page',{locals,buser:this.req.user,posts});
	}
	else{this.status=404;this.redirect('/articles');}
});

//var article_view=rel('../views/article_view.js');
pub.get('/articles/:date_url/:slug',function *(){
	let {dob,bid}=this, docs=dob.collection('posts'); var post;
	//console.log(this.params.slug, this.params.date_url)
try{
post=yield docs.findAndModify({slug:this.params.slug,date_url:this.params.date_url},[],{$inc:{gesamt_seen:1}},{new:true});
//console.log('POST :',post);
//{value:{},lastErrorObject:{updatedExisting:true,n:1},ok:1}
if(post.value !==null){post=post.value;}else{console.log("Found Null Matches");this.redirect('/articles')}
}catch(e){console.log('MMMMMmodify error :',e);this.redirect('/articles');}
console.log('SUBADMIN :',this.state.subadmin);
console.log('STATE: ',this.state);
	this.type="html";
	this.body=this.render('article_view',{buser:this.req.user,post});
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
module.exports=pub;

function *pagination(next){
this.locals={};
var qu=parseInt(this.params.page) || 1;
	var page=qu;
	var num=page*limit;
var w=5,ab=[],deg=2;var map=new Map();

var db=this.dob;
var docs=db.collection('posts');
try{var total_articles=yield docs.count();}catch(e){console.log(e);return next(e);}
var total_pages=Math.ceil(total_articles/limit);
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
this.locals.total_articles=total_articles;
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