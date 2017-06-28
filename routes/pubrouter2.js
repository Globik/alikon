'use strict';
const valuid=require('uuid-validate');
const passport=require('koa-passport');
const bodyParser=require('koa-body');
const Router=require('koa-router');
const walletValidator=require('wallet-address-validator');//0.1.0
//var moment=require('moment');
const cofs=require('../libs/await-fs.js');
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
pub.get('/',async ctx=>{
let result=null;
let bresult=null;
let db=ctx.db;
let m=null;
try{
var us=await db.query(`select*from busers`);
result=us.rows;
}catch(e){console.log(e)}
	
try{
	//rooms.status.view.src busers.id.name
let bus=await db.query(`select busers.id, busers.name,rooms.status,rooms.view,rooms.src from busers inner join rooms on busers.email=rooms.email`/*where view>=1`*/)
bresult=bus.rows;
//console.log('bresult: ',bresult)
}catch(e){console.log(e)}	
	
ctx.session.dorthin=this.path;
if(ctx.session.bmessage){m=ctx.session.bmessage;}
ctx.body=await ctx.render('haupt_page',{lusers:result,m:m,roomers:bresult});
if(ctx.session.bmessage){delete ctx.session.bmessage}
});

// bitpay callback's webhook
pub.post("/bp/cb", async ctx=>{
console.log("FROM BITPAY? :", ctx.request.body);
let db=ctx.db;
try{
await db.query(`insert into bitpayers(infbp) values('${JSON.stringify(ctx.request.body)}') 
on conflict((infbp->>'id'::text)) do update set infbp=jsonb_set(bitpayers.infbp,'{status}','"${ctx.request.body.status}"') 
where bitpayers.infbp->>'status' not like '%complete%'`);
}catch(e){console.log(e.message);ctx.throw(400,e.message);}
ctx.status=200;
ctx.body={info:"OK"}
});

