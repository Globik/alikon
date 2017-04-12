'use strict';
const valuid=require('uuid-validate');
const passport=require('koa-passport');
const bodyParser=require('koa-body');
const Router=require('koa-router');
const walletValidator=require('wallet-address-validator');//0.1.0
//var moment=require('moment');
const cofs=require('co-fs');
const fs=require('fs');
/*
var bitpay=require('bitpay-rest');
var bitauth=require('bitauth');

//var privkey=bitauth.decrypt('',fs.readFileSync('/home/globik/.bitpay/api.key','utf8'));
var privkey=bitauth.decrypt('',process.env.BITPAY_TEST_APIKEY);
console.log('privkey: ',privkey);
*/
const pub=new Router();
//var debug=require('debug');^.+@.+\..+$^.+@.+\..+$
//var bpclient=bitpay.createClient(privkey);
//bpclient.on('error',err=>console.log(err));

//bpclient.on('ready',()=>{console.log('bitpay ready')})
const limit=3;
pub.get('/',function *(){
let result=null;
let db=this.db;
try{
var us=yield db.query(`select nick from busers`);
	result=us.rows;
}catch(e){console.log(e)}
this.session.dorthin=this.path;
this.body=this.render('haupt_page',{buser:this.req.user,lusers:result});
});

// bitpay callback's webhook
pub.post("/bp/cb",function*(){
console.log("FROM BITPAY? :", this.request.body);
let db=this.db;
try{
//yield db.query(`insert into bitpayers(infbp) values('${JSON.stringify(this.request.body)}')`);
yield db.query(`insert into bitpayers(infbp) values('${JSON.stringify(this.request.body)}') 
on conflict((infbp->>'id'::text)) do update set infbp=jsonb_set(bitpayers.infbp,'{status}','"${this.request.body.status}"') 
where bitpayers.infbp->>'status' not like '%complete%'`);
	}catch(e){console.log(e.message);this.throw(400,e.message);}
	this.status=200;
this.body={info:"OK"}
});

