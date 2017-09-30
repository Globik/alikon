const tjson=n=>{
try{
let m=JSON.stringify(n)
return m
}catch(e){console.log('err json stringify: ',e)}
}
module.exports={tjson}
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
