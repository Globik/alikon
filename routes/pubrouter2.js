'use strict';
const valuid=require('uuid-validate');
const shortid=require('shortid');
const passport=require('koa-passport');
const bodyParser=require('koa-body');
const Router=require('koa-router');
const walletValidator=require('wallet-address-validator');//0.1.0
//var moment=require('moment');
const {readf}=require('../libs/await-fs.js');//cofs
const fs=require('fs');
const email_enc=require('../libs/email_enc.js');
const {Encoder, Levels, Types}=require('../libs/qr-node.js');
const rk=require('request');
const conf_pay=require('../config/pay.json');

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

function rkw(obj){return new Promise(function(res,rej){
rk(obj,function(err,resp,body){
if(err)rej(err)
res({resp:resp,body:body})
})})
	}
function is_devel(b){
if(process.env.DEVELOPMENT=="yes"){
	if(!b){return false;}
	return true;
}else{return false;}
}
pub.get('/',async ctx=>{
let result=null;
let bresult=null;
let db=ctx.db;
let m=null;
try{
var us=await db.query(`select*from busers`);
result=us.rows;
}catch(e){console.log(e)}
	console.log('ctx.state.user BUSERRRR: ',ctx.state.user);
try{
	//rooms.status.view.src busers.id.name
let bus=await db.query(`select busers.id, busers.name,rooms.status,rooms.view,rooms.src 
from busers inner join rooms on busers.name=rooms.room_name`/*where view>=1`*/)
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
})

pub.post('/api/posturlparams/:name/:card',bodyParser({multipart:true,formidable:{}}),async ctx=>{
	console.log('ctx.params.name: ',ctx.params,' : ',ctx.params.name);
	console.log('ctx.params.card: ',ctx.params.card);
	console.log('REQUEST.BODY: ',ctx.request.body)
	//console.log('HEADERS: ',ctx.request.headers) multipart/form-data
ctx.body={"body":ctx.request.body.fields};
})
pub.get("/api/get_qrcode",async ctx=>{
var grund="https://bitaps.com/api/";
var padres="1DSPfSrZDJJXCKfVPmmP6ZEw45GLvWtSAk?amount=20.3&label=Vasja_Pupkin&message=order%20for%tokens";
var s6=grund+"qrcode/"+padres;
	try{
	var ewq=await rkw({method:'get',url:s6});
console.log('ewq status code: ',ewq.resp.statusCode);
		console.log('ewq body: ',ewq.body)
	}catch(e){console.log('error in request.js: ',e);ctx.throw(404,e.message)}
	ctx.body={info:"OK",body:ewq.body}
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


/* TEST INTERFACE  css and js on fron end */

pub.get('/interfaces',async ctx=>{
ctx.body=await ctx.render("interfaces",{});	
})

pub.get('/interfaces/testBtcInput', async ctx=>{
ctx.body=await ctx.render('test_btc_input',{})	
})
pub.get('/interfaces/pidaraska',async ctx=>{
ctx.body=await ctx.render('test_btc_input2',{})	
})
pub.get('/interfaces/pidaraska1',async ctx=>{
ctx.body=await ctx.render('test_btc_input3',{})	
})


/* END OF TEST INTERFACE */

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
})
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
ctx.redirect(ctx.session.dorthin || '/')
return ctx.login(user)
}
}
}
)(ctx,next)
})
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
	console.log('XHR!!!!');
	//23505 name already in use
if(err){
ctx.throw(409,err.message)
}

if(!user){
ctx.body={success:false, message:info.message,code:info.code,bcode:info.bcode}
}else{
ctx.body={success:true, message:info.message,redirect:ctx.session.dorthin || '/'}
return ctx.login(user)
}
}else{
if(err){
ctx.session.bmessage={success:false,message:err.message}; return ctx.redirect('/signup');
}
if(!user){
ctx.session.bmessage={success:false,message:info.message,code:info.code,bcode:info.bcode}
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
let  m=ctx.session.bmessage;
ctx.body=await ctx.render('forgot',{errmsg:m});	
delete ctx.session.bmessage;
});

