'use strict';
var passport=require('koa-passport');
var bodyParser=require('koa-body');
var Router=require('koa-router');
var moment=require('moment');
var cofs=require('co-fs');
var pub=new Router();

const limit=10;
pub.get('/',function *(){
this.body=this.render('haupt_page',{buser:this.req.user});
});
pub.post('/get_html',function *(){
	var fucker="New Fucker Retro Roman";
	this.body={fi:`<b class="mama">html from server and temlate var ${fucker}</b>`};
})
//npm start
pub.get('/login',function *(){
var m=this.session.messaga;
console.log('m :',m);
	var message=m;//'this.flash.message';
	this.body=this.render('login',{message});
this.session.messaga=null;
});

//node index
pub.post('/login', function*(next) {
var ctx = this;
yield* passport.authenticate('local',function*(err, user,info) {
if (err) throw err;
if (!user) {
ctx.session.messaga=[info.message];//"AAAAAAAAA";
 ctx.status =401;
ctx.redirect('/login');
 } 
else {
  yield ctx.login(user); 
  //iojs index
  console.log('Where are you from :'+ctx.session.dorthin);
  console.log("You are from the this.flash.woane direction in custom :"+ctx.flash.woane);
ctx.redirect('/');
  //ctx.body={success:true,redirect:ctx.session.dorthin || '/'};
  //ctx.redirect(ctx.session.dorthin || '/app');
    }
  }).call(this, next)
});

pub.get('/logout', function*() {this.logout();this.redirect('/');});

//var articles_page=rel('../views/articles_page');
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
	this.type="html";
	var str=`<a href="/labs/2001-02-29">2001-02-29</a><br>
	<a href="/labs/2004-12-34">2004-12-34</a><br>
	<a href="/labs/2016-09-25">2016-09-25</a><br>
	<a href="/labs/2016-18-03">2016-10-10</a><br>
	<a href="/labs/1999+01-01">1999+01-01</a><br>`;
	this.body=str;
	});
	pub.get('/labs/:b',function *(){
		var g=/^(19|20)\d\d[-/.](0[1-9]|1[012])[-/.](0[1-9]|[12][0-9]|3[01])$/.test(this.params.b);
		console.log('g :',g);
		//this.body={param:this.params.b,test:g}
		var w=new Date(parseInt('2015-07-11'.substring(0,8),16)*1000).toString(16);
		var d=Math.floor((new Date('2015-07-11'))/1000).toString(16)+"0000000000000000";
		//var d3=Math.floor((new Date('2015-07-11')-1000*60*60*24).getTime()/1000).toString(16)+"0000000000000000";
		var db=this.dob,bid=this.bid;var docs=db.collection('posts');
		//try{var p=yield post.findOne({_id:{$lte:bid(d2)/*,$lt:bid(d2)*/}});}catch(e){console.log(e)}
var cursor=docs.find({},{body:0}).limit(5);
	try{var abba=yield readStr2(cursor);}
	catch(e){console.log('e in db stream :',e);var err=e;}
		this.body={post:abba,d:d,error:err};
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