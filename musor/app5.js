//localhost:5001
//const CircularJson=require('circular-json');
//var jsi=require('node-stringify');
//var estr="http://example.com/name/big-name/little_name";
//var estr2=encodeURIComponent(estr);
//console.log('estr2: ',estr2);
const mail_enc=require('./libs/email_enc.js');
const EventEmitter=require('events');
const Koa=require('koa')
const passport=require('koa-passport')
const url=require('url')
const koaBody=require('koa-body')
//const fs=require('fs');

const debug=require('debug')('k');
const {websock}=require('./libs/websock.js')

var broom=0;
var bpeer=0;
//const redis=require('./examples/redis-promis.js')();
//onst cl=redis.createClient();
const uap=require("uaparser-js");
const session=require('koa-generic-session');
const sse=require('sse-broadcast')();
const shortid=require('shortid');
//const enforceHttps=require('koa-sslify');
//const render=require('./libs/render.js')
const render=require('koa-rend');
const serve=require('koa-static');
const PS=require('./libs/pg-subpub.js');
const Pool=require('pg-pool')
const PgBoss=require('pg-boss');
const pubrouter=require('./routes/pubrouter2.js');
const adminrouter=require('./routes/admin.js');
const Router=require('koa-router');

const WebSocket=require('ws');
const email_enc=require('./libs/email_enc.js');
const HPORT=5001;
const mediasoup = require('mediasoup');
const RTCPeerConnection = mediasoup.webrtc.RTCPeerConnection;
const RTCSessionDescription = mediasoup.webrtc.RTCSessionDescription;
const roomOptions = require('./data/options').roomOptions;
const peerCapabilities = require('./data/options').peerCapabilities;
const boom=new EventEmitter();
const server = mediasoup.Server({
	                            logLevel:"debug",
								rtcIP4:true,
								rtcIP6:false,
								rtcAnnouncedIPv4:null,
								rtcAnnouncedIPv6:null,
								rtcMinPort:40000,
								rtcMaxPort:49999,
								dtlsCertificateFile:"data/mycert.pem",
								dtlsPrivateKeyFile:"data/mykey.pem"});

const {readf}=require('./libs/await-fs.js');

const {msg_handler} = require('./libs/mailer.js');
const {script}=require('./libs/filter_script');
const PgStore=require('./pg-sess.js')
const configDB=require('./config/database.js')
const conf_pay=require('./config/pay.json')
const mainmenu=require('./app.json')

const database_url=configDB.pg_local_heroku_url; //for a "production" deploying to heroku.com
//const database_url=configDB.pg_url;
var dop_ssl='';
if(process.env.DEVELOPMENT ==="yes"){
	//dop_ssl="?ssl=true";
	dop_ssl="";
}else{dop_ssl="?ssl=true"}

const pgtypes=require('pg').types;
const pgn=require('pg').native.Client;

pgtypes.setTypeParser(1114, str=>str);
const boss=new PgBoss(database_url+dop_ssl);

const app = new Koa();
const pars=url.parse(database_url)
console.log('pars: ', database_url);
const cauth=pars.auth.split(':')

const pconfig={
user:cauth[0],
password:cauth[1],
host:pars.hostname,
port:pars.port,
database:pars.pathname.split('/')[1],
ssl:false,
Client:pgn
}

const pool=new Pool(pconfig)
const pg_store=new PgStore(pool)
const subrouter=new Router();

app.keys=['your-secret']
app.use(serve(__dirname+'/public'));

app.use(session({store:pg_store}))

render(app,{root:'views', development: configDB.deva})

app.use(koaBody())
require('./config/auth2.js')(pool,passport)

app.use(passport.initialize())
app.use(passport.session())

function xhr(){
return async function xhr(ctx,next){
ctx.state.xhr=(ctx.request.get('X-Requested-With')==='XMLHttpRequest')
await next()
}
}
app.use(xhr())
var payflag=true;
var cachePay={};
var locals={
async  show_banners(){try{let m=await pool.query('select*from banners');console.log('SHOW BANNERS!!!!!!!');
return m.rows;}catch(e){console.log(e);return e;}},
async show_abuse_nots(){try{let m=await pool.query(`select abus_id from abuse where ab_type='neu'`);
							console.log('MUUUUUU: ',m.rows);
							return m;}catch(e){console.log(e);return e.name;}},
async get_pay_sys(){try{let d=await readf(`./config/${conf_pay.config}.json`,'utf8');return JSON.parse(d);}catch(e){throw e}}
};
const parser=uap();
app.use(async (ctx, next)=>{
//if(ctx.path=='/favicon.ico'){console.log('**skiping favicon.ico');return;}
console.log('PATH: ',ctx.method,ctx.path,ctx.url)
//console.log('request: ',ctx.request.header["user-agent"])
if(ctx.request.header["user-agent"]){
ctx.session.ua=ctx.request.header["user-agent"];
}
ctx.state.filter_script=script;
ctx.db=pool;
ctx.boss=boss;
ctx.tok_pack=conf_pay;
ctx.state.showmodule=mainmenu;
ctx.state.showmodulecache='lasha';
ctx.state.bitaps_href=conf_pay.bitaps_href;
if(payflag){
try{
let a=await locals.get_pay_sys()
cachePay=a;
payflag=false;
}catch(e){console.log('err in payflag',e)}
}
let pk=parser.parse(ctx.request.header["user-agent"]);
	console.log("UA_PARSER: ",pk.toString());
ctx.payment=cachePay;
if(ctx.path !=='/log_rooms' && ctx.method !=='POST'){
ctx.state.banner=await locals.show_banners()
console.log('path:',ctx.method,' ',ctx.path,' ',ctx.state.xhr)
if(ctx.state.user && ctx.state.user.role==='superadmin'){
ctx.state.abuse_nots=await locals.show_abuse_nots();	
console.log('ABUSE_NOTS!: ',ctx.state.abuse_nots.rowCount,' : ',ctx.state.abuse_nots.rows)
	}
	}
if(ctx.path=='/admin/uncache_what'){
if(ctx.state.user && ctx.state.user.role==='superadmin'){
let {type="no"}=ctx.request.body;
if(type=="pay_sys_reload"){
payflag=true;
}
}
}
await next();
})

