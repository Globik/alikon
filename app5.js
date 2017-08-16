//const CircularJson=require('circular-json');
const mail_enc=require('./libs/email_enc.js');
const EventEmitter=require('events');
const Koa=require('koa')
const passport=require('koa-passport')
const url=require('url')
const koaBody=require('koa-body')
const fs=require('co-fs');
const fss=require('fs');
const debug=require('debug')('k');
const ROOM=100;
const PEER=100;

const redis=require('./examples/redis-promis.js')();
const cl=redis.createClient();

const session=require('koa-generic-session');
const sse=require('sse-broadcast')();
const shortid=require('shortid');
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

const mediasoup = require('mediasoup');
const RTCPeerConnection = mediasoup.webrtc.RTCPeerConnection;
const RTCSessionDescription = mediasoup.webrtc.RTCSessionDescription;
const roomOptions = require('./data/options').roomOptions;
const peerCapabilities = require('./data/options').peerCapabilities;
const boom=new EventEmitter();
const server = mediasoup.Server({logLevel:"debug",
								rtcIP4:true,
								rtcIP6:false,
								rtcAnnouncedIPv4:null,
								rtcAnnouncedIPv6:null,
								rtcMinPort:40000,
								rtcMaxPort:49999,
								dtlsCertificateFile:"data/mycert.pem",
								dtlsPrivateKeyFile:"data/mykey.pem"});
const {msg_handler} = require('./libs/mailer.js');
const {script}=require('./libs/filter_script');
const PgStore=require('./pg-sess.js')
const configDB=require('./config/database.js')
//const database_url=configDB.pg_local_heroku_url; //for a "production" deploying to heroku.com
const database_url=configDB.pg_url;
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
await next();
}
}
app.use(xhr());

function readf(n){
return new Promise((res,rej)=>{
fss.readFile(n,'utf-8',(err,data)=>{
if(err)rej(err)
res(data)
})
})
}
/*
(async()=>{
try{var ww=await readf('app.json');
	console.log('file ww: ',ww)
   }catch(e){console.log(e)}
})()
*/
var lasha=true;
var mobject={};
var locals={
async showmodule(){try{var mn=await readf('app.json');
	return mn;}catch(e){console.log('eeeeri: ',e);return e;}},
async  show_banners(){try{let m=await pool.query('select*from banners');console.log('SHOW BANNERS!!!!!!!');
return m.rows;}catch(e){console.log(e);return e;}},
async show_abuse_nots(){try{let m=await pool.query(`select id from abuse where status='neu'`);
							console.log('MUUUUUU: ',m.rows);
							return m;}catch(e){console.log(e);return e.name;}}
};
app.use(async (ctx, next)=>{
//if(ctx.path==='/log_rooms')return;
ctx.state.filter_script=script;
ctx.db=pool;
ctx.boss=boss;
var sa;
if(lasha){sa=await locals.showmodule();
console.log('SHOW MODULE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
sa=JSON.parse(sa);
mobject.showmodule=sa;
lasha=false;
}

ctx.state.showmodule=mobject.showmodule;
ctx.state.showmodulecache=lasha;
if(ctx.path !=='/log_rooms' && ctx.method !=='POST'){
ctx.state.banner=await locals.show_banners();
console.log('BUT WHY????????????????????: path:',ctx.method,' ',ctx.path,' ',ctx.state.xhr);
	//console.log('HERE CTX>STATE>USER : ',ctx.state.user)
	if(ctx.state.user && ctx.state.user.role==='superadmin'){
ctx.state.abuse_nots=await locals.show_abuse_nots();	
console.log('ABUSE_NOTS!: ',ctx.state.abuse_nots.rowCount,' : ',ctx.state.abuse_nots.rows)
	}
	}
if(ctx.path=='/module_cache'){
lasha=true;}
await next();
});

subrouter.get('/log_rooms', async (ctx,next)=>{
sse.subscribe('ch_log_rooms',ctx.res)
//console.log('header: ',ctx.request)
ctx.response=false;
await next();
})

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
try{
await next();
if(ctx.status === 404) ctx.throw(404,"fuck not found",{user:"fuck userss"});
}catch(err){
ctx.status=err.status || 500;
console.log('THIS>STATUS: ', ctx.status);
if(ctx.status=== 404){
ctx.session.error='';
ctx.redirect('/error');}
//this.body=this.render('error',{message:err.message, error:err.status});
}
});