pub.post('/forgot', async ctx=>{
let es="Please, provide your email!";
if(!ctx.request.body.email){ 
if(ctx.sate.xhr){
ctx.throw(400,es)
}else{
ctx.session.bmessage={success:false,message:es}
return ctx.redirect('/forgot');
}
}
let db=ctx.db;
try{
await db.query(`select request_password_reset('${ctx.request.body.email}')`);
}catch(e){

if(ctx.state.xhr){ctx.throw(409, e.message);}else{bodyParser({multipart:true,formidable:{}})
ctx.session.bmessage={success:false,message:e.message}
return ctx.redirect('/forgot')
}
}
let ms=`We have sent a password reset email to your email address: <a href="mailto:${ctx.request.body.email}">${ctx.request.body.email}</a><br><br> Please check your inbox to continue.`;

if(ctx.state.xhr){
ctx.body={"message": ms}

}else{
ctx.session.bmessage={success:true,message:ms}
ctx.redirect('/forgot')
}
});

pub.get('/reset/:token', async ctx=>{
if(!valuid(ctx.params.token)) {ctx.session.error="Not Found";return ctx.redirect('/error');}
console.log('this.params.token: ', ctx.params.token);
let db=ctx.db;var error=null;var result=undefined;var resu=null;
try{
resu=await db.query(`select*from tokens where token='${ctx.params.token}' and created_at > now() - interval '2 days'`);
}catch(e){
error=e;
	//if params uuid not valif
	console.log('error in unterstutzung: ',e);
}
if(resu && resu.rows[0]){
	result=resu.rows[0];
	console.log('resu.rows: ',resu.rows[0],' ',resu.rows)
let mer=ctx.session.bmessage;
ctx.body=await ctx.render('reset',{"reset-token":ctx.params.token,error,result,errmsg:mer});
delete ctx.session.bmessage;
}else{
ctx.session.error="Link expired.";
ctx.redirect('/error');
}
})

pub.get('/error', async ctx=>{
ctx.body=await ctx.render('error',{message:ctx.message, error:ctx.session.error});
delete ctx.session.error;
delete ctx.message;
})

// heroku pg:psql --app alikon
pub.post('/reset/:token', async ctx=>{
if(!ctx.request.body.email && !ctx.request.body.token && !ctx.request.body.password) {
let es="Please fill out all fields!"
if(ctx.state.xhr){ctx.throw(400,es)}else{
ctx.session.error=es;
return ctx.redirect(`/reset/${ctx.request.body.token}` || '/error')
}
}
let db=ctx.db;
try{
await db.query(`select reset_password('${ctx.request.body.email}','${ctx.request.body.token}','${ctx.request.body.password}')`);
}catch(e){
if(ctx.state.xhr){ctx.throw(409, e.message);}else{
ctx.session.bmessage={success:false,message:e.message}
ctx.session.error=e.message;
return ctx.redirect(`/reset/${ctx.request.body.token}` || '/error')
}
}
let mis=`Your password has been changed! You may log into your account <a href='/login'>log in</a> or go direct to <a href='/'>home</a>`
if(ctx.state.xhr){
ctx.body={"message":mis};
}else{
ctx.session.bmessage={success:true,message:mis}
ctx.session.error=mis;
ctx.redirect(`/reset/${ctx.request.body.token}` || '/error')
}
})