function heartbeat_sse(){
setInterval(function(){
sse.publish('ch_log_rooms',{data:"heart"});
},10000)
}
subrouter.get('/log_rooms', async (ctx,next)=>{
sse.subscribe('ch_log_rooms',ctx.res)
//console.log('header: ',ctx.request)
ctx.response=false;
await next();
})

sse.on('subscribe',(room,res)=>{
console.log('SSE Room subscribe: ',room)
//console.log('res subscribe: ',res)
})
sse.on('unsubscribe',(room,res)=>{
console.log('SSE Room unsubscribe: ',room)
//console.log('res unsubscribe: ',res)
})
sse.on('finish',()=>{
console.log('SSE finish')
})
sse.on('error',()=>{console.log('sse error')})
sse.on('warnig',()=>{console.log('sse warnig')})

app.use(subrouter.routes()).use(subrouter.allowedMethods())
app.use(pubrouter.routes()).use(pubrouter.allowedMethods())
app.use(adminrouter.routes()).use(adminrouter.allowedMethods());
/*app.use(async (ctx, next) => {
  try {
    await next(); // next is now a function
  } catch (err) {
    ctx.body = { message: err.message };
    ctx.status = err.status || 500;
  }
});*/
app.use(async (ctx, next)=>{
	console.log('ctx.status: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',ctx.status);
try{
await next();
if(ctx.status === 404) ctx.throw(404,"fuck not found",{user:"fuck userss"});
}catch(err){
ctx.status=err.status || 500;
console.log('THIS>STATUS: ', ctx.status);
if(ctx.status=== 404){
ctx.session.error='';
ctx.redirect('/error');}
}
});

app.on('error',(err, ctx)=>{
	console.log(ctx.session);
	console.log(ctx.request.session);
console.log('app.on.error: ',err.message, ctx.request);
console.log("SESSION in app on error: ");
console.log("sess: ", ctx.request.session);
});

pg_store.on('connect',()=>console.log('PG_STORE IS CONNECTED!!!'));

//var ssl_options={key:fss.readFileSync('server.key'),cert:fss.readFileSync('server.crt')};
//var nextId=Date.now();

pg_store.setup().then(()=>{

pool.query(`delete from rooms`).then(r=>{
console.log('OK, deleteng all rooms!')
}).catch(err=>console.log('Error in deleteng all rooms: ',err))

const servak=app.listen(process.env.PORT || HPORT)
heartbeat_sse();	
console.log('is Mediasoup server closed?: ',server.closed)
const wss=new WebSocket.Server({server:servak/*,verifyClient:(info,cb)=>{
	console.log('info: ',info.origin)
if(info.origin==='http://localhost:5000'){cb(true);return;}
cb(false)}*/
})
//RTCPeerConnection,RTCSessionDescription,roomOptions,peerCapabilities

websock(wss,pool,sse,shortid,server,RTCPeerConnection,RTCSessionDescription,peerCapabilities,roomOptions)
/*
update busers set buser_d=jsonb_set(buser_d,'{"ban_id"}','100') where name='globik';

update busers set buser_d=jsonb_set(buser_d,'{"ban_id"}',to_jsonb('mama'::text)) where name='globik';

update busers set buser_d=jsonb_set(buser_d,'{"ban_id"}',to_jsonb(1::int)) where name='globik';
*/
/*
let obid=function(){
let tst=(new Date().getTime()/1000 | 0).toString(16);
return tst+'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function(){
return (Math.random()*16 | 0).toString(16);
}).toLowerCase();
}
*/
// from command line scrot -d 10 =take a screenshot
	

	/*
https.createServer(ssl_options,app.callback()).listen(process.env.PORT || 5000, (err) => {
//if (err) { throw new Error(err);}
console.log('Listening on https//localhost: 5000');
});
	*/
console.log('Should on port=> localhost:' ,HPORT);
})
pool.on('connect', client=>{setImmediate(()=>{console.log('pool connected')})});
pool.on('error', (err, client)=>{setImmediate(()=>{console.log('error in pool: ', err.message)})})
pool.on('acquire', client=>{setImmediate(()=>{console.log('pool acquired ')})})