app.on('error',(err, ctx)=>{
console.log('app.on.error: ',err.message, ctx.request.url);
});

pg_store.on('connect',()=>console.log('PG_STORE IS CONNECTED!!!'));

//var ssl_options={key:fss.readFileSync('server.key'),cert:fss.readFileSync('server.crt')};

var nextId=Date.now();
var Connections = new Array();
var droom=new Map();

pg_store.setup().then(()=>{

pool.query(`delete from rooms`).then(r=>{
console.log('OK, deleteng all rooms!')
}).catch(err=>console.log('Error in deleteng all rooms: ',err))

var servak=app.listen(process.env.PORT || 5000)
	
console.log('is Mediasoup server closed?: ',server.closed)
var wss=new WebSocket.Server({server:servak,/*origin:'http://localhost:5000',*/verifyClient:function(info,cb){
	console.log('info: ',info.origin)
if(info.origin==='http://localhost:5000'){cb(true);return;}
	cb(false)
}});

function croom(mn){
return new Promise(function(res,rej){
server.createRoom(roomOptions)
.then((room) => {
console.log('room.roomId: ',room.id);
//console.log('ROOM: ',room)
droom.set(mn,room);
//room.dump().then(f=>{console.log('room dump: ',f)}).catch(e=>{console.log(e)})
res('ok');
})
.catch((err) => {
console.error('server.createRoom() ERROR', err.name,' : ',err.message);
rej(err);
});})}	
	
function sendtooneuser(bs,target,mstring){
console.log('SEND TO ONE USER to target: ',target)
console.log('is target typeof string ?: ',(typeof target==='string'))
for(let i of wss.clients){
console.log('i.clientId: ',i.clientId)
console.log('is i.clientId typeof string? :',(typeof i.clientId==='string'))
if(i.upgradeReq.url===bs.upgradeReq.url){
	console.log('UPGRADE URL!!!!!!!!!!!!!!!!!!!!!')
if(i && i.readyState===WebSocket.OPEN){
//if(i.username===target){
		console.log('OPENED!!!!!!!!!!!!!!!!!!!!!!!!!!')
if(i.clientId===target){
console.log('i.username: ',i.username);
i.send(mstring);
break;
}
}}
}

}
	
function getconnectionforid( bs, id){
var connect=null;
console.log('FUCK: ',bs.upgradeReq.url);
for(let i of wss.clients){
if(i.upgradeReq.url===bs.upgradeReq.url){	
if(i.clientId===id){
connect=i;
break;
}
}}
return connect;
}
	
function pupkin_ready(bs){
let pupkin=false;
let pidi=0;
for(let i of wss.clients){
if(i.upgradeReq.url===bs.upgradeReq.url){	
if(i.ready===true){
pupkin=true;
pidi=i.pidi;
break;
}
}}
return {pupkin:pupkin,pidi:pidi};	
}	
	
function makeuserlistmessage(bs){
var userlistmsg={type:"userlist", users:[]};
wss.clients.forEach(c=>{
if(c.upgradeReq.url===bs.upgradeReq.url){
if(c && c.readyState===WebSocket.OPEN){
userlistmsg.users.push({username:c.username,owner:c.owner,clientId:c.clientId});
}}
})
return userlistmsg;
}
		
function senduserlisttoall(bs,bool,pidi){
var userlistmsg=makeuserlistmessage(bs);
	userlistmsg.ready=bool;
	userlistmsg.pidi=pidi;
	//userlistmsg.chat=ob;
var userlistmsgstr=JSON.stringify(userlistmsg);
wss.clients.forEach(c=>{
if(c.upgradeReq.url===bs.upgradeReq.url){
if(c && c.readyState===WebSocket.OPEN){
c.send(userlistmsgstr)
}}
});
}
function make_user_message(bs){
let usermsg={type:"joined_user"};
wss.clients.forEach(c=>{
if(c.upgradeReq.url===bs.upgradeReq.url){
if(c && c.readyState===WebSocket.OPEN){
usermsg.username=c.username;
usermsg.clientId=c.clientId;
}}
})
return usermsg;
}
function send_new_user_to_all(bs){
let usermsg=make_user_message(bs);
var usermsgstr=JSON.stringify(usermsg);
wss.clients.forEach(c=>{
if(c.upgradeReq.url===bs.upgradeReq.url){
if(c && c.readyState===WebSocket.OPEN){
c.send(usermsgstr)
}}
});
}	
	
function emergency_to_all(bs,obj){
let b=JSON.stringify(obj);
wss.clients.forEach(c=>{
if(c.upgradeReq.url===bs.upgradeReq.url){
if(c && c.readyState===WebSocket.OPEN){
c.send(b)
}}
});
}	
	function make_channel_online_message(bs){
	let usermsg={type:"roomer_online"};
wss.clients.forEach(c=>{
if(c.upgradeReq.url===bs.upgradeReq.url){
if(c && c.readyState===WebSocket.OPEN){
usermsg.username=c.username;//.push({username:c.username,owner:c.owner,clientId:c.clientId});
usermsg.clientId=c.clientId;
usermsg.roomname=bs.upgradeReq.url.substring(1);
}}
})
return usermsg;
	
	}
	
function send_channel_online(bs){
let usermsg=make_channel_online_message(bs);
var usermsgstr=JSON.stringify(usermsg);
wss.clients.forEach(c=>{
if(c.upgradeReq.url===bs.upgradeReq.url){
if(c && c.readyState===WebSocket.OPEN){
c.send(usermsgstr)
}}
});
}	
	
function heartbeat(){
this.isAlive=true;
//console.log('pong')
}
const interval=setInterval(function ping(){
wss.clients.forEach(function each(ws){
if(ws.isAlive===false)return ws.terminate();
ws.isAlive=false;
ws.ping(JSON.stringify({type:"ping"}),false,true)
})
},6000);

function close_room(ws, name){
console.log('CLOSING THE ROOM!!!: ',name);
let vid=droom.get(name)
if(vid){
vid.on('close', on_close_room)
vid.close();
console.log('ROOM SIZE:',droom.size);
}
function on_close_room(err){
droom.delete(name)
pool.query('delete from rooms where room_name=$1 RETURNING room_name',[name]).then(result=>{
console.log('DELETE RETURNING ID: ',result.rows[0]);
//sse.publish('ch_log_rooms','remove_room', result.rows[0])
sendback(ws,{type:'goodbyeroom',roomname: name});
}).catch(err=>{console.log('err delete room by id: ',err);})
if(err){
console.log('error closing the room: ',err);
sendback(ws,{type:'error',error:e,roomname: name})
}
}
}	
	
let obid=function(){
let tst=(new Date().getTime()/1000 | 0).toString(16);
return tst+'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function(){
return (Math.random()*16 | 0).toString(16);
}).toLowerCase();
}

