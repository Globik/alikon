var bpeer=0,ROOM=100,PEER=100
const {tjson,wslookup}=require('./unter_websock.js')

var droom=new Map(),Connections=new Map()
//(wss,pool,sse,shortid,server,RTCPeerConnection,RTCSessionDescription,peerCapabilities,roomOptions)
const websock=(wss,pool,sse,shortid,mediasoup,RTCPeerConnection,RTCSessionDescription,peerCapabilities,roomOptions)=>{
const didi=wslookup(wss)

const preparePeer=(ws,message,downOnly)=>{
console.log('PREPARINGPEER()',downOnly)
console.log("MESSAGE In preparePeer: ",message);
const id=ws.clientId;
console.log('ID: ',id.toString())
const planb=message.planb;
const capabilitySDP=message.capability;
console.log('MESSAGE.ROOMNAME: ',message.roomname);
let vid=droom.get(message.roomname);
	console.log('vid: ')
if(vid){
if(vid.peers.length > PEER){
console.log('peers great than ',PEER,' Skip creating a peer...');
didi.sendback(ws,{type:"overfilled",peerquan:PEER,peersize:vid.peers.length,etype:6,emsg:"Peer size is overfilled. Please wait some time."});
return;
}
let peer=vid.Peer(id.toString());
	console.log('peer 28')
	//try{
let pc=new RTCPeerConnection({peer:peer,usePlanB:planb});
	//}catch(e){console.log('pc error: ',e)}
console.log('--- create rtcpeerconnection --');
let peerlength=vid.peers.length;
console.log('-- peers in the room from PREPAREPEER = ',peerlength);
//statistik
//dumpsend(wss,{type:"dump",broom:broom,bpeer:bpeer,plen:vid.peers.length})
pc.on('close', err=>{
console.log('peerconnection closed ');
let vidi=droom.get(message.roomname);
if(vidi){
let peerlength=vidi.peers.length;
	//statistik
bpeer--;
update_view(ws,'/'+message.roomname,peerlength,message.roomname);
}
if(err)console.log(err);
});
	
pc.on('signalingstatechange',()=>console.log('state ',pc.signalingState));
pc.on('negotiationneeded',()=>{
console.log('negotiationneeded id: ', id);
sendOffer(ws,pc,downOnly)})

pc.setCapabilities(capabilitySDP).then(()=>{
console.log('peer.setcapabilities() ok',capabilitySDP);
addPeerConnection(id,pc);
sendOffer(ws,pc);
}).catch(err=>{
console.log('peer.setcapabilities() err: ',err);
pc.close();
})
}else{didi.sendback(ws,{type:"error",ename:"No room found by name: "+message.roomname,num:"101"})}
}

function sendOffer(ws,pc,downOnly){
console.log('SEND OFFER()')
const id=ws.clientId;
console.log("downOnly=1");
let offerOption={offerToReceiveAudio:1,offerToReceiveVideo:1};
if(downOnly){
	console.log("downOnly=0");
offerOption.offerToReceiveAudio=0;
offerOption.offerToReceiveVideo=0;
}
pc.createOffer(offerOption).then(desc=>{
	console.log('CREATING OFFER, desc came:',desc)
return pc.setLocalDescription(desc)}).then(()=>{
//dumpPeer(pc.peer,'peer.dump after createoffer')
	console.log("after setlocaldescription: ",pc.localDescription);
sendSDP(ws,pc.localDescription)
}).catch(err=>{
console.log('error handling sdp offer to participant: ',err)
pc.reset()
pc.close()
deletePeerConnection(id);
})
}
	
	
function handleAnswer(ws, message) {
	console.log('ANSWER::message',message)
const id = ws.clientId;
let pc=getPeerConnection(id);
if (!pc) {return;}

let desc = new RTCSessionDescription({type : "answer", sdp  : message.sdp});
  console.log("DESC in HandleAnswer: ",desc);
pc.setRemoteDescription(desc).then(()=>{
	console.log("after SET remoteDescription()");
let vid=droom.get(message.roomname);
if(vid){
let peerlength=vid.peers.length;
console.log('-- PEERS in the room FROM handleAnswer = ', peerlength);
update_view(ws,'/'+message.roomname,peerlength,message.roomname)

}
//dumpPeer(pc.peer, 'peer.dump after setRemoteDescription(re-answer):');

}).catch( (err) => {
console.log('setRemoteDescription for Answer ERROR:', err)
});
}
const dumpPeer=(peer, caption)=>{
let d={}
d.transports=peer.transports.length;
d.rtpreceivers=peer.rtpReceivers.length;
d.rtpsenders=peer.rtpSenders.length;
d.broom=broom;
d.bpeer=bpeer;
d.type="dump";
//dumpsend(wss,d)
}
const sendSDP=(ws,sessionDescription)=>{
	console.log('sendSDP')
const id=ws.clientId;
let m={sendto:id,type:sessionDescription.type,sdp:sessionDescription.sdp}
didi.sendback(ws, m);
}
const sendhistory=(ws,blin3)=>{// TODO remove this functionality
	console.log('sending history')
pool.query('select*from chat where chat_name=$1 limit $2',[blin3,10]).then(r=>{
if(r.rows.length > 0)didi.sendback(ws,{type:'history',d:r.rows})
}).catch(e=>{console.log('err in chat table: ',e)})
}
const update_end=pidi=>{
pool.query('update seats set vend=now() where pid=$1',[pidi]).then(result=>{
}).catch(err=>{console.log('error update seats finish: ',err)})
}
const delete_room=(ws,name)=>{
pool.query('delete from rooms where room_name=$1 RETURNING room_name',[name]).then(result=>{
console.log('DELETE RETURNING ID: ',result.rows[0]);
//sse.publish('ch_log_rooms','remove_room', result.rows[0])
didi.sendback(ws,{type:'goodbyeroom',roomname: name})
}).catch(e=>{console.log('err delete room by id: ',e)})
}
const insert_message=(msgi,roomname,nick)=>{//TODO remove this functionality
pool.query('insert into chat(msg,chat_name,us_name) values($1,$2,$3)',[msgi,roomname,nick]).then(r=>{
}).catch(e=>{console.log('err in inserting message into chat table: ',e)})
}
const update_view=(ws,furl,peerlength,roomname)=>{
pool.query('update rooms set view=$1 where room_name=$2',[peerlength,roomname]).then(r=>{
console.log('ok update rooms view handleanswer')
sse.publish('ch_log_rooms','room_view', {peers:peerlength,room_name:roomname})
didi.emergency_to_all_in_room(ws,furl,tjson({type:"stat_room",peers:peerlength,room_name:roomname}))
}).catch(err=>{console.log('err update rooms view handleanswer: ',err)})
}

function update_photo_src(ws,furl,msg){
let sis1='update rooms set src=$1 where room_name=$2 returning status,view,room_name,src';
console.log('sis1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
pool.query(sis1,[msg.src,msg.roomname]).then(res=>{
console.log('what the fuck??????????????????????????????? msg:',msg.pidi,' chat access ',msg.chataccess)
didi.emergency_to_all_in_room(ws,furl,tjson({type:'roomer_online',ready:true,pidi:msg.pidi,src:res.rows[0].src,chataccess:msg.chataccess}));
sse.publish('ch_log_rooms','add_room', res.rows[0])
//status,view,room_name,src
}).catch(er=>{console.log(er);
didi.emergency_to_all_in_room(ws,furl,tjson({type:'roomer_online',ready:true,pidi:msg.pidi,src:undefined}))			 
})
}
	
function update_photo_src_end(ws,furl,msg){
let sis2="update rooms set src=$1 where room_name=$2 returning room_name";
pool.query(sis2,['',msg.roomname]).then(res=>{
console.log('msg.pidi: ',msg.pidi)
update_end(msg.pidi)
didi.emergency_to_all_in_room(ws,furl,tjson({type:'roomer_offline',ready:false,pidi:0}))
sse.publish('ch_log_rooms','remove_room', {room_name:msg.roomname})
}).catch(e=>{console.log(e)})
}
	
const deletePeerConnection=id=>Connections.delete(id)
const addPeerConnection=(id, pc)=>Connections.set(id,pc)
const getPeerConnection=id=>Connections.get(id)
//const find_target=(v,id,m)=>new Promise((r,j)=>r(v.find(e=>e[id]==m)))

async function inserting_room(roomname){
try{
var res2=await pool.query('insert into rooms(room_name) values($1) returning status,view,room_name,src',[roomname])
}catch(e){console.log('err inserting a room: ',e)}
}
	//create_room(mediasoup,roomOptions,msg.roomname,pool,ws)
async function create_room(server,roomOptions,mn,ws){
	console.log('trying create a room: ',mn)
try{
var croomer=await server.createRoom(roomOptions)
console.log('ROOM.ID: ',croomer.id)
droom.set(mn,croomer)
ws.roomid=mn;
inserting_room(mn)
didi.sendback(ws,{roomname:mn,type:'onroom'})

croomer.on('newpeer',peer=>{
console.log('ON NEW PEER: ',peer.id)
bpeer++
})

}catch(e){
console.log(e)
didi.sendback(ws,{type:"error", ename:e.name,emsg:e.message})
delete ws.roomid;
}
}

const cleanUpPeer=(ws,name)=>{
let id = ws.clientId;
let pc = getPeerConnection(id);
if (!pc) {
console.warn('WARN: cleanUpPeer(id) , connection not found. id=', id);
return;
}
console.log('PeerConnection close. id=' + id);
pc.close();
deletePeerConnection(id);
// todo remove name parameter
console.log('NAME in Clean UP Peer: ',name);
}
//close_room(ws, msg.roomname)
const close_room=(ws,urlroom)=>{
console.log('CLOSING THE ROOM!!!: ',urlroom);
let vid=droom.get(urlroom)
if(vid){
vid.on('close', on_close_room)
vid.close();
}
function on_close_room(err){
console.log('on_close_room(err)')
setImmediate(()=>{
droom.delete(urlroom)
console.log('closing a room droom.size: ',droom.size)
//delete_room(ws,urlroom)
if(err){
didi.sendback(ws,{type:'error',error:err,roomname: urlroom})
}
})
}	
}

function heartbeat(){this.isAlive=true;}
async function wsping(){
try{return await didi.promis_list('fake','/fake_furl',{fake:'f'},'fake',"websock")}catch(e){console.log(e)}
}
var interval2=setInterval(async function ping(){
let bulu=await wsping();
},6000)

wss.on('connection',(ws,iu)=>{
process.nextTick(()=>{
//console.log('websocket connected: ', ws.upgradeReq.url)
	console.log('websocket connected: ',iu.url);
	console.log('is ready: ',ws.readyState);
	console.log('clients:',wss.clients.size);
ws.isAlive=true;
ws.on('pong', heartbeat);
//var blin=ws.upgradeReq.url,blin2=blin.trim(),urlRoom=blin2.substring(1)
var blin=iu.url,blin2=blin.trim(),urlRoom=blin2.substring(1);
	var furl=iu.url;
ws.url=iu.url;
console.log('URL_ROOM: ',urlRoom)
ws.clientId=shortid.generate();
var msg={type:"id",id:ws.clientId}
didi.sendback(ws,msg)
//sendhistory(ws,urlRoom)  TODO remove this functionality
const on_message=async message=>{
//process.nextTick(()=>{
var sendtoclients=true;
	console.log('MESSAGE: ')
try{
msg=JSON.parse(message)}catch(e){console.log('error json in websocket to parse');}


if(msg.type=="message"){
}else if(msg.type=="username"){
console.log('MSG IN TYPE USERNAME: ',msg)
ws.username=msg.name
ws.owner=msg.owner
ws.ready=false
didi.send_new_user_to_all(ws,furl,msg.name,msg.id)
sendtoclients=false;
}else if(msg.type=="emergency_stop"){
didi.super_send(ws,furl,{type:"emergency_stop",msg:"Stop all streams"});
sendtoclients=false;
}else if(msg.type=="note"){
didi.super_send(ws,furl,{type:"message",msg:msg.msg,from_nick:msg.from_nick})
sendtoclients=false;
}else if(msg.type=="createroom"){
	console.log('is mediaserver closed?: ',mediasoup.closed)
if(!mediasoup.closed){
	
if(msg.owner){
if(droom.size > ROOM) {
didi.sendback(ws,{type:"overfilled", roomquan:ROOM,roomsize:droom.size,emsg:"Rooms size is overfilled. Please wait some time",etype:5})
return;
}
if(droom.has(msg.roomname)){
console.log('Schoo gibts this room by name: ',msg.roomname)
}else{
create_room(mediasoup,roomOptions,msg.roomname,ws)
}	
}
}else{
didi.sendback(ws,{type:"error",ename:"Mediasoup is closed!",emsg:"Are you online?"})
}
sendtoclients=false;
}else if(msg.type=="online"){
	console.log("ONLINE: ",msg.pidi)
// iceConnectionState=='completed' or 'connected'
ws.ready=true;
ws.pidi=msg.pidi;
ws.chataccess=msg.chataccess;
update_photo_src(ws,furl,msg)
sendtoclients=false;
}else if(msg.type=="offline"){
ws.ready=false;
update_photo_src_end(ws,furl,msg)
sendtoclients=false;
}else if(msg.type=="money_trans"){
didi.emergency_to_all_in_room(ws,furl,tjson({type:'token_antwort',from:msg.from,to:msg.to,amount:msg.amount,btype:msg.btype,pid:msg.pid,user_nick:msg.from_nick}))
// insert_message(msg.msg, msg.roomname, msg.from_nick) // TODO remove this functionality
sendtoclients=false;
}else if(msg.type=="call"){
console.log('got call from id=' + ws.clientId);
const downOnlyRequested=false;
preparePeer(ws,msg,downOnlyRequested);
sendtoclients=false;
}else if(msg.type=="call_downstream"){
const downOnlyRequested=true;
preparePeer(ws,msg,downOnlyRequested);
sendtoclients=false;
}else if(msg.type=="offer"){
//console.log('got Offer from id=');
//console.log('must not got offer.');
}else if(msg.type=="answer"){
	//wss,ws,pool,sse,peerlength,roomname
handleAnswer(ws,msg);
}else if(msg.type=="bye"){
//dissconnect button
cleanUpPeer(ws, msg.roomname);
sendtoclients=false;
}else if(msg.type=="candidate"){
//console.log('MUST NOT got candidate');
}else if(msg.type=="bitaps_cb"){
console.log('type bitaps_cb in ws')
console.log('msg: ',msg);
await didi.send_to_one_user_in_all_rooms(ws,furl,msg);
sendtoclients=false;
}else if(msg.type=="removeroom"){
if(msg.owner){
// pauseVideo 'stop video' button
close_room(ws, msg.roomname)
delete_room(ws,urlroom)
}
sendtoclients=false;
}else{console.log('unknown type: ',msg.type);sendtoclients=false}

if(sendtoclients){
if(msg.target && msg.target !==undefined && msg.target.length !==0){
console.log('sending target message to one user: ',msg)
didi.send_to_one_user_in_room(ws,furl,msg.target,msg);
}else{
if(msg.type=='message'){
console.log('sending to all type message: ',msg)
	//insert_message(msg.msg,msg.roomname,msg.from_nick) TODO remove this functionality 'history chat'
}
	
try{var jsob=JSON.stringify(msg)}catch(e){console.log('err json stringify in sending type message to all')}
didi.emergency_to_all_in_room(ws,furl,jsob)
}
}

}
	
ws.on('error',e=>console.log('err in websocket: ',err))
ws.on('close',()=>{
console.log('WEBSOCKET CLOSED. ',urlRoom)
	//function on_leave_out(wss,ws,id,name)
didi.on_leave_out(ws,furl,ws.clientId,ws.username)
cleanUpPeer(ws, urlRoom);
console.log('WS.OWNER: ',ws.owner)
if(ws.owner){
	console.log('websocket closing for ws.owner')
if(ws.pidi && ws.pidi.length>0){
console.log('updating pidi in websocket closing')
delete_room(ws,urlRoom)
update_end(ws.pidi);
}
close_room(ws,urlRoom);
}
	console.log('END OF SOCK_ONCLOSE()')
}		 
 )

ws.on('message',on_message)
})})
}
module.exports={websock}