pub.post('/api/dummy_set_bitpay',function*(){
//console.log('DUMMY: ',this.request.body);
	let locs=this.request.body;
	var mummy={},zomby={};
	let boss=this.boss;
	mummy.id=locs.id;
	mummy.status="paid";
	mummy.posData=locs.posData;
	mummy.buyerFields={};
	mummy.buyerFields.buyerName=locs.buyer.name;
	mummy.buyerFields.buyerEmail=locs.buyer.email;
	mummy.invoiceTime=locs.invoiceTime;
	
	zomby.id=locs.id;
	zomby.status="complete";
	zomby.posData=locs.posData;
	zomby.buyerFields={};
	zomby.buyerFields.buyerName=locs.buyer.name;
	zomby.buyerFields.buyerEmail=locs.buyer.email;
	zomby.invoiceTime=locs.invoiceTime;
	
	try{
// '{"id":"a","status":"complete","posData":"{\"items\":10}","buyerFields":"{\"buyerEmail\":\"gru5@yandex.ru\"}"}'
	console.log('mummy: ',mummy);
let jobid=yield boss.publish('bitpay_paid',{message:mummy},{startIn:'35 seconds'});
	console.log('jobid: ',jobid);
let jobidu=yield boss.publish('bitpay_complete',{message:zomby},{startIn:'1 minute'});
	console.log('jobidu: ',jobidu);
	}catch(e){console.log(e);this.throw(400,e.message);}
	this.body={info:"OK"};
	
	/*DUMMY:  { url: 'https://test.bitpay.com/invoice?id=3da5psPieZE2H4TJkiKwwo',
  posData: '{"items":100}',
  status: 'new',
  btcPrice: '0.000932',
  btcDue: '0.000933',
  price: 1,
  currency: 'USD',
  exRates: { USD: 1072.64 },
  buyerTotalBtcAmount: '0.000933',
  itemDesc: '100 Tokens',
  orderId: '123456789fd',
  invoiceTime: 1491081859206,
  expirationTime: 1491082759206,
  currentTime: 1491081859671,
  guid: '47e54fbc-9cc0-01d9-3372-5225fea12821',
  id: '3da5psPieZE2H4TJkiKwwo',
  btcPaid: '0.000000',
  rate: 1072.64,
  exceptionStatus: false,
  transactions: [],
  flags: { refundable: false },
  refundAddresses: [],
  buyerPaidBtcMinerFee: '0.000001',
  paymentUrls: 
   { BIP21: 'bitcoin:mqWzsnkXizvhoSmsKVMqKpg231XH6M2tom?amount=0.000933',
     BIP72: 'bitcoin:mqWzsnkXizvhoSmsKVMqKpg231XH6M2tom?amount=0.000933&r=https://test.bitpay.com/i/3da5psPieZE2H4TJkiKwwo',
     BIP72b: 'bitcoin:?r=https://test.bitpay.com/i/3da5psPieZE2H4TJkiKwwo',
     BIP73: 'https://test.bitpay.com/i/3da5psPieZE2H4TJkiKwwo' },
  bitcoinAddress: 'mqWzsnkXizvhoSmsKVMqKpg231XH6M2tom',
  token: '9eV9CZmk6mLe9YCDtmv1191RMktUdEcBxNFGzkK9MpzoHNoUFMUvV3JFdrAqMVY7vt',
  buyer: { name: 'nik', email: 'example@yandex.ru' } }
*/
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

pub.get('/tipping/purchase_tokens',function*(){
this.session.dorthin=this.path;
this.body=this.render('purchase',{buser:this.req.user});
});
/* *************************************************************************
WEBRTC STUFF /:models
*************************************************************************** */

pub.get('/webrtc/:buser',function*(){
let db=this.db;
this.session.dorthin=this.path;
var us=null
try{
var result=yield db.query(`select*from busers where nick='${this.params.buser}'`);
	us=result.rows[0];
}catch(e){console.log(e)}
this.body=this.render('busers',{buser:this.req.user,model: us});
});

pub.post('/api/set_transfer', function*(){
if(!this.req.isAuthenticated()){
	this.throw(400,"Not Authorizied from me");
}
let db=this.db;
let {from,to,amount,type,pid}=this.request.body;
try{
yield db.query(`insert into transfer(tfrom, tos, amount,type,pid) values('${from}','${to}',${amount},${type},'${pid}')`)
}catch(e){this.throw(400,e.message);}
this.body={info:this.request.body}
})

pub.post('/api/set_seat',function*(){
let db=this.db;
var {pid,who,status}=this.request.body;
	try{
	yield db.query(`insert into seats(pid,us_id,status) values('${pid}','${who}','${status}')`);
	}catch(e){console.log(e);}
this.body={info:"OK",body:this.request.body}
});

/* *************************************************************************
END OF WEBRTC STUFF
*************************************************************************** */
/*******************************************
CABINET
********************************************** */
pub.get('/home/profile', authent, function*(){
	let db=this.db;
	//var result=null;
	try{
	var cards=yield db.query(`select addr from cards where us_id='${this.req.user.email}'`);
		//result=cards.rows[0];
		//console.log('cards.rows[0]: ',cards.rows[0]);
	}catch(e){console.log(e);}
//this.set('Access-Control-Allow-Origin','*');
//this.set('Access-Control-Allow-Methods','GET','HEAD','POST');
//this.set('Access-Control-Allow-Headers','*')
this.body=this.render('cabinet',{buser:this.req.user,cards:cards.rows[0]});
})

pub.post('/api/set_bitcoin_address',auth,function*(){
let db=this.db;
	var {addr,useremail}=this.request.body;
	var vali=walletValidator.validate(addr,'bitcoin','testnet');
	if(!vali){this.throw(400,'not valid bitcoin address!');}
	try{
yield db.query(`insert into cards(addr,us_id) values('${addr}','${useremail}') on conflict(us_id) do update set addr='${addr}',lmod=now()`);
	}catch(e){this.throw(400,e.message);}
	this.body={info:"OK",body:this.request.body};
})

pub.post('/api/get_tokens', auth,function*(){
	let mont=this.render('vidget_tokens',{buser:this.req.user});
		 //console.log('mont: ',mont);
this.body={content:mont,body:this.request.body};
})

pub.post('/api/get_bcaddress', auth, function*(){
let db=this.db;
	try{
	var cards=yield db.query(`select addr from cards where us_id='${this.request.body.useremail}'`);
	}catch(e){this.throw(400,e.message);}
	let mont=this.render('vidget_card',{cards:cards.rows[0]});
	this.body={info:"OK",content:mont};
})

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
/*
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
*/
function *auth(next){
if(this.req.isAuthenticated()){yield next;}else{ 
	//this.redirect('/login');
this.throw(401,"Please, log in.");
}}
function *authent(next){
if(this.req.isAuthenticated()){yield next;}else{this.redirect('/login');}
}
function isNumb(str){var numstr=/^\d+$/;return numstr.test(str);}