function update_end(pidi){
pool.query('update seats set vend=now() where pid=$1',[pidi]).then(result=>{
console.log('result ok update seats vend')
}).catch(err=>{console.log('error update seat vend: ',err)})
}

function insert_message(msgi,roomname,nick){
pool.query('insert into chat(msg,chat_name,us_name) values($1,$2,$3)',[msgi,roomname,nick]).then(r=>{
console.log('OK inserting message into chat table ',msgi)
}).catch(e=>{console.log('err in inserting message into chat table: ',e)})
}
	
wss.on('connection', ws=>{
console.log('websocket connected: ', ws.upgradeReq.url);
	//console.log('WS: ',ws.upgradeReq);
	//console.log('headers of ws: ',ws.headers,ws.upgradeReq.headers);
var blin=ws.upgradeReq.url;
var blin2=blin.trim();
var blin3=blin2.substring(1);
ws.isAlive=true;
ws.on('pong', heartbeat);
	

// from command line scrot -d 10 =take a screenshot
	
ws.clientId=shortid.generate();//obid();//nextId;
//nextId++;
var msg={type:"id",id:ws.clientId};
ws.send(JSON.stringify(msg));
	
pool.query('select*from chat where chat_name=$1 limit $2',[blin3,10]).then(r=>{
	console.log('row from chat: ',r.rows)
if(r.rows.length > 0)ws.send(JSON.stringify({type:'history',d:r.rows}))
}).catch(e=>{console.log('err in chat table: ',e)})
	
ws.on('error',e=>console.log('err: ',err))

ws.on('close',()=>{
console.log('websocket closed')
console.log('client closed. id=' + ws.clientId + '  , total clients=' + wss.clients.size);
cleanUpPeer(ws, blin3);

if(ws.owner){
console.log('OWNER!!!!!');
if(ws.pidi && ws.pidi.length>0){
console.log('WS.PIDY!!!!!!!!!: ',ws.pidi);
update_end(ws.pidi);
}
close_room(ws, blin3);
}
})

ws.on('message', message=>{

var sendtoclients=true;
try{
msg=JSON.parse(message)}catch(e){console.log('error json in websocket to parse');}
var connect=getconnectionforid(ws,msg.id);
var sifa=pupkin_ready(ws);


if(msg.type=="message"){
if(connect){
msg.name=connect.username;
}
//msg.text=msg.text;
}else if(msg.type=="username"){
connect.username=msg.name;
connect.owner=msg.owner;
connect.ready=false;

senduserlisttoall(ws,sifa.pupkin,sifa.pidi);
send_new_user_to_all(ws);
	
sendtoclients=false;
}else if(msg.type=="createroom"){
console.log('CREATING ROOM');
if(!server.closed){
	console.log('MSG.OWNER: ',msg.owner)
if(msg.owner){
if(droom.size > ROOM) return;
console.log('owner is true');
if(droom.has(msg.roomname)){
console.log('Schoo gibts this room by name: ',msg.roomname)
console.log(' ...skiping');
}else{
console.log('creating a room for id=', ws.clientId);
	
croom(msg.roomname).then((da)=>{
console.log('da: ',da);
ws.roomid=msg.roomname;

pool.query('insert into rooms(room_name) values($1) returning status,view,room_name,src',[msg.roomname]).then(result=>{
console.log('result insert rooms: ',result.rowCount);

sendback(ws,{roomname:msg.roomname,type:'onroom'})
	
//sse.publish('ch_log_rooms','add_room', result.rows[0])
}).catch(err=>{console.log('err insert rooms: ',err)})



}).catch(e=>{
console.log('error room creating: ',e);
if(ws.readyState===1)ws.send(JSON.stringify({type:"error", ename:e.name,emsg:e.message}))
delete ws.roomid;
})	
}	
}
}else{
console.log('server is closed!!!!')
if(ws.readyState===1)ws.send(JSON.stringify({type:"error",ename:"Mediasoup is closed!",emsg:"Are you online?"}))
}
sendtoclients=false;
}else if(msg.type=="online"){
// iceConnectionState=='completed' or 'connected'
debug('ONLINE roomer_online event:',msg);
ws.ready=true;
ws.pidi=msg.pidi;
let sis1='update rooms set src=$1 where room_name=$2 returning status,view,room_name,src';
pool.query(sis1,[msg.src,msg.roomname]).then(res=>{
emergency_to_all(ws,{type:'roomer_online',ready:true,pidi:msg.pidi,src:res.rows[0].src,chataccess:msg.chataccess});
	sse.publish('ch_log_rooms','add_room', res.rows[0])
	//status,view,room_name,src
}).catch(er=>{console.log(er);
emergency_to_all(ws,{type:'roomer_online',ready:true,pidi:msg.pidi,src:undefined})			 
})
sendtoclients=false;
}else if(msg.type=="offline"){
ws.ready=false;
console.log('PIDI: ', msg.pidi)
let sis2="update rooms set src=$1 where room_name=$2 returning room_name";
pool.query(sis2,['',msg.roomname]).then(res=>{
update_end(msg.pidi)
emergency_to_all(ws,{type:'roomer_offline',ready:false,pidi:0})
sse.publish('ch_log_rooms','remove_room', {room_name:msg.roomname})
}).catch(e=>{console.log(e)})
sendtoclients=false;
}else if(msg.type=="token"){
console.log('TOKEN OCCURED: ',msg);

pool.query('insert into transfer(tfrom,tos,amount,type,pid) values($1,$2,$3,$4,$5)',[msg.from,msg.to,msg.amount,msg.btype,msg.pid]).then(res=>{
console.log('INSERTING A TOKEN: ',res);
emergency_to_all(ws,{type:'token_antwort',from:msg.from,to:msg.to,amount:msg.amount,btype:msg.btype,pid:msg.pid,user_nick:msg.from_nick});
sendback(ws,{type:"success_token_transfer",from:msg.from,to:msg.to,amount:msg.amount,btype:msg.btype,pid:msg.pid})
insert_message(msg.msg,msg.roomname,msg.from_nick)
}).catch(e=>{
console.log('error insert token: ',e.message);
sendback(ws,{type:'error',mess:e.message})
})

sendtoclients=false;
}else if(msg.type=="call"){
console.log('got call from id=' + ws.clientId);
const downOnlyRequested=false;

preparePeer(ws, msg, downOnlyRequested);
sendtoclients=false;
}else if(msg.type=="call_downstream"){
const downOnlyRequested=true;
preparePeer(ws, msg,downOnlyRequested);
sendtoclients=false;
}else if(msg.type=="offer"){
console.log('got Offer from id=');
console.log('must not got offer.');
}else if(msg.type=="answer"){
console.log('got Answer from id=' + ws.clientId);
	console.log('!!!MSG: !!!!',msg)
handleAnswer(ws, msg);
}else if(msg.type=="bye"){
//dissconnect button
debug('TYPE "BYE" came. Clearing peerconnection!')
cleanUpPeer(ws, msg.roomname);
sendtoclients=false;
}else if(msg.type=="candidate"){
console.log('MUST NOT got candidate');
}else if(msg.type=="removeroom"){
if(msg.owner){
// pauseVideo 'stop video' button
console.log('closing a room: ',msg.roomname);
close_room(ws, msg.roomname)
}
sendtoclients=false;
}else{console.log('unknown type: ',msg.type);sendtoclients=true;}

	
if(sendtoclients){
var msgstring=JSON.stringify(msg);
if(msg.target && msg.target !==undefined && msg.target.length !==0){
sendtooneuser(ws,msg.target, msgstring);
}else{
if(msg.type=='message'){insert_message(msg.msg,msg.roomname,msg.from_nick)}
emergency_to_all(ws,msg)
/*
wss.clients.forEach(c=>{
if(c.upgradeReq.url===ws.upgradeReq.url){
if(c && c.readyState===WebSocket.OPEN){c.send(msgstring)}
}
})
*/


}
}
})
})
	/*
https.createServer(ssl_options,app.callback()).listen(process.env.PORT || 5000, (err) => {
//if (err) { throw new Error(err);}
console.log('Listening on https//localhost: 5000');
});
	*/
});
console.log('soll on port 5000');

