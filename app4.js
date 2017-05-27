'use strict';
const EventEmitter=require('events');
const koa=require('koa');
const http=require('http');
//const https=require('https');
const co=require('co');
const render=require('./libs/render.js');
const path=require('path');
const url=require('url');
const Pool=require('pg-pool');
const serve=require('koa-static');
//var flash=require('koa-flash');
//r PS=require('pg-pubsub');
//var favicon=require('koa-favicon');
const PS=require('./libs/pg-subpub.js');
const bodyParser=require('koa-body');
const session=require('koa-generic-session');
//var PgStore=require('koa-pg-session');
const PgStore=require('./pg-sess.js');
const passport=require('koa-passport');
const fs=require('co-fs');
const fss=require('fs');
const PgBoss=require('pg-boss');
const pubrouter=require('./routes/pubrouter2.js');
const adminrouter=require('./routes/admin.js');
//var IO=require('koa-socket');
const WebSocket=require('ws');
/** *** */
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
								rtcMaxPort:49999});
/* **************** */
const configDB=require('./config/database.js');
const {msg_handler} = require('./libs/mailer.js');
var {script}=require('./libs/filter_script');
/*

var locals={
* showmodule(){try{var mn=yield fs.readFile('app.json','utf-8');
	return mn;}catch(e){console.log(e);return e;}},
* show_banners(){try{let m=yield this.db.query('select*from banners');return m.rows;}catch(e){console.log(e);return e;}}
};

*/
var database_url=configDB.pg_local_heroku_url; //for a "production" deploying to heroku.com
//const database_url=configDB.pg_url;// for home development nnn

var dop_ssl='';
if(process.env.DEVELOPMENT ==="yes"){
	//dop_ssl="?ssl=true";
	dop_ssl="";
}else{dop_ssl="?ssl=true"}
const pgtypes=require('pg').types;
pgtypes.setTypeParser(1114, str=>str);
var boss=new PgBoss(database_url+dop_ssl);

console.log('database_url: ',database_url);

var pars=url.parse(database_url);
var cauth=pars.auth.split(':');
console.log('user auth[0] ', cauth[0]);
console.log('pwd auth[1] ', cauth[1]);
console.log('host: ',pars.hostname);
console.log('port: ',pars.port);
console.log('db name: ',pars.pathname.split('/')[1]);
console.log('me');
var pconfig={
user:cauth[0],
password:cauth[1],
host:pars.hostname,
port:pars.port,
database: pars.pathname.split('/')[1],
ssl:true};//local_host=false heroku=true nn


//var ggggkoaws=require('koa-ws');
var app=koa();
//var io=new IO();
//io.attach(app);

//io.on('message',()=>{})

var pool=module.exports=new Pool(pconfig);

require('./config/passport2.js')(pool, passport);

var pg_store=new PgStore(pool);
//var pg_store=new PgStore(database_url);

var locals={
* showmodule(){try{var mn=yield fs.readFile('app.json','utf-8');
	return mn;}catch(e){console.log(e);return e;}},
* show_banners(){try{let m=yield pool.query('select*from banners');return m.rows;}catch(e){console.log(e);return e;}}
};

render(app,{})
app.use(serve(__dirname+'/public'));
//app.use(favicon());



