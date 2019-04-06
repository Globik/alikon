const tjson=n=>{
try{
let m=JSON.stringify(n)
return m
}catch(e){console.log('err json stringify: ',e)}
}
function wslookup(wss){
	
const list_of_clients=(ws,url,obj,bool,level,db)=>{
	
const as=(arg,cb)=>process.nextTick(()=>cb(arg))
const final=()=>db(null,{arr:rs,size:rsn,lusers:lusers,info:"ok",sifilis:sifilis,pidment:pidment,chataccess:chataccess})
var rs=[]
var chataccess=0
var lusers=[];
var rsn=0
let bmess=obj;
var sifilis=0
var pidment=0
let running=0,lim=200;
//console.log('WSS2: ',wss.clients.size)
let lift=[...wss.clients]
//console.log('lift: ',lift)
function launcher(){
while(running<lim && lift.length>0){
let item=lift.shift();
as(item, async function(el){
if(level=="uroom"){
//if(el.upgradeReq.url===ws.upgradeReq.url){
	console.log('url: ',url)
	console.log('el.url: ',el.url)
if(el.url===url){
if(el && el.readyState===1){
if(bool){
el.send(bmess);rsn++;
}else{
if(el.ready===true){
sifilis=true
pidment=el.pidi
if(el.chataccess){chataccess=el.chataccess}
}
rsn++
lusers.push({username:el.username,owner:el.owner,clientId:el.clientId})
rs.push(el)
}
}
}
}else if(level=="all"){
	//console.log('METHOD ALLLLL')
if(bool==false){
if(el.username==obj.target){
if(el && el.readyState==1){
try{var vjson=JSON.stringify(obj)}catch(e){return db(e);}
el.send(vjson,(err)=>{
if(err){console.log('error in level=all send to one user in all rooms: ',err);return db(err)}
})
}
}

}else{
if(el && el.readyState===1){
rsn++
el.send(bmess,(err)=>{
if(err)return db(err)
})
}}
}else if(level=="websock"){
	//console.log('el.isAlive??:',el.isAlive)
if(el.isAlive===false)return el.terminate()
el.isAlive=false;
el.ping('',false,true)
}else{}
running--
if(lift.length>0){
await launcher();
// process.nextTick(launcher)
}else if(running==0){
final();
}
})
running++
}
}
process.nextTick(launcher)
}
const promis_list=(ws,url,obj,bool,level)=>{
return  new Promise((r,j)=>{
list_of_clients(ws,url,obj,bool,level,(e,d)=>{
if(e)j(e)
r(d)
})
})
}

async function emergency_to_all_in_room(ws,url,obj){
try{
let d=await promis_list(ws,url,obj,true,"uroom")
//console.log('if sending emergency to all in room?: ',d)
}catch(e){console.log(e)}
}
	
async function send_new_user_to_all(ws,url,username,clid){
console.log('sending new user ')
try{
let b=await promis_list(ws,url,{fake:'f'},false,"uroom");
//let sifa=await
let msg={type:"joined_user",mus_cnt:b.arr.length,username:username,clid:clid,
		 users:b.lusers,ready:b.sifilis,pidi:b.pidment,info:b.info,chataccess:b.chataccess}
try{var me2=JSON.stringify(msg)
console.log('me2: ',me2)}catch(e){console.log(e)}
emergency_to_all_in_room(ws,url,me2)
}catch(e){console.log('err sending new user to all: ',e)}
}	

async function super_send(ws,url,obj){
try{
let mes=JSON.stringify(obj)
let d=await promis_list(ws,url,mes,true,"all")
}catch(e){console.log('in super_send: ',e)}
}
const find_target=(v,id,m)=>new Promise((r,j)=>r(v.find(e=>e[id]==m)))

async function send_to_one_user_in_room(ws,url,target,mstring){
let bm=tjson(mstring)
try{
let d=await promis_list(ws,url,{fake:'f'},false,"uroom")

let si=await find_target(d.arr,'username',target)
if(si && si.readyState==1)si.send(bm)
	
}catch(e){console.log(e)}
}

async function send_to_one_user_in_all_rooms(ws,url,mstring){
//let bm=tjson(mstring)

try{
	console.log('colling send_to_one_user_in_all_rooms')
await promis_list(ws,url,mstring,false,"all")

	
}catch(e){console.log('err in send_to_one_user_in_all_rooms: ',e)}
}
async function on_leave_out(ws,url,id,name){
	console.log('on_leave_out()')
try{
let a=await promis_list(ws,url,{fake:'f'},false,"uroom");
let um={type:"out_user",username:name,clientId:id,mus_cnt:a.arr.length}
console.log('sending message on _leave_out()')
try{var fiki2=JSON.stringify(um)}catch(e){console.log('json stringify err in on_leave_out')}
emergency_to_all_in_room(ws,url,fiki2)
}catch(e){console.log(e)}
	console.log('end of on_leave out()')
}
const sendback=(ws,m)=>{if(ws.readyState==1)ws.send(tjson(m))}

return {send_new_user_to_all,super_send,sendback,emergency_to_all_in_room,send_to_one_user_in_room,on_leave_out,promis_list,
	   send_to_one_user_in_all_rooms}

}
/*

lwan -r /home/globik/lwan/wwwroot -c 
*/ 
module.exports={tjson,wslookup}
/*
var interval=setInterval(function ping(){
	console.log('ping?')
wss.clients.forEach(function each(ws){
	console.log('ws.isAlive?: ',ws.isAlive)
if(ws.isAlive===false)return ws.terminate();
ws.isAlive=false;
ws.ping('',false,true)
})
},6000)

peer.on('close',n=>{
console.log('PEER CLOSED!!')
if(n)console.log('PEER BY CLOSED: ',n);
	let d={};
d.type="dump";
d.broom=broom;
d.bpeer=bpeer;
d.name=peer.name;
d.id=peer.id;
d.closed=peer.closed;
d.transports=peer.transports.length;
d.rtpreceivers=peer.rtpReceivers.length;
d.rtpsenders=peer.rtpSenders.length;
d.event="peer_closed";
//dumpsend(wss,d);
})



peer.on("newrtpsender",rtpSender=>{
//name,id,closed,transports,rtpReceivers,rtpSenders,
console.log('NEW RTPSENDER!: ');
console.log('peer name: ',peer.name);
console.log('peer id: ',peer.id);
console.log('peer closed: ',peer.closed);
	console.log('d.senderid=!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!: ',rtpSender.id);
	console.log('rtp sender closed: ',rtpSender.closed);
	console.log('peer transports: ',peer.transports.length);
	console.log('peer rtpSenders: ',peer.rtpSenders.length)
let d={};
d.type="dump";
d.broom=broom;
d.bpeer=bpeer;
d.name=peer.name;
d.id=peer.id;
d.closed=peer.closed;
d.rtps_closed=rtpSender.closed;
d.rtps_id=rtpSender.id;
d.rtps_kind= rtpSender.kind;
console.log('kuku 741 ',rtpSender.peer.id); 
console.log('peer name: ',rtpSender.peer.name)
console.log(rtpSender.peer.closed);
console.log('rtp senders length: ',rtpSender.peer.rtpSenders.length);
console.log('d.rtsp_params= ',rtpSender.rtpParameters.codecs[0].clockRate);
//d.rtsp_params=rtpSender.rtpParameters;//ok
d.rtsp_active=rtpSender.active;//ok
d.rtsp_active=rtpSender.active;//ok
d.event="new_rtpsender";
//setTimeout(function(){dumpsend(wss,d)},10);	
rtpSender.on('close',er=>{
	if(er)console.log('err on close rtpsender : ',er)
	console.log('rtpSender closed - line 754');
	})
rtpSender.on('parameterschange',(rtpParameters,active)=>{
	console.log('on parameters change - line 757')
	})
rtpSender.on('activechange',active=>{console.log('on active change line 759 ',active)})
})
//peerconnection.peer.on('newrtpsender',rtpReceiver=>{console.log('ON NEW RTP RECEIVER OCCURED!!!')})


peer.on('capabilities',capabilities=>{
console.log('ON CAPABILITIES!!!!');
let d={};
d.type="dump";
d.broom=broom;
d.bpeer=bpeer;
d.name=peer.name;
d.id=peer.id;
d.closed=peer.closed;
d.event="capabilities";
//console.log('CAPABILITIES: ', capabilities);
//dumpsend(wss,d);
})

peer.on('newtransport',transport=>{
console.log('ON NEW TRANSPORT on peer!!!!')
let d={};
d.type="dump";
d.broom=broom;
d.bpeer=bpeer;
d.name=peer.name;
d.id=peer.id;
d.closed=peer.closed;
d.trans_id=transport.id;
d.trans_closed=transport.closed;
d.trans_icerole=transport.iceRole;
d.trans_state=transport.iceState;
d.event="newtransport";
// iceLocalParameters, iceLocalCandidates iceSelectedTuple dtlsLocalParameters dtlsState dtlsRemoteCert
//dumpsend(wss,d);
	
transport.on('close', err=>{
if(err)console.log('er close transport: ',err)
console.log('TRANSPORT CLOSE OCCURED')
})
transport.on('iceselectedtuplechange', iceSelectedTuple=>{
console.log('ice SELECTED TUPLE OCCURED')
})
transport.on('icestatechange', iceState=>{
console.log('ICE STATE CHANGE OCCURED')
})
transport.on('dtlsstatechange', dtlsState=>{
console.log('ON DTLS STATE CHANGE OCCURED')
})
})

peer.on('newrtpreceiver',rtpReceiver=>{
console.log('NEW RTP RECEIVER!! :');
	let d={};
d.type="dump";
d.broom=broom;
d.bpeer=bpeer;
d.name=peer.name;
d.id=peer.id;
d.closed=peer.closed;
d.rtprec_id=rtpReceiver.id;
d.rtprec_closed=rtpReceiver.closed;
d.rtprec_kind=rtpReceiver.kind;
console.log('d.rtpreceiver_id!!!!!!!!!!!!!!!!!!!!!!!!!!=: ',rtpReceiver.id);
d.event="new_rtpreceiver";
//dumpsend(wss,d);
	rtpReceiver.on('close',err=>{
	console.log('RTP RECEIVER CLOSED!!!!!!!!!!!!!!!!!')
	if(err)console.log('err in close rtpreceiver: ',err)
	})
	rtpReceiver.on('parameters',rtpParameters=>{
	console.log('ON RTPRECEIVER PARAMETERS OCCURED!!!!!! 789')
	})
	rtpReceiver.on('parameterchange', rtpParameters=>{
	console.log('PARAMETER CHANGED IN RTP RECEIVER OCCURRED!!! 792')
	})
	rtpReceiver.on('transport', transport=>{
	console.log('ON TRANSPORT OCCURED IN RECEIVER!!!! 795')
	})
	rtpReceiver.on('rtpraw', packet=>{
	//console.log('RTPRAW OCCURED IN RECEIVER 798')
	})
	rtpReceiver.on('rtpobject', packet=>{
	//console.log('ON RTP OBJECT OCCURED IN RTP RECEIVER 801')
	})
})

*/