/* MEDIASOUP */

function sendback(ws, message) {
let str = JSON.stringify(message);
if(ws.readyState===1)ws.send(str);
}

function preparePeer(ws, message, downOnly){
const id=ws.clientId;
console.log('ID: ',id.toString())
const planb=message.planb;
const capabilitySDP=message.capability;
console.log('MESSAGE.ROOMNAME: ',message.roomname);
let vid=droom.get(message.roomname);
if(vid){
if(vid.peers.length > PEER){console.log('peers great than ',PEER,' Skip creating a peer...');return;}
let peer=vid.Peer(id.toString());
let peerconnection=new RTCPeerConnection({peer:peer,usePlanB:planb});
console.log('--- create rtcpeerconnection --');
let peerlength=vid.peers.length;
console.log('-- peers in the room from PREPAREPEER = ',peerlength);
update_view(peerlength,message.roomname)



peerconnection.on('close', err=>{
console.log('peerconnection closed ');
debug('PEER_CONNECTION CLOSED');
debug('PC closed for room message.roomname', message.roomname)
debug('PC closed for ws id: ',ws.clientId);
let vidi=droom.get(message.roomname);
if(vidi){
let peerlength=vidi.peers.length;
update_view(peerlength,message.roomname);
}
	
if(err)console.log(err);
});
peerconnection.on('signalingstatechange',()=>console.log('state ',peerconnection.signalingState));
peerconnection.on('negotiationneeded',()=>{
console.log('negotiationneeded id: ', id);
sendOffer(ws,peerconnection,downOnly)})
peerconnection.setCapabilities(capabilitySDP).then(()=>{
console.log('peer.setcapabilities() ok');
addPeerConnection(id,peerconnection);
sendOffer(ws,peerconnection);
}).catch(err=>{
console.log('peer.setcapabilities() err: ',err);
peerconnection.close();
})
}else{sendback(ws,{type:"error",ename:"No room found by name: "+message.roomname,num:"101"})}
}