pub.post('/api/dummy_set_bitpay', async ctx=>{
//console.log('DUMMY: ',this.request.body);
	let locs=ctx.request.body;
	var mummy={},zomby={};
	let boss=ctx.boss;
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
let jobid=await boss.publish('bitpay_paid',{message:mummy},{startIn:'35 seconds'});
	console.log('jobid: ',jobid);
let jobidu=await boss.publish('bitpay_complete',{message:zomby},{startIn:'1 minute'});
	console.log('jobidu: ',jobidu);
	}catch(e){console.log(e);ctx.throw(400,e.message);}
	ctx.body={info:"OK"};
	
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

pub.get('/login', async ctx=>{
let m=ctx.session.bmessage;
ctx.body=await ctx.render('login',{errmsg:m});
delete ctx.session.bmessage;
});

pub.get('/signup', async ctx=>{
if(ctx.isAuthenticated()) ctx.redirect(ctx.session.dorthin || '/');
let m=ctx.session.bmessage;
ctx.body=await ctx.render('signup',{errmsg: m});
delete ctx.session.bmessage;
});
/*
pub.post('/login', function*(next) {
var ctx = this;yield* passport.authenticate('local',function*(err, user,info) {
	if (err) throw err;
console.log('USER IN POST LOGIN : ', user);
if (!user) {ctx.session.messaga=[info.message];
	ctx.redirect('/login');} else {
		ctx.session.messaga=null;
		yield ctx.login(user);ctx.redirect(ctx.session.dorthin || '/');}}).call(this, next)}
		);
*/
pub.post('/login', (ctx,next)=>{
if(ctx.isAuthenticated()){
if(ctx.state.xhr){
ctx.throw(409, 'Schon authenticated!')
}else{
return ctx.redirect('/')
}
}
return passport.authenticate('local', (err,user,info,status)=>{
if(ctx.state.xhr){
if(err){ctx.body={success:false,info:err.message}; ctx.throw(500,err.message);}
if(user===false){
ctx.body={success:false,info:info.message}
ctx.throw(401,info.message)
}else{
ctx.body={success:true,info:info.message, redirect:ctx.session.dorthin || '/'}
return ctx.login(user)
}
}else{
if(err){
ctx.session.bmessage={success:false,error:err.message}; return ctx.redirect('/login');
}
if(user===false){
ctx.session.bmessage={success:false, error:info.message};
ctx.redirect('/login')
}else{
ctx.redirect('/')
return ctx.login(user)
}
}
}
)(ctx,next)
})

/*
pub.post('/signup', function*(next){
var ctx = this;yield* passport.authenticate('local-signup',function*(err, user,info) {
	//console.log('ERR, USER, INFO: ',err.message,user,info);
	
	if (err) {
		// 23514: new row for relation "busers" violates check constraint "busers_email_check"
		// 23505: email is already in use
		
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
		*/


pub.post('/signup', (ctx,next)=>{
if(ctx.isAuthenticated()){
if(ctx.state.xhr){
ctx.throw(409, 'Schon authenticated!')
}else{
return ctx.redirect('/')
}}
return passport.authenticate('local-signup', (err,user,info,status)=>{
console.log(err,user,info,status)
if(ctx.state.xhr){
	//23505 name already in use
if(err){
ctx.throw(409,err.message)
}

if(!user){
ctx.body={success:false, message:info.message,code:info.code}
}else{
ctx.body={success:true, message:info.message}
return ctx.login(user)
}
}else{
if(err){
ctx.session.bmessage={success:false,error:err.message,code:err.code,detail:err.detail}; return ctx.redirect('/signup');
}
if(!user){
ctx.session.bmessage={success:false,error:info.message}
ctx.redirect('/signup')
}else{	
ctx.session.bmessage={success:true, msg: info.message}
ctx.redirect('/')
return ctx.login(user)
}
}})(ctx,next)
})

pub.get('/logout', ctx=>{ctx.logout();ctx.redirect(ctx.session.dorthin || '/');});
pub.get('/forgot', async ctx=>{
//if(ctx.isAuthenticated()) ctx.redirect(ctx.session.dorthin || '/');
ctx.body=await ctx.render('forgot',{});	
});

pub.post('/forgot', async ctx=>{
if(!ctx.request.body.email) ctx.throw(400,"Please, provide your email!");
let db=ctx.db;
	//fordert LISTEN reset
	//notif-antwort:{email,token,toke_type='reset'}
try{
var mid=await db.query(`select request_password_reset('${ctx.request.body.email}')`);
}catch(e){
		//console.log('err in post forgot!!!: ',e.message);
ctx.throw(409, e.message);}
ctx.body={"message": `We have sent a password reset email to your email address: ${ctx.request.body.email}.<br> Please check your inbox to continue.`};
});

pub.get('/reset/:token', async ctx=>{
if(!valuid(ctx.params.token)) {
return ctx.redirect('/error');
}
//if(ctx.isAuthenticated()) ctx.redirect(ctx.session.dorthin || '/');
console.log('this.params.token: ', ctx.params.token);
let db=ctx.db;var error=null;
try{
var resu=await db.query(`select*from tokens where token='${ctx.params.token}' and created_at > now() - interval '2 days'`);
}catch(e){
ctx.body={"error":e};error=e;
}
if(resu && resu.rows[0]){
ctx.body=await ctx.render('reset',{"reset-token":ctx.params.token});
}else{
ctx.session.error="Link expired.";
ctx.redirect('/error');
}
})
pub.get('/error', async ctx=>{
ctx.session.dorthin=ctx.path;
ctx.body=await ctx.render('error',{message:ctx.message, error:ctx.session.error});
})
// heroku pg:psql --app alikon
pub.post('/reset/:token', async ctx=>{
if(!ctx.request.body.email && !ctx.request.body.token && !ctx.request.body.password) ctx.throw(400,"Please fill in folders");
let db=ctx.db;
try{
//select reset_password(email,token,pwd)
await db.query(`select reset_password('${ctx.request.body.email}','${ctx.request.body.token}','${ctx.request.body.password}')`);
}catch(e){
ctx.throw(404, e.message);
}
ctx.body={"message":`Your password has been changed! You may log into your account <a href='/login'>log in</a> 
					or go direct to <a href='/'>home</a>`};
})


pub.get('/email_validation/:token', async ctx=>{
if(!valuid(ctx.params.token)) {
return; //this.redirect('/');
}
//if(ctx.isAuthenticated()) ctx.redirect(ctx.session.dorthin || '/');
console.log('this.params.token: ', ctx.params.token);
let db=ctx.db;var pmail;var error=null;
try{await db.query(`select say_yes_email('${ctx.params.token}')`);}catch(e){
error=e.message;
}
ctx.body=await ctx.render('email_validation',{"message":"<h1>Your email address validated!</h1>", "redirect":"/", error:error});
})
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
pub.post('/xhr_failed_login', ctx=>{
ctx.body={body:ctx.request.body};
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

async function param_page(page,ctx,next){
if(isNumb(page)==false){ctx.redirect('/articles')}
else if(page==0 || page==1){ctx.redirect('/articles')}else{await next()}
}
/* end of articles */

pub.post('/photo_failure', async ctx=>{
console.log("PHOTO FAILURE OCCured");
let {dob, bid}=ctx, b=ctx.request.body, docs=dob.collection('posts');
try{let a=await docs.updateOne({_id:bid(b._id)},{$addToSet:{'meta.fail':b.fail_src}});console.log('a :',a.result);}
catch(e){this.throw(404,`not found ${e}`)}
ctx.body={info:ctx.request.body,somels:"OK - accepted!"}
});
pub.post('/module_cache', ctx=>{ctx.body={body: ctx.request.body};});
pub.get('/labs',ctx=>{ctx.body='str';});

pub.get('/tipping/purchase_tokens',ctx=>{
ctx.session.dorthin=ctx.path;
ctx.body=ctx.render('purchase',{/*buser:this.req.user*/});
});
/* *************************************************************************
WEBRTC STUFF /:models
*************************************************************************** */

pub.get('/webrtc/:buser_id', async ctx=>{
let db=ctx.db;
ctx.session.dorthin=ctx.path;
var us=null;
var owner=false;
try{
var result=await db.query(`select*from busers where id='${ctx.params.buser_id}'`);
us=result.rows[0];
if(ctx.state.user && ctx.state.user.id===ctx.params.buser_id){owner=true;}
}catch(e){console.log(e)}
ctx.body=await ctx.render('busers',{model: us,owner:owner});
});

pub.post('/api/set_transfer', async ctx=>{
if(!ctx.isAuthenticated()){
ctx.throw(400,"Not Authorizied from me");
}
let db=ctx.db;
let {from,to,amount,type,pid}=ctx.request.body;
try{
await db.query(`insert into transfer(tfrom, tos, amount,type,pid) values('${from}','${to}',${amount},${type},'${pid}')`)
}catch(e){ctx.throw(400,e.message);}
ctx.body={info: ctx.request.body}
})

pub.post('/api/set_seat', async ctx=>{
let db=ctx.db;
const {pid,who,status}=ctx.request.body;
try{
await db.query(`insert into seats(pid,us_id,status) values('${pid}','${who}','${status}')`);
}catch(e){console.log(e);}
ctx.body={info:"OK",body: ctx.request.body}
});

/* *************************************************************************
END OF WEBRTC STUFF
*************************************************************************** */
/*******************************************
CABINET
********************************************** */
pub.get('/home/profile', authent, async ctx=>{
let db=ctx.db;
ctx.session.dorthin=ctx.path;
try{
var cards=await db.query(`select addr from cards where us_id='${ctx.state.user.email}'`);
}catch(e){console.log(e);}
ctx.body=await ctx.render('cabinet',{cards:cards.rows[0]});
})

pub.post('/api/set_bitcoin_address',auth, async ctx=>{
let db=ctx.db;
const {addr,useremail}=ctx.request.body;
const vali=walletValidator.validate(addr,'bitcoin','testnet');
if(!vali){ctx.throw(400,'not valid bitcoin address!');}
try{
await db.query(`insert into cards(addr,us_id) values('${addr}','${useremail}') on conflict(us_id) do update set addr='${addr}',lmod=now()`);
}catch(e){ctx.throw(400,e.message)}
ctx.body={info:"OK",body:ctx.request.body}
})

pub.post('/api/get_tokens', auth, ctx=>{
let mont=ctx.render('vidget_tokens',{})
ctx.body={content:mont,body: ctx.request.body}
})

pub.post('/api/get_bcaddress', auth, async ctx=>{
let db=ctx.db;
try{
var cards=await db.query(`select addr from cards where us_id='${ctx.request.body.useremail}'`);
}catch(e){ctx.throw(400,e.message);}
let mont=ctx.render('vidget_card',{cards:cards.rows[0]});
ctx.body={info:"OK",content:mont};
})

pub.post('/api/set_convert', auth, async ctx=>{
let db=ctx.db;
const {useremail, amt_tok}=ctx.request.body;
try{
await db.query(`insert into converts(us_id, amt_tok) values('${useremail}', ${amt_tok})`)
}catch(e){ctx.throw(400,e.message)}
ctx.body={info:"OK",body: ctx.request.body}
})

/* DEMO */
pub.get('/demo/videostream', async ctx=>{
ctx.body=await ctx.render('demo_videostream',{})
})

pub.get('/demo/webrtc', async ctx=>{
ctx.body=await ctx.render('demo_webrtc',{})
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

async function pagination(ctx, next){
ctx.locals={};
var qu=parseInt(ctx.params.page) || 1;
var page=qu;
var num=page*limit;
var w=5,ab=[],deg=2;var map=new Map();

let db=ctx.db;
try{var total_articles=await db.query('select from articles');
}catch(e){console.log(e);return await next(e);}
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
ctx.locals.total_articles=total_articles.rowCount;
ctx.locals.total_pages=total_pages;
ctx.locals.page=page;
ctx.locals.rang_page=map;
if(num<total_articles) {ctx.locals.next=true;}
if(num>limit) {ctx.locals.prev=true;}
await next()
}

function auth(ctx, next){
if(ctx.isAuthenticated()){return next()}else{ 
ctx.throw(401,"Please, log in.");
}}
function authent(ctx, next){
if(ctx.isAuthenticated()){return next()}else{ctx.redirect('/login');}
}
function isNumb(str){var numstr=/^\d+$/;return numstr.test(str);}