pub.get('/email_validation/:token', async ctx=>{
if(!valuid(ctx.params.token)) {
ctx.session.error="Not Found";
return ctx.redirect('/error');
}
console.log('this.params.token: ', ctx.params.token);
let db=ctx.db, error=null;
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

pub.get('/testify',async ctx=>{
ctx.body=await ctx.render('test',{})
})
pub.post('/get_me_please',async ctx=>{
ctx.body={info:ctx.request.body}
})
/*
pub.post('/fucking_arschloch',async ctx=>{
ctx.body={"form_post_info":ctx.request.body}
})
*/
pub.post('/fucking_arschloch',bodyParser({multipart:true,formidable:{}}),async ctx=>{
ctx.body={"fields":ctx.request.body.fields}
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
})
pub.post('/module_cache', ctx=>{ctx.body={body: ctx.request.body};});
pub.get('/labs',ctx=>{ctx.body='str';});

pub.get('/tipping/purchase_tokens',async ctx=>{
ctx.session.dorthin=ctx.path;
let packs=ctx.tok_pack;
ctx.body=await ctx.render('bitpay',{packs});
})
pub.get(`/${conf_pay.bitaps_href}`,async ctx=>{
ctx.session.dorthin=ctx.path;
//let payconf=ctx.payment;
let packs=ctx.tok_pack;
//console.log('CTX>PAYMENT: ',ctx.payment)
//console.log('CTX>TOK_PACK: ',ctx.tok_pack)
ctx.body=await ctx.render('bitaps',{packs})
})
 var payment_code_dev='PMTvNPy4NYp9PKZ76BG1f4KAWR3LC95XQS1rWgYjG1NGEshAqge63';
 var invoice_dev='invNoStCHMT7SwUESos6oW9UhnFCQjJ6E6LwXWDCLBB5RYtMGpJYm';
 var address_dev='18J8Qjy6AJLV4icAcWAjPELNxrhzEnwecb'; 

//var qr=require('qrcode-js')
//var url="http://example.com"
//var b=qr.toDataURL(url,4)
const bas_part='data:image/png;base64,';
const bas_part2='data:image/svg+xml;base64,';
//const {setOptions,qrencode}=require('qrencode_mini');
const res_qr={
dot_size:6,
level:"l",
margin:4
}
//var res_qr2=setOptions(res_qr);
//console.log("grencode_mini set_options: ",res_qr);
//console.log("qrencode_mini fact: ",res_qr2);
const ob64={
/*background_color:'#76eec6',
foreground_color:'#ff0000', */
level:Levels.HIGH, 
dot_size:12/2,
margin:8/2,
type:Types.PNG
}
const vstr='insert into bitaps_tmp(bt_inv_id,addr,p_c,us_id,bt_pck_tok,brd_pt) values($1,$2,$3,$4,$5,$6) returning addr,bt_pck_tok,bt_inv_id';
const vstr2=n=>{ return `${n.a}?amount=${n.am}&label=${n.l}&message=Purchase%20${n.p}%20tokens`;}
async function dor_b64(url,n){
try{
let b=await Encoder.encode(url,null,n)
if(n.type=='SVG'){
return b.toString();
}else{
return `${bas_part}${b.toString('base64')}`
}
}catch(e){throw e}
}


let advalid='Server side btc address is not valid!';

pub.post('/tipping/get_invoice',xhr_auth,bodyParser({multipart:true,formidable:{}}),async ctx=>{
if(!ctx.payment && !ctx.payment.enabled){ctx.throw(400,'no ctx.payment provided!')}
if(ctx.payment.enabled=="false"){ctx.throw(404,'Service temporary not available. Please try later!')}
let {hotadr_quota,grund,cb_part,ptype}=ctx.payment;
if(!hotadr_quota || !grund || !cb_part || !ptype)ctx.throw(400,"hquota or grund or cb_part or ptype is not provided!")
let db=ctx.db;
let smin='20';
if(ctx.state.xhr){
let mata=ctx.request.body.fields;
if(!mata){ctx.throw(400,'no body vars')}
if(!mata.tok_pack  && !mata.buyerId){ctx.throw(400,'Not enough data provided to be processed.')}
let {tok_pack,buyerId,items2}=mata;let src4=null;let mres2;
try{
var mres=await db.query('select * from get_invoice($1,$2,$3,$4)',[buyerId,'anfang',tok_pack,smin]);

}catch(e){ctx.throw(400,e.name)}
if(mres.rows[0]){
try{
src4=await dor_b64(vstr2({a:mres.rows[0].addr,am:items2,l:buyerId,p:tok_pack}),ob64)
//let f=await qrencode(Buffer.from(vstr2({a:mres.rows[0].addr,am:items2,l:buyerId,p:tok_pack})));
//src4=bas_part+f.toString('base64');
}catch(e){ctx.throw(400,e);}
	
ctx.body={body:mata,result:mres.rows[0],src4,type:"alt",prod:is_devel(true),ptype:ptype}
}else{
if(is_devel(true)){
try{
	//inserting into bitaps_tmp
mres2=await db.query(vstr,[invoice_dev,address_dev, payment_code_dev, buyerId, tok_pack, ptype])
try{
src4=await dor_b64(vstr2({a:mres2.rows[0].addr,am:items2,l:buyerId,p:mres2.rows[0].bt_pck_tok}),ob64)
//let f=await qrencode(Buffer.from(vstr2({a:mres2.rows[0].addr,am:items2,l:buyerId,p:mres2.rows[0].bt_pck_tok})));
//src4=bas_part+f.toString('base64');
}catch(e){ctx.throw(400,e);}
ctx.body={body:mata,result:mres2.rows[0],src4,type:"neu",prod:false,ptype:ptype}
}catch(e){ctx.throw(400,e)}
}else{
//let real_address="1Gdc5d6hKQnguxrkHmPYw4A1bP7rHAoSAs";
//let cold_wallet_address="1DnxfQ4YqAvzEkeR6XBkxQt76MRQvScet3";
	const cwa="1BMXmqU3fZ8PVjPbxgeenEX93YYf74bjeB";
//let estr="https://alikon.herokuapp.com/bitaps/cb/"+buyerId;//?
const estr="https://alikon.herokuapp.com/"+cb_part+buyerId;
let estr2=encodeURIComponent(estr),cb1=estr2
//let grund="https://bitaps.com/api/";
let s6=grund+"create/payment/smartcontract/"+cb1;

	let hoti,coldi;
	try{
	let rw=await db.query("select rd_adr,rd_cold_adr from reedem where rd_t='a'")
	if(rw.rows[0]){hoti=rw.rows[0].rd_adr;coldi=rw.rows[0].rd_cold_adr;
	if(hoti==coldi){ctx.throw(400,"coldi and hoti must not to be equal. Check it initial params in reedem.")}
	}else{ctx.throw(400,"no coldi or hoti found.")}
	}catch(e){ctx.throw(400,e)}
let vali3=walletValidator.validate(hoti,'bitcoin');
if(!vali3){ctx.throw(400,advalid)}
let vali4=walletValidator.validate(coldi,'bitcoin');
if(!vali4){ctx.throw(400,advalid)}
let s7=grund+"create/payment/"+coldi+"/"+cb1+"?";
let qes={confirmations:3,free_level:"low"};
let data7={method:"get",url:s7,qs:qes}
let data5={type:"hot_wallet",hot_wallet:hoti,cold_storage:coldi,hot_wallet_quota:Number(hotadr_quota)}
let ops5={url:s6,method:'post',json:true,body:data5};
let misha;let isjson=false;let resulti;
if(ptype=="hot"){
misha=ops5;
}else if(ptype=="single"){
misha=data7;
}else{ctx.throw(400,"no ptype specified. Single or hot?")}
try{
var ewq2=await rkw(misha);
	try{let sac=JSON.parse(ewq2.body);
		isjson=true;
	   resulti=sac;
	   }catch(e){
	console.log('js parse err: ',e);
	   //todo check is_object?
	   }
	
var {invoice,address,payment_code}=(isjson?resulti:ewq2.body);
}catch(e){ctx.throw(404,e.message)}
try{
mres2=await db.query(vstr,[invoice,address,payment_code,buyerId,tok_pack,ptype])
}catch(e){ctx.throw(400,e)}
try{
//src4=await dor_b64(vstr2({a:mres2.rows[0].addr,am:items2,l:buyerId,p:mres2.rows[0].bt_pck_tok}),ob64)
let f=await qrencode(Buffer.from(vstr2({a:mres2.rows[0].addr,am:items2,l:buyerId,p:mres2.rows[0].bt_pck_tok})));
src4=bas_part+f.toString('base64');
}catch(e){ctx.throw(400,e);}
ctx.body={body:mata,result:mres2.rows[0],src4,type:"neu",prod:true,ptype:ptype}
}
}

}else{
ctx.body={info:"We are sorry, but we don't process non xhr payment request."}
}
})

pub.post('/bitaps/cb/:bus_id',async ctx=>{
let db=ctx.db;
let b=ctx.request.body;
if(!b){ctx.throw(400,'no body vars')}
if(!b.code){ctx.throw(400,'no p_code provided')}
let cb_us_id=ctx.params.bus_id;
if(!cb_us_id){ctx.throw(404,'cb_us_id is not found.')}
	let tx_h=b.tx_hash;
	let adr=b.address;
	let inv=b.invoice;
	let p_c=b.code;
	let amt=b.amount;//satoshi
	let cnf=b.confirmations;
	let p_tx_h=b.payout_tx_hash;
	let p_m_f=b.payout_miner_fee;
	let p_s_f=b.payout_service_fee;
	console.log(cb_us_id,'\n',tx_h,'\n',adr,'\n',inv,'\n',p_c,'\n',amt,'\n',cnf,'\n',p_tx_h,'\n',p_m_f,'\n',p_s_f,'\n')

/*	bitaps_cb_proc(tx_h text,adr text,inv text,p_c text,
				   amt bigint,cnf int,p_tx_h text,
				   p_m_f float,p_s_f float,
				cb_us_id varchar(24)) 
										 */
try{
await db.query('select bitaps_cb_proc($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
			   [tx_h,adr,inv,p_c,amt,cnf,p_tx_h,p_m_f,p_s_f,cb_us_id])
}catch(e){console.log(e);ctx.throw(400,e);}

if(is_devel(true)){
ctx.body={body:b,params:ctx.params,invoice:inv}
}else{ctx.body=inv;}
})

/* BITPAY */
const bitpay=require('bitpay-rest');
const bitauth=require('bitauth');
//var privkey=bitauth.decrypt('',fs.readFileSync('/home/globik/.bitpay/api.key','utf8'));
const privkey=bitauth.decrypt('',process.env.BITPAY_TEST_APIKEY);
console.log('privkey: ',privkey);
const bpclient=bitpay.createClient(privkey);
bpclient.on('error',err=>console.log(err));
bpclient.on('ready',()=>{console.log('bitpay ready')})

pub.post('/create_invoice', xhr_auth, bodyParser({multipart:true,formidable:{}}), async ctx=>{
var mata=ctx.request.body.fields;
//console.log('mata: ',mata);
	/*is_develop: 'true',
  items2: '0.08',
  tok_pack: '200',
  posData: '{"items":undefined}',
  itemDesc: 'undefined Tokens',
  itemCode: 66666,
  orderID: '123456789fd',
  fullNotifications: true,
  */

	mata.posData=`{"items":${mata.tok_pack}}`;
	mata.price=mata.items2;
	//mata.posData.ref="referal-123456"; mata.posData.affiliate="some affiliate fucker";
	mata.itemDesc=mata.tok_pack+" Tokens";
	mata.itemCode=66666;
	//bitcoin:?r=https://test.bitpay.com/i/NcG8qsX1dUgvRgsudbnX48
	//mata.buyerEmail=process.env.DEV_EMAIL;
    //mata.buyerName="Ali Boos";
	mata.orderID="123456789fd";
	mata.fullNotifications=true;
	mata.currency="BTC";
	//mata.notificationEmail=process.env.DEV_EMAIL;
	mata.notificationURL="https://alikon.herokuapp.com/bp/cb";
	//mata.notificationURL="https://localhost:5000/bp/cb";
	
	console.log('mata: ',mata);
	//console.log('mata: ',mata);
	function bitp(d){
	return new Promise((resolve,reject)=>{bpclient.as('merchant').post('invoices',d,(err,invoice)=>err?reject(err):resolve(invoice))
	})
	}
	var binv=null;
	try{
	var invoice=await bitp(mata);
		console.log('invoice resultat: ',invoice);
		console.log('posData: ', JSON.parse(invoice.posData).items);
		//console.log('posData: ',invoice.posData.items);
		console.log('buyeremail: ',invoice.buyer.email);
	}catch(e){console.log(e);ctx.throw(400,e.message);}
	if(process.env.DEVELOPMENT=="yes"){binv=invoice;}
ctx.body={id:invoice.id, messy:binv};
	/*
	invoice resultat:  { url: 'https://test.bitpay.com/invoice?id=NcG8qsX1dUgvRgsudbnX48',
  posData: '{"items":100}',
  status: 'new',
  btcPrice: '0.040000',
  btcDue: '0.040004',
  price: 0.04,
  currency: 'BTC',
  itemDesc: '100 Tokens',
  orderId: '123456789fd',
  invoiceTime: 1516477444197,
  expirationTime: 1516478344197,
  currentTime: 1516477444211,
  guid: 'b93ca892-ed98-0b19-26ca-8b5d1d8a170e',
  id: 'NcG8qsX1dUgvRgsudbnX48',
  lowFeeDetected: false,
  amountPaid: 0,
  btcPaid: '0.000000',
  rate: 1,
  exceptionStatus: false,
  transactions: [],
  buyer: {},
  flags: { refundable: false },
  refundAddresses: [],
  refundAddressRequestPending: false,
  buyerProvidedInfo: { selectedTransactionCurrency: 'BTC' },
  addresses: { BTC: 'mxn1pDYdR2kW3qDT4JDxFSXaPBsiaVhoFP' },
  paymentSubtotals: { BTC: 4000000 },
  paymentTotals: { BTC: 4000400 },
  bitcoinAddress: 'mxn1pDYdR2kW3qDT4JDxFSXaPBsiaVhoFP',
  minerFees: { BTC: { satoshisPerByte: 3, totalFee: 400 } },
  buyerPaidBtcMinerFee: '0.000004',
  supportedTransactionCurrencies: { BTC: { enabled: true } },
  exRates: { USD: 12810.3 },
  paymentUrls: 
   { BIP21: 'bitcoin:mxn1pDYdR2kW3qDT4JDxFSXaPBsiaVhoFP?amount=0.040004',
     BIP72: 'bitcoin:mxn1pDYdR2kW3qDT4JDxFSXaPBsiaVhoFP?amount=0.040004&r=https://test.bitpay.com/i/NcG8qsX1dUgvRgsudbnX48',
     BIP72b: 'bitcoin:?r=https://test.bitpay.com/i/NcG8qsX1dUgvRgsudbnX48',
     BIP73: 'https://test.bitpay.com/i/NcG8qsX1dUgvRgsudbnX48' },
  exchangeRates: { BTC: { USD: 12810.3 } },
  paymentCodes: 
   { BTC: 
      { BIP21: 'bitcoin:mxn1pDYdR2kW3qDT4JDxFSXaPBsiaVhoFP?amount=0.040004',
        BIP72: 'bitcoin:mxn1pDYdR2kW3qDT4JDxFSXaPBsiaVhoFP?amount=0.040004&r=https://test.bitpay.com/i/NcG8qsX1dUgvRgsudbnX48',
        BIP72b: 'bitcoin:?r=https://test.bitpay.com/i/NcG8qsX1dUgvRgsudbnX48',
        BIP73: 'https://test.bitpay.com/i/NcG8qsX1dUgvRgsudbnX48' } },
  token: '9eV9CZmk6mLe9YCDtmv118yVJBBCqXF2c29RWrq3zeikVwa9MaB2iWyRUgsPxw84dd' }
posData:  100
buyeremail:  undefined

*/
	
})

/* end BITPAY */

/* *************************************************************************
WEBRTC STUFF /:models
*************************************************************************** */
var langsam_stop=false;
var inkognito=false;
pub.get('/webrtc/:buser_name', async ctx=>{
let db=ctx.db;

ctx.session.dorthin=ctx.path;
let us=null;
let owner=false;
let s=`select busers.id,busers.name,busers.role,busers.verif,busers.model,busers.items,busers.bstatus,rooms.src
from busers left join rooms on busers.name=rooms.room_name where busers.name=$1`;
let s2=`select busers.id,busers.name,busers.role,busers.verif,busers.model,busers.items,busers.bstatus,busers.buser_d,rooms.src,abuse.* 
from busers left join rooms on busers.name=rooms.room_name left join  abuse on abuse.abus_id=busers.id where busers.name=$1`;
try{
var result=await db.query(s2,[ctx.params.buser_name]);
	//console.log('OHO RESULT: ',result.rows);
if(result.rows.length>0) {
us=result.rows[0];
	//console.log('OHO RESULT ROWS[0]: ',us);
}else{
console.log('no results in result!');
ctx.session.error="No such user."
return ctx.redirect('/error');
}
}catch(e){
console.log('error in webrtc/:buser_name db: ',e)
ctx.session.error=e;
return ctx.redirect('/error');
}
if(ctx.state.user && ctx.state.user.name===ctx.params.buser_name){owner=true;}
ctx.body=await ctx.render('busers',{model: us,owner:owner,shortid:shortid.generate(),inkognito,langsam_stop});
})
pub.post('/api/langsam_stop',admin_auth,async ctx=>{
if(ctx.request.body.stop==true){langsam_stop=true;}else if(ctx.request.body.stop==false){
langsam_stop=false;
}else{}
ctx.body={info:"OK",body:ctx.request.body,stopi:langsam_stop}
})
pub.post('/api/gof',async ctx=>{
let db=ctx.db;
let sis=`select busers.name,busers.role,rooms.src from busers left join rooms on busers.name=rooms.room_name where busers.name='globik'`;
let sis2=`select rooms.src,busers.role from rooms inner join busers on busers.name=rooms.room_name where rooms.room_name='globik'`; 
try{
var result=await db.query(sis);
}catch(e){ctx.throw(404,e);}
ctx.body={result:result.rows}
})

pub.post('/api/set_transfer', auth, async ctx=>{
let db=ctx.db;
let {from,to,amount,type,pid,btype}=ctx.request.body;
var lamount=0;
try{
await db.query('insert into transfer(tfrom,tos,amount,type,pid) values($1,$2,$3,$4,$5)',[from,to,amount,btype,pid]);
lamount=amount;
}catch(e){ctx.throw(400,e.message);}
ctx.body={amount:lamount}
})
pub.get('/fetch_toks/:id', auth, async ctx=>{
	console.log('CTX.PARAMS.ID: ',ctx.params.id)
if(ctx.state.user && ctx.state.user.id !==ctx.params.id){ctx.throw(404,"You are not owner. ID: "+ctx.params.id+" us.id: "+ctx.state.user.id)}
let db=ctx.db;
try{
var r=await db.query('select items from busers where id=$1',[ctx.params.id]);
}catch(e){ctx.throw(404,e)}
ctx.body={info:"OK",items:r.rows[0].items};
})
pub.post('/api/set_seat', async ctx=>{
let db=ctx.db;
const {pid,who,type}=ctx.request.body;
	//console.log(ctx.request.body)
	//let mail=email_enc.decrypt(who)
	//console.log('mail: ',mail)
try{
await db.query('insert into seats(pid,us_name,type) values($1,$2,$3)',[pid,who,type]);
}catch(e){console.log(e);}
ctx.body={info:"OK",body: ctx.request.body}
});

pub.post('/api/send_abuse', async ctx=>{
let db=ctx.db;
	//d.selector=a;d.text=b;d.us_id=c;d.who=e;
let {selector,text,us_id,who}=ctx.request.body;
//(abus_id,ab_slc,ab_cmt)
 //abus_id,ab_type,ab_at,ab_l_mod,ab_cnt,ab_cmt,ab_slc
try{
db.query(`insert into abuse(abus_id,ab_slc,ab_cmt) values($1,$2,$3) on conflict(abus_id) do update set ab_cnt=abuse.ab_cnt+1,
ab_slc=$4,ab_cmt=$5,ab_l_mod=now()`,[us_id,selector,text,selector,text])
}catch(e){
console.log(e)
ctx.throw(404,e.name)
}
ctx.body={body:ctx.request.body,info:'ok,your report is accepted'}
})
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

pub.get('/entry', async ctx=>{
ctx.body=await ctx.render('vk_entry_point',{})	
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
function xhr_auth(ctx,next){
if(ctx.state.xhr){
if(ctx.isAuthenticated()){return next()}else{ctx.throw(401,"Please log in!")}
}else{
if(ctx.isAuthenticated()){return next()}else{ctx.redirect('/login');}
}
}
function admin_auth(ctx,next){
if(ctx.isAuthenticated() && ctx.state.user.role=="superadmin"){return next()}else{ctx.throw(401, "Please log in.")}}
function isNumb(str){var numstr=/^\d+$/;return numstr.test(str);}