const ps=new PS(database_url+dop_ssl);

ps.addChannel('validate', msg_handler);
ps.addChannel('reset', msg_handler);

ps.addChannel('events_bitpay', bp_msg=>{
	console.log('bpmsg: ', bp_msg);
	console.log('status: ',bp_msg.data.infbp.status);
//var mail=JSON.parse(bp_msg.data.infbp.buyerFields).buyerEmail;
var mail=bp_msg.data.infbp.buyerFields.buyerEmail;
	console.log('mail: ',bp_msg.data.infbp.buyerFields.buyerEmail);
var items=JSON.parse(bp_msg.data.infbp.posData).items;
if(bp_msg.data.infbp.status==="paid"){
(async()=>{
try{
//console.log('Durak: ',JSON.parse(bp_msg.data.infbp.buyerFields).buyerEmail);
	//console.log('email: ',bp_msg.data.infbp.buyerFields.buyerEamil);
//console.log('items: ',JSON.parse(bp_msg.data.infbp.posData).items);
//await pool.query(`update busers set w_items=${items} where email='${mail}'`);
}catch(e){console.log('err in evs bitpay status paid: ', e);}
})()
}else if(bp_msg.data.infbp.status==="complete"){
(async()=>{
try{
await pool.query(`update busers set items=items+${items} where email='${mail}'`);
}catch(e){console.log('err in evs bitpay status complete: ', e);}
})()
}else if(bp_msg.data.infbp.status==="invalid"){
(async()=>{
try{
//await pool.query(`update busers set w_items=w_items-${items} where email='${mail}'`);
}catch(e){console.log('err in ev bitpay status invalid: ',e);}
})()
}else{}
})
// bitaps_ok
ps.addChannel('bitaps_ok', bitaps_msg=>{
console.log('Bitaps_Msg: ',bitaps_msg)
sse.publish('ch_log_rooms','bitaps_cb', bitaps_msg)
/*{ us_id: '58a1a78a406da007a696e917',
  items: 100,
  inv_id: 'invNoStCHMT7SwUESos6oW9UhnFCQjJ6E6LwXWDCLBB5RYtMGpJYm',
  bcamt: 4000000,
  type: 'paid' }
  */
})

boss.start().then(ready).catch(err=>console.log(err));

function ready(){
boss.subscribe('banner_enable', (job,done)=>{
console.log(job.name,job.id,job.data);
(async()=>{
try{
await pool.query(`insert into ban_act(ban_id,href,src,title,type) values('${job.data.ban_id}',
'${job.data.href}','${job.data.src}','${job.data.title}','${job.data.type}')`);
}catch(e){console.log(e)}
})()
done().then(()=>console.log('confirmed done'))
})

boss.subscribe('banner_disable', (job,done)=>{
console.log(job.name,job.id,job.data);
(async()=>{
try{
await pool.query(`delete from ban_act where ban_id='${job.data.ban_id}'`);
}catch(e){console.log(e)}
})()
done().then(()=>console.log('confirmed done'))
})
//dummy bitpay webhooks
boss.subscribe('bitpay_paid', (job,done)=>{
console.log(job.name,job.id,job.data);
(async()=>{
try{
await pool.query(`insert into bitpayers(infbp) values('${JSON.stringify(job.data.message)}') 
on conflict((infbp->>'id'::text)) do update set infbp=jsonb_set(bitpayers.infbp,'{status}','"${job.data.message.status}"') 
where bitpayers.infbp->>'status' not like '%complete%'`);
}catch(e){console.log(e)}
})()
done().then(()=>console.log('confirmed done'))
})

boss.subscribe('bitpay_complete', (job,done)=>{
console.log(job.name,job.id,job.data);
(async()=>{
try{
await pool.query(`insert into bitpayers(infbp) values('${JSON.stringify(job.data.message)}') 
on conflict((infbp->>'id'::text)) do update set infbp=jsonb_set(bitpayers.infbp,'{status}','"${job.data.message.status}"') 
where bitpayers.infbp->>'status' not like '%complete%'`);
}catch(e){console.log(e)}
})()
done().then(()=>console.log('confirmed done'))
})
}	

server.on('newroom',(r)=>{
//console.log('new room: ', r.id);
	broom++;
});
server.on('close',(er)=>{
console.log('closing the mediasoup server');
	
pool.query(`delete from rooms`).then(result=>{
console.log('result delete rooms ON_CLOSE mediasoup: OK')
}).catch(err=>{console.log('err delete rooms: ',err)}) 
if(er){console.log(er);}
})

process.on('SIGINT',()=>{
console.log(' sigint fired');
server.close();
process.exit();
})

process.on('unhundledRejection',(reason, p)=>{
console.log('Unhandled Rejection at: Promise', p, 'reason: ', reason);
});	