function sendOffer(ws,peerconnection,downOnly){
const id=ws.clientId;
console.log('send offer to id= ',id);
let offerOption={offerToReceiveAudio:1,offerToReceiveVideo:1};
if(downOnly){
offerOption.offerToReceiveAudio=0;
offerOption.offerToReceiveVideo=0;
}
peerconnection.createOffer(offerOption).then(desc=>{
return peerconnection.setLocalDescription(desc)}).then(()=>{
dumpPeer(peerconnection.peer,'peer.dump after createoffer')
sendSDP(ws,peerconnection.localDescription)
}).catch(err=>{
console.log('error handling sdp offer to participant: ',err)
peerconnection.reset()
peerconnection.close()
deletePeerConnection(id);
})
}

function handleAnswer(ws, message) {
const id = ws.clientId;
let peerconnection = getPeerConnection(id);
if (! peerconnection) {
console.warn('WARN: connection not found. id=', id);
return;
}

let desc = new RTCSessionDescription({type : "answer", sdp  : message.sdp});
  
peerconnection.setRemoteDescription(desc).then( function() {
console.log('setRemoteDescription for Answer OK id=' + id);
console.log('MESSAGE.ROOMNAME from handle answer: ',message.roomname)
let vid=droom.get(message.roomname);
if(vid){
let peerlength=vid.peers.length;
console.log('-- PEERS in the room FROM handleAnswer = ', peerlength);
update_view(peerlength,message.roomname)
}
dumpPeer(peerconnection.peer, 'peer.dump after setRemoteDescription(re-answer):');
}).catch( (err) => {
console.log('setRemoteDescription for Answer ERROR:', err)
});
}