app.keys=['fg'];
app.use(session({store:pg_store}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(flash());
var lasha=true;
app.use(bodyParser());

var wops={
	serveClientFile:true,
	clientFilePath:'/koaws.js',
heartbeat:true,
hearbeatInterval:5000
}



app.use(function*(next){
if(this.method ==='POST'){
//this.flash={error:'flash err'};
}else if(this.method==='GET'){
//this.flash.woane=this.path;
	//this.session.dorthin=this.path;
	console.log('this.session.dorthin: ',this.session.dorthin);
}
yield next;});
var mobject={};
app.use(function*(next){
this.state.filter_script=script;
	this.db=pool;
	this.boss=boss;
var sa;
if(lasha){sa=yield locals.showmodule();
sa=JSON.parse(sa);
mobject.showmodule=sa;
lasha=false;
}

this.state.showmodule=mobject.showmodule;
this.state.showmodulecache=lasha;
this.state.banner=yield locals.show_banners();
if(this.path=='/module_cache'){
lasha=true;}
yield next;
});
app.use(pubrouter.routes())

//  \i /home/globik/alikon/sql/del.sql
app.use(adminrouter.routes());


app.use(function*(next){
	try{
		
		yield next;
	console.log('THIS.STATUS!!!!: ', this.status);
		if(this.status === 404) this.throw(404,"fuck not found",{user:"fuck userss"});
	}catch(err){
	this.status=err.status || 500;
		console.log('THIS>STATUS: ',this.status);
		if(this.status=== 404){
			this.session.error='';
			this.redirect('/error');}
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
	//console.log('soll listnening port 5000 via setup()');
var servak=app.listen(process.env.PORT || 5000)
	//var server=http.createServer(app.callback());
	//server.listen(process.env.PORT || 5000,err=>{
	//if(err)console.log(err)
	//console.log('listen on port 5000');
	//});
var wss=new WebSocket.Server({server:servak});
/*
var nextId=Date.now();
var Connections = new Array();
var droom=new Map();
*/	
function croom(mn){
return new Promise(function(res,rej){
server.createRoom(roomOptions)
.then((room) => {
console.log('room.roomId: ',room.id);
droom.set(mn,room);
console.log('server.createRoom() succeeded');
//room.dump().then(f=>{console.log('room dump: ',f)}).catch(e=>{console.log(e)})
boom.emit('genauroom',{roomid:room.id,roomname:mn,type:'genaurum'});
res('ok');
})
.catch((err) => {
console.error('server.createRoom() ERROR', err.name,' : ',err.message);
rej(err);
});})}	
	
	
function sendtooneuser(bs,target,mstring){
var bi=0;
for(let i of wss.clients){
bi++;
if(i.upgradeReq.url===bs.upgradeReq.url){
if(i && i.readyState===WebSocket.OPEN){
if(i.username===target){
console.log('i.username: ',i.username);
i.send(mstring);
break;
}
}}
}
console.log('bi: ',bi)
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
	
function makeuserlistmessage(bs){
var userlistmsg={type:"userlist", users:[]};
wss.clients.forEach(c=>{
if(c.upgradeReq.url===bs.upgradeReq.url){
if(c && c.readyState===WebSocket.OPEN){
userlistmsg.users.push({username:c.username,owner:c.owner});
}}
})
return userlistmsg;
}
		
function senduserlisttoall(bs){
var userlistmsg=makeuserlistmessage(bs);
var userlistmsgstr=JSON.stringify(userlistmsg);
wss.clients.forEach(c=>{
if(c.upgradeReq.url===bs.upgradeReq.url){
if(c && c.readyState===WebSocket.OPEN){
c.send(userlistmsgstr)
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
	
wss.on('connection', ws=>{
console.log('websocket connected: ', ws.upgradeReq.url);
ws.isAlive=true;
ws.on('pong',heartbeat);
	
function oncreateroom(dob){
console.log('DOB: ',dob);
console.log('FUCK FUCK FUCK');
console.log('CLIENT SEND1 to:', ws.clientId);
dob.type="roomcreated";
dob.toclient=ws.clientId;
if(ws.readyState===1)ws.send(JSON.stringify(dob));
}
	
function ongenauroom(bob){
console.log('BOB: ',bob);
console.log('wss.clients: ',wss.clients.size);
bob.toclient=ws.clientId;
if(ws.readyState===1)ws.send(JSON.stringify(bob));
}
	
function onroomremove(dib){
console.log('onroomremove: ',dib);
dib.toclient=ws.clientId;
if(ws.readyState==1)ws.send(JSON.stringify(dib))
}
	
boom.on('fuck', oncreateroom)
boom.on('genauroom', ongenauroom)
boom.on('roomremove', onroomremove)

ws.clientId=nextId;
nextId++;
var msg={type:"id",id:ws.clientId};
ws.send(JSON.stringify(msg));
ws.on('error',e=>console.log('err: ',err))
ws.on('close',()=>{
console.log('websocket closed')
console.log('client closed. id=' + ws.clientId + '  , total clients=' + wss.clients.size);
cleanUpPeer(ws);

boom.removeListener('genauroom', ongenauroom);
boom.removeListener('fuck', oncreateroom);
boom.removeListener('roomremove', onroomremove);

if(ws.owner){
console.log('OWNER!!!!!');
var wes=droom.get(ws.owner);
if(wes){
console.log('WES!!!!!for a room named: ',ws.owner)
droom.get(ws.owner).on('close',e=>{
droom.delete(ws.owner);
console.log('ROOM CLOSED');
console.log('ROOM SIZE:',droom.size);
if(e){
console.log('error closing the room: ',e);
}
})
droom.get(ws.owner).close();
}				  
}
				  
})

ws.on('message', message=>{
//console.log('wss.clients.length: ',ws.clients.size());
console.log('Message: ', message);
var sendtoclients=true;
try{
msg=JSON.parse(message)}catch(e){console.log('error json to parse');}
var connect=getconnectionforid(ws,msg.id);
//console.log('connect: ',connect);
/*	
switch(msg.type){
case "message":
if(connect){msg.name=connect.username;}
msg.text=msg.text;
break;
case "username":
connect.username=msg.name;
connect.owner=msg.owner;
senduserlisttoall(ws);
sendtoclients=false;
break;
}
*/
if(msg.type=="message"){
if(connect){
msg.name=connect.username;
}
msg.text=msg.text;
}else if(msg.type=="username"){
connect.username=msg.name;
connect.owner=msg.owner;
senduserlisttoall(ws);
	
sendtoclients=false;
}else if(msg.type=="createroom"){
console.log('CREATING ROOM');
	
if(msg.owner=='true'){
console.log('owner is true');
if(droom.has(msg.roomname)){
console.log('Schoo gibts this room by name: ',msg.roomname)
console.log(' ...skiping');
}else{
console.log('creating a room for id=',ws.clientId);
croom(msg.roomname).then((da)=>{
console.log('da: ',da);
ws.owner=msg.roomname;

}).catch(e=>{
console.log('error room creating: ',e);
if(ws.readyState===1)ws.send(JSON.stringify({type:"error", ename:e.name,emsg:e.message}))
delete ws.owner;
})	
}	
}
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
handleAnswer(ws, msg);
}else if(msg.type=="bye"){
cleanUpPeer(ws, msg.roomname);
sendtoclients=false;
}else if(msg.type=="candidate"){
console.log('MUST NOT got candidate');
}else if(msg.type=="removeroom"){
if(msg.owner==='true'){
console.log('closing a room: ',msg.roomname);
let vid=droom.get(msg.roomname);
if(vid){
droom.get(msg.roomname).on('close',e=>{
droom.delete(msg.roomname);
console.log('ROOM CLOSED');
console.log('ROOM SIZE:',droom.size);
//sendback(ws,{type:'goodbyeroom',roomname:msg.roomname,vid:vid.id});
ws.send(JSON.stringify({type:'goodbyeroom',roomname:msg.roomname,vid:vid.id}));
boom.emit('roomremove',{type:'roomremove',roomname:msg.roomname,vid:vid.id})
if(e){
console.log(e);
sendback(ws,{type:'error',error:e,roomname:msg.roomname})
}
})
droom.get(msg.roomname).close();
console.log('ROOM SIZE:',droom.size);
}
}
sendtoclients=false;
}else{console.log('unknown type: ',msg.type)}

	
if(sendtoclients){
var msgstring=JSON.stringify(msg);
if(msg.target && msg.target !==undefined && msg.target.length !==0){
			//ws.send(message);
sendtooneuser(ws,msg.target, msgstring);
}else{
wss.clients.forEach(c=>{
if(c.upgradeReq.url===ws.upgradeReq.url){
if(c && c.readyState===WebSocket.OPEN){c.send(msgstring)}
}
})}
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
ws.send(str);
}

function preparePeer(ws, message, downOnly){
const id=ws.clientId;
console.log('ID: ',id.toString())
const planb=message.planb;
const capabilitySDP=message.capability;
//let peer=soupRoom.Peer(id);
console.log('MESSAGE.ROOMNAME: ',message.roomname);
let vid=droom.get(message.roomname);
if(vid){
let peer=/*droom.get(message.roomname)*/vid.Peer(id.toString());
let peerconnection=new RTCPeerConnection({peer:peer,usePlanB:planb});
console.log('--- create rtcpeerconnection --');
console.log('-- peers in the room = ',/*soupRoom*/droom.get(message.roomname).peers.length);
peerconnection.on('close', err=>{console.log('peerconnection closed ');
if(err)console.log(err);});
peerconnection.on('signalingstatechange',()=>console.log('sate ',peerconnection.signalingState));
peerconnection.on('negotiationneeded',()=>{console.log('negotiationneeded id: ',id);
sendOffer(ws,peerconnection,downOnly);});
peerconnection.setCapabilities(capabilitySDP).then(()=>{
console.log('peer.setcapabilities() ok');
addPeerConnection(id,peerconnection);
sendOffer(ws,peerconnection);
}).catch(err=>{
console.log('peer.setcapabilities() err: ',err);
peerconnection.close();
})
}else{sendback(ws,{type:"error",ename:"No room found by name: "+message.roomname})}
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
const id = ws.clientId;//getId(ws);
let peerconnection = getPeerConnection(id);
if (! peerconnection) {
console.warn('WARN: connection not found. id=', id);
return;
}

let desc = new RTCSessionDescription({type : "answer", sdp  : message.sdp});
  
peerconnection.setRemoteDescription(desc).then( function() {
console.log('setRemoteDescription for Answer OK id=' + id);
console.log('-- peers in the room = ' + soupRoom.peers.length);
dumpPeer(peerconnection.peer, 'peer.dump after setRemoteDescription(re-answer):');
}).catch( (err) => {
console.eror('setRemoteDescription for Answer ERROR:', err)
});
}


function dumpPeer(peer, caption) {
console.log(caption + ' transports=%d receivers=%d senders=%d',
peer.transports.length, peer.rtpReceivers.length, peer.rtpSenders.length
  );
}


function addPeerConnection(id, pc) {
Connections[id] = pc;
}

function getPeerConnection(id) {
const pc = Connections[id];
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
if(droom.get(name)){ console.log('-- peers in the room = ' + droom.get(name).peers.length);}
}

function sendSDP(ws, sessionDescription) {
const id = ws.clientId;
let message = { sendto: id, type: sessionDescription.type, sdp: sessionDescription.sdp };
console.log('--- sending sdp ---');
console.log('sendto:' + message.sendto + '   type:' + message.type);
sendback(ws, message);
}


/* END OF MEDIASOUP */
pool.on('connect', client=>console.log('pool connected'));
pool.on('error', (err, client)=>console.log('error in pool: ', err.message));
pool.on('acquire', client=>console.log('pool acquired '));
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
co(function*(){
try{
//console.log('Durak: ',JSON.parse(bp_msg.data.infbp.buyerFields).buyerEmail);
	//console.log('email: ',bp_msg.data.infbp.buyerFields.buyerEamil);
//console.log('items: ',JSON.parse(bp_msg.data.infbp.posData).items);
yield pool.query(`update busers set w_items=${items} where email='${mail}'`);
}catch(e){console.log('err in evs bitpay status paid: ', e);}
})
}else if(bp_msg.data.infbp.status==="complete"){
co(function*(){
try{
yield pool.query(`update busers set items=items+${items}, w_items=w_items-${items} where email='${mail}'`);
}catch(e){console.log('err in evs bitpay status complete: ', e);}
})
}else if(bp_msg.data.infbp.status==="invalid"){
co(function*(){
try{
yield pool.query(`update busers set w_items=w_items-${items} where email='${mail}'`);
}catch(e){console.log('err in ev bitpay status invalid: ',e);}
})
}else{}
})
//--trace-warnings

boss.start().then(ready).catch(err=>console.log(err));

function ready(){
	
boss.subscribe('banner_enable', (job,done)=>{
console.log(job.name,job.id,job.data);
co(function*(){
try{
yield pool.query(`insert into ban_act(ban_id,href,src,title,type) values('${job.data.ban_id}',
'${job.data.href}','${job.data.src}','${job.data.title}','${job.data.type}')`);
}catch(e){console.log(e)}
})
done().then(()=>console.log('confirmed done'))
})

boss.subscribe('banner_disable', (job,done)=>{
console.log(job.name,job.id,job.data);
co(function*(){
try{
yield pool.query(`delete from ban_act where ban_id='${job.data.ban_id}'`);
}catch(e){console.log(e)}
})
done().then(()=>console.log('confirmed done'))
})
//dummy bitpay webhooks
boss.subscribe('bitpay_paid', (job,done)=>{
console.log(job.name,job.id,job.data);
co(function*(){
try{
yield pool.query(`insert into bitpayers(infbp) values('${JSON.stringify(job.data.message)}') 
on conflict((infbp->>'id'::text)) do update set infbp=jsonb_set(bitpayers.infbp,'{status}','"${job.data.message.status}"') 
where bitpayers.infbp->>'status' not like '%complete%'`);
}catch(e){console.log(e)}
})
done().then(()=>console.log('confirmed done'))
})

boss.subscribe('bitpay_complete', (job,done)=>{
console.log(job.name,job.id,job.data);
co(function*(){
try{
yield pool.query(`insert into bitpayers(infbp) values('${JSON.stringify(job.data.message)}') 
on conflict((infbp->>'id'::text)) do update set infbp=jsonb_set(bitpayers.infbp,'{status}','"${job.data.message.status}"') 
where bitpayers.infbp->>'status' not like '%complete%'`);
}catch(e){console.log(e)}
})
done().then(()=>console.log('confirmed done'))
})



}	

server.on('newroom',(r)=>{
console.log('new room: ',r.id);
boom.emit('fuck',{room_id:r.id});
});
server.on('close',(er)=>{
console.log('closing the mediasoup server');
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