function update_view(peerlength,roomname){
pool.query('update rooms set view=$1 where room_name=$2',[peerlength,roomname]).then(r=>{
console.log('ok update rooms view handleanswer')
sse.publish('ch_log_rooms','room_view', {peers:peerlength,room_name:roomname})
}).catch(err=>{console.log('err update rooms view handleanswer: ',err)})
}

function dumpPeer(peer, caption) {
console.log(caption + ' transports=%d receivers=%d senders=%d',
peer.transports.length, peer.rtpReceivers.length, peer.rtpSenders.length
  );
}


function addPeerConnection(id, pc) {
/* try{let b=CircularJson.stringify(pc);console.log('B: ',b);
		console.log('pc: ',pc);
		let a=CircularJson.parse(b);
		console.log('a: ',a);
		cl.set('pc',b,(er,r)=>{
	   console.log('result of redis: ',r);
		   if(er)console.log('redis error: ',er)
	   })
	   }catch(e){console.log('error: ',e)}
*/
Connections[id] = pc;
}

function getPeerConnection(id) {
const pc = Connections[id];
//console.log('pc: ',pc)
return pc
}

function deletePeerConnection(id) {
delete Connections[id];  
}

function cleanUpPeer(ws,name) {
const id = ws.clientId;
let peerconnection = getPeerConnection(id);
if (! peerconnection) {
console.warn('WARN: cleanUpPeer(id) , connection not found. id=', id);
return;
}
console.log('PeerConnection close. id=' + id);
peerconnection.close();
deletePeerConnection(id);
console.log('NAME in Clean UP Peer: ',name);
if(droom.get(name)){ 
console.log('-- peers in the room  from CLEENUPEER= ' + droom.get(name).peers.length);
}}

function sendSDP(ws, sessionDescription) {
const id = ws.clientId;
let message = { sendto: id, type: sessionDescription.type, sdp: sessionDescription.sdp };
console.log('--- sending sdp ---');
console.log('sendto:' + message.sendto + '   type:' + message.type);
sendback(ws, message);
}


/* END OF MEDIASOUP */
pool.on('connect', client=>{setImmediate(()=>{console.log('pool connected')})});
pool.on('error', (err, client)=>{setImmediate(()=>{console.log('error in pool: ', err.message)})});
pool.on('acquire', client=>{setImmediate(()=>{console.log('pool acquired ')})})
/*var dop_ssl='';
if(process.env.DEVELOPMENT ==="yes"){
	//dop_ssl="?ssl=true";
	dop_ssl="";
}else{dop_ssl="?ssl=true"}
*/
var ps=new PS(database_url+dop_ssl);

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
await pool.query(`update busers set w_items=${items} where email='${mail}'`);
}catch(e){console.log('err in evs bitpay status paid: ', e);}
})()
}else if(bp_msg.data.infbp.status==="complete"){
(async()=>{
try{
await pool.query(`update busers set items=items+${items}, w_items=w_items-${items} where email='${mail}'`);
}catch(e){console.log('err in evs bitpay status complete: ', e);}
})()
}else if(bp_msg.data.infbp.status==="invalid"){
(async()=>{
try{
await pool.query(`update busers set w_items=w_items-${items} where email='${mail}'`);
}catch(e){console.log('err in ev bitpay status invalid: ',e);}
})()
}else{}
})
//--trace-warnings

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
	//var database_url='postgres://globik:null@localhost:5432/postgres';	