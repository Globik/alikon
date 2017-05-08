//busers.js
var head=require('./head'),
    header_menu=require('./header_menu'),
	admin_main_menu=require('./admin_main_menu'),
    footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;

var busers = n=>{
var {buser,model,showmodule:{mainmenu,profiler}}=n;
	//console.log('BUSER: ',buser);
return `<!DOCTYPE html><html lang="en"><!-- busers.js -->
<head>${head.head({title:"User", csslink:"/css/main2.css"/*,js:["/js/socket.io.min.js"]*/})}</head>
<body>${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<style>
/*#pagewrap{
background-image:url("/images/vk.png");*/
}
</style>
<main id="pagewrap"> 
<style>
.modrtc{width:30%;display:inline-block;background:green;padding:10px;}
.overlay {
    background-color: rgba(0, 0, 0, 0.2);
    bottom: 0;
	left:0;
	right: 0;
    top: 0;
    cursor: default;
    opacity: 1.0;
    position: fixed;
    visibility: hidden;
    z-index: 1;
    transition: opacity .5s;
}

.overlay:target {
visibility: visible;
opacity: 1;
}

.popi {
color:gray;
background-color: rgba(0,0,0,.7);
border: 3px solid rgba(255,255,255,0.4);
left: 50%;
top: 50%;
width:50%;
opacity:0;
padding: 15px;
position: fixed;
text-align: justify;
height:50%;

min-height:50px;
visibility: hidden;
z-index: 30;
-o-transform: translate(-50%,-50%);
-ms-transform: translate(-50%,-50%);
-moz-transform: translate(-50%,-50%);
-webkit-transform: translate(-50%,-50%);
transform: translate(-50%, -50%);
border-radius: 10px;
	/*box-shadow: 0 1px 1px 2px rgba(0, 0, 0, 0.4) inset;*/
transition: opacity .5s, top .5s;
}
.overlay:target+.popi {
opacity: 1;
visibility: visible;
	}
.close {
    background-color: rgba(0, 0, 0, 0.8);
    height: 30px;
    line-height: 30px;
    position: absolute;
    right: 0;
    text-align: center;
    text-decoration: none;
    top: 15px;
    width: 30px;
 border-radius: 15px;
}
.close:before {
    color: rgba(255, 255, 255, 0.9);
    content: "X";
    font-size: 24px;
    text-shadow: 0 -1px rgba(0, 0, 0, 0.9);
}
.close:hover {
 background-color: rgba(64, 128, 128, 0.8);
}
@media screen and (max-width: 650px) {
.popup{color:red;left:50%;top:50%;width:91%;height:70vmin;}
overlay:target+.popi{left:0;}
}
	
</style>
<div>
<button id="fuck">broadcast yourself</button>
<div><b>obid: </b><span id="pid"></span></div>
<div><b>time: </b><span id="timeinfo"></span></div>
</div>
<div class="modrtc">
<h4>Model</h4>
<b>As </b> <span id="modelName">${model.nick}</span><br>
<b>Email:</b> <span id="modelEmail">${model.email}</span><br>
<b>Owner:</b> <span id="owner">${n.owner}</span><br>
<b>Tokens: </b> <span id="modelTokens">${model.items}</span><br>
<b>Websocket id:</b> <span id="modelWebsocketId"></span><br>
</div>
<input type="text" id="name" value="Gest1">
<div class="modrtc">
<h4>You</h4>
<b>As</b> <span id="yourName">${buser ? buser.nick:'a Guest'}</span><br>
<b>Email: </b><span id="yourEmail">${buser ? buser.email:""}</span><br>
<b>Tokens: </b><span id="yourTokens">${buser ? buser.items:''}</span><br>
<b>your websocket id: </b><span id="yourWebsocketId"></span><br>
</div><br>
<div class="firstchild" id="camera-container">
<div class="camera-box">
<video id="received_video" autoplay></video>
<video id="local_video" autoplay muted></video>
<button id="hangup-button" onclick="hangupcall();" disabled>Hung Up</button>
</div>
</div>



<div>
<button onclick="get_one();">send tips</button><br><br>
<button onclick="get_room();">privat</button> <span id="tokpermin">10</span> tokens/min<br><br>

</div>
Time: <span id="mer">00:00:00</span><br><br>
<hr><output id="out"></output>

<a href="#" class="overlay" id="resultativ"></a>
<output id="pop" class="popi">
<a href="#" class="close"></a>
<p>Output <a href="/tipping/purchase_tokens">purchase tokens</a></p>
<p>You have <span id="yourTokens2"></span> tokens.</p>
<p><input id="tokTosend" type="number" value="1" placeholder="1"/></p>
<button onclick="send_tokens();">send</button>
</output>
<form name="publish">
<input type="text" name="message">
<input type="submit" value="send">
</form>
<form name="mepublish">
<input type="text" name="message">
<input type="submit" value="send to only me">
</form>
<button onclick="invite(this);">invite</button>
<div id="subscribe"></div>
<br><span id="wso"></span>
<script>
var seat=0;
var init=0;
var startDate,clocker,mlocker, startingDate;
yourTokens2.textContent=yourTokens.textContent;

function send_tokens(){
if(yourName.textContent !=="a Guest"){
if(yourEmail.textContent!=modelEmail.textContent){
if(yourTokens.textContent !=0){
var data={};
data.from=yourEmail.textContent;
data.to=modelEmail.textContent;
data.amount=tokTosend.value;
data.type=1;
data.pid=pid.textContent;

if(tokTosend.value<=Number(yourTokens.textContent)){
to_xhr(JSON.stringify(data),true);
}else{out.innerHTML="Not enouth tokens!";}
}else{out.innerHTML="Not enough tokens!";}
}else{
out.innerHTML='not selbst!';
}}else{out.innerHTML='Please <a href="/login">log in</a>';}
}

function rechnet(n){
	var mata=JSON.parse(n);
	//modelTokens.textContent=Number(modelTokens.textContent)+mata.info.amount;
    modelTokens.textContent=Number(modelTokens.textContent)+Number(mata.info.amount);
    yourTokens.textContent-=mata.info.amount;
	yourTokens2.textContent-=mata.info.amount;
    //out.innerHTML=this.response;
//from rechnet2
        //modelTokens.textContent=Number(modelTokens.textContent)+Number(mata.info.amount);//(tokpermin.textContent);
		//yourTokens.textContent-=tokpermin.textContent;
		//yourTokens2.textContent=yourTokens.textContent;
	}
	
function get_room(){
	if(init==0){
	if(yourName.textContent !=="Guest"){
	if(yourEmail.textContent!=modelEmail.textContent){
    if(yourTokens.textContent !=0){
	startDate=new Date();
	starttime();
	}else{
out.innerHTML="Not enough tokens!";}
}else{
out.innerHTML="Not selbst!";
}
}else{out.innerHTML='Please <a href="/login">log in</a>';}	
	init=1;}else{
	init=0;
	clearTimeout(clocker);
	}
	}
	
	function starttime(){
	var thisd=new Date();
	var t=thisd.getTime()-startDate.getTime();
		var ms=t%1000;
		t-=ms;
		ms=Math.floor(ms/10);
		t=Math.floor(t/1000);
		var s=t%60;
		t-=s;
		t=Math.floor(t/60);
		var m=t%60;
		t-=m;
		t=Math.floor(t/60);
		var h=t%60;
		if(h<10) h='0'+h;
		if(m<10) m='0'+m;
		if(s<10) s='0'+s;
		//if(ms<10) ms='0'+ms;
		if(init==1) mer.textContent=h+':'+m+':'+s;//+'.'+ms;
		clocker=setTimeout("starttime()",1000);
		if(s==10){
		console.log("kuuu");
		var sraka={};
		
			sraka.from=yourEmail.textContent;
            sraka.to=modelEmail.textContent;
            sraka.amount=tokpermin.textContent;
            sraka.type=2;
            sraka.pid=pid.textContent;
			var si=JSON.stringify(sraka);
			to_xhr(si,true);
		if(yourTokens.textContent<=Number(tokpermin.textContent)){
		clearTimeout(clocker);
		out.innerHTML="Seance is over"
		}
		}
		}

function to_xhr(n,bool){
var xhr=new XMLHttpRequest();
xhr.open('post','/api/set_transfer');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
out.innerHTML=this.response;
if(bool) rechnet(this.response);
}else{
out.innerHTML=this.response+this.status;
}}
xhr.onerror=function(e){out.innerHTML=this.response + ' '+ e};
xhr.send(n);
}

function get_one(){
window.location.href="#resultativ";
}
var obid=function(){
var tst=(new Date().getTime()/1000 | 0).toString(16);
return tst+'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function(){
return (Math.random()*16 | 0).toString(16);
}).toLowerCase();
}
function broadcast(){
//alert(obid());
seat=1;
pid.textContent=obid();
setTimeout(showTime, 1000);
}
broadcast();
function showTime(){
//var tt=setInterval(function(){
//var d=new Date();
//timeinfo.textContent=d;
//},1000);
startingDate=new Date();
marttime();
sendxhr();
}
function marttime(){
	var thisdu=new Date();
	var t=thisdu.getTime()-startingDate.getTime();
		var ms=t%1000;
		t-=ms;
		ms=Math.floor(ms/10);
		t=Math.floor(t/1000);
		var s=t%60;
		t-=s;
		t=Math.floor(t/60);
		var m=t%60;
		t-=m;
		t=Math.floor(t/60);
		var h=t%60;
		if(h<10) h='0'+h;
		if(m<10) m='0'+m;
		if(s<10) s='0'+s;
		if(seat==1) timeinfo.textContent=h+':'+m+':'+s;
		mlocker=setTimeout("marttime()",1000);
		}
function sendxhr(){
if(modelEmail.textContent){
var data={};
data.pid=pid.textContent;
data.status="active";
data.who=modelEmail.textContent;
var xhr=new XMLHttpRequest();
xhr.open('post','/api/set_seat');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
out.innerHTML=this.response;

}else{
out.innerHTML=this.response+this.status;
}}
xhr.onerror=function(e){out.innerHTML=this.response + ' '+ e};
//alert(JSON.stringify(data));
//xhr.send(JSON.stringify(data));
}
}
//websocket
var mediaconstraints={audio:true,video:true};

var clientId=0;
var myusername=null;
var targetusername=null;
var mypeer=null;

var hasAddTrack=false;
//navigator.getUserMedia  = navigator.getUserMedia    || navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia || navigator.msGetUserMedia;
RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription;

function setusername(s){
if(owner.textContent==="true"){
myusername=modelName.textContent;//document.getElementById("name").value;
modelWebsocketId.textContent=clientId;
}else{
document.getElementById("yourWebsocketId").textContent=clientId;
if(yourName.textConent==="a Guest"){myusername="Guest"}else{myusername=yourName.textContent;}
}
s.send(JSON.stringify({name:myusername,id:clientId,type:"username",owner:owner.textContent}));
}

var loc1=location.hostname+':'+location.port;
var loc2='alikon.herokuapp.com';
var loc3=loc1 || loc2;
//var socket=new WebSocket('ws://'+location.hostname+':'+location.port+'/'+modelName.textContent);
var socket=new WebSocket('wss://'+loc3+'/'+modelName.textContent);
function sendtoserver(msg){
var msgjson=JSON.stringify(msg);
socket.send(msgjson);
}

fuck.onclick=function(){
//alert('fuck');
var outm={};
outm.room=modelName.textContent;
outm.type="create_room";
outm.msg="Creating a room";
socket.send(JSON.stringify(outm));
}

socket.onopen=function(){
wso.innerHTML='websocket connected';
}



document.forms.publish.onsubmit=function(){
var outm={};http://localhost:5000/webrtc/gru5
outm.msg=this.message.value;
outm.id=clientId;
outm.type="message";

socket.send(JSON.stringify(outm));
return false;
}

document.forms.mepublish.onsubmit=function(){
var outm={};
outm.msg=this.message.value;
outm.name=myusername;//"Guest1";
//outm.id="dima";
outm.type="onlyme";
outm.target=modelName.textContent;

socket.send(JSON.stringify(outm));
return false
}

socket.onmessage=function(event){
var msg=JSON.parse(event.data);
switch(msg.type){
case "id":
clientId=msg.id;
setusername(socket);

console.log("case id: "+event.data);
break;
case "username":
console.log("case username: "+event.data);
break;
case "message":
console.log("case message: "+event.data);
break;
case "userlist":
console.log("case userlist: "+event.data);
break;
case "video-offer":
console.log('handle video offer-1');
handlevideooffermsg(msg);
break;
case "video-answer":
handlevideoanswermsg(msg);
break;
case "new-ice-candidate":
handlenewicecandidatemsg(msg);
break;
case "hang-up":
handlehangupmsg(msg);
break;
default:
console.log('unknown message received');
}

showmessage(event.data);
}


function showmessage(message){
var messageelement=document.createElement('div');
messageelement.appendChild(document.createTextNode(message));
subscribe.appendChild(messageelement);
}

socket.onerror=function(e){wso.innerHTML="error: "+e;}
socket.onclose=function(e){wso.innerHTML="closed";}

//webrtc one to one
 
function createPeerConnection(){
console.log('creating a connection');
var pc_config = {"iceServers":[]};
mypeer=new RTCPeerConnection(pc_config);
hasAddTrack=(mypeer.addTrack !==undefined);

mypeer.onicecandidate=handleicecandidateevent;
mypeer.onremovestream=handleremovestreamevent;
mypeer.oniceconnectionstatechange=handleiceconnectionstatechangeevent;
mypeer.onicegatheringstatechange=handleicegatheringstatechangeevent;
mypeer.onsignalingstatechange=handlesignalingstatechangeevent;
mypeer.onnegotiationneeded=handlenegotiationneededevent;

if(hasAddTrack){
console.log('ontrack');
mypeer.ontrack=handletrackevent;
}else{
console.log('onaddstream')
mypeer.onaddstream=handleaddstreamevent;
}
}

function handlenegotiationneededevent(){
console.log('negotiation needed');
console.log('creating offer');
mypeer.createOffer().then(function(offer){
console.log('creating new sdp to send to remote peer');
return mypeer.setLocalDescription(offer);
}).then(function(){
console.log('sending offer to remote peer');
sendtoserver({name:myusername,target:modelName.textContent,type:"video-offer",sdp:mypeer.localDescription});
}).catch(reporterror);
}

function handletrackevent(event){
console.log('track event')
console.log(event.stream[0]);
document.getElementById("received_video").srcObject=event.stream[0];
document.getElementById("hangup-button").disabled=false;
}

function handleaddstreamevent(event){
document.getElementById("received_video").srcObject=event.stream;
document.getElementById("hangup-button").disabled=false;
}

function handleremovestreamevent(event){
console.log('stream removed');
closevideocall();
}

function handleicecandidateevent(event){
if(event.candidate){
console.log('event candidate: '+event.candidate.candidate);
sendtoserver({type:"new-ice-candidate",target:modelName.textContent,candidate:event.candidate});
}
}

function handleiceconnectionstatechangeevent(event){
console.log('ice connection state changed to: '+mypeer.iceConnectionState);
switch(mypeer.iceConnectionState){
case "closed":
case "failed":
case "disconnected":
closevideocall();
break;
}
}

function handlesignalingstatechangeevent(event){
console.log('signaling state changed to: '+mypeer.signalingState);
switch(mypeer.signalingState){
case "closed":
closevideocall();
break;
}
}

function handleicegatheringstatechangeevent(event){
console.log('ice gathering changed to : '+mypeer.iceGatheringState);
}

function handleuserlistmsg(){}

function closevideocall(){
var remotevideo=document.getElementById("received_video");
var localvideo=document.getElementById("local_video");
console.log('closing video');
if(mypeer){
console.log('closing peer connection');
mypeer.onaddstream=null;
mypeer.ontrack=null;
mypeer.onremovestream=null;
mypeer.onicecandidate=null;
mypeer.oniceconnectionstatechange=null;
mypeer.onsignalingstatechange=null;
mypeer.onicegatheringstatechange=null;
mypeer.onnotificationneeded=null;
if(remotevideo.srcObject){
remotevideo.srcObject.getTracks().forEach(track=>track.stop());
}
if(localvideo.srcObject){localvideo.srcObject.getTracks().forEach(track=>track.stop());}
remotevideo.src=null;
localvideo.src=null;
mypeer.close();
mypeer=null;
}
document.getElementById("hangup-button").disabled=true;
targetusername=null;
}

function handlehungupmsg(msg){
closevideocall();
}

function hungupcall(){
closevideocall();
sendtoserver({name:myusername, target: targetusername, type:"hang-up"});
}

function invite(evt){
if(mypeer){
alert("you can't start a call cause you already have one open!");
}else{
var clickedusername='gru5';//evt.target.textContent;
if(clickedusername===myusername){
//alert("i'm afraid i can't let you talk to yourself");
//return;
}
targetusername=clickedusername;
createPeerConnection();
console.log('inviting');

navigator.mediaDevices.getUserMedia(mediaconstraints)
.then(function(localstream){
console.log('kuku');
document.getElementById("local_video").src=window.URL.createObjectURL(localstream);
document.getElementById("local_video").srcObject=localstream;
if(hasAddTrack){
console.log('has track');
localstream.getTracks().forEach(track=>mypeer.addTrack(track,localstream));
}else{
console.log('has assstream');
mypeer.addStream(localstream);
}
}).catch(handlegetusermediaerror);

/*
getdevicestream(mediaconstraints).then(function(stream){
playvideo(document.getElementById('local_video'),stream);
}).catch(function(e){

console.log(e);return;})*/

}
}

function getdevicestream(options){
if('getUserMedia' in navigator.mediaDevices){
console.log('navigator mediadevices getusermedia');
return navigator.mediaDevices.getUserMedia(options);
}else{console.log('wrap navig med devices with promise');
return new Promise(function(res,rej){
navigator.getUserMedia(options,res,rej);
})
}
}
function playvideo(element,stream){
if('srcObject' in element){console.log('srcobject');element.srcObject=stream;}else{
console.log('fuck');
element.src=window.createObjectURL(stream);
}
element.play();
element.volume=0;
}

function handlevideooffermsg(msg){
var localstream=null;
targetusername=msg.name;
console.log('handle video offer msg');
createPeerConnection();
var desc=new RTCSessionDescription(msg.sdp);
mypeer.setRemoteDescription(desc).then(function(){
return navigator.mediaDevices.getUserMedia(mediaconstraints);
}).then(function(stream){
localstream=stream;
document.getElementById('local_video').src=window.URL.createObjectURL(localstream);
document.getElementById('local_video').srcObject=localstream;
if(hasAddTrack){
console.log('has track');
localstream.getTracks().forEach(track=>mypeer.addTrack(track,localstream));
}else{
console.log('has addstream');
mypeer.addStream(localstream);}
})
.then(function(){
return mypeer.createAnswer();
})
.then(function(answer){
return mypeer.setLocalDescription(answer);
})
.then(function(){
var msg={
name:myusername,
target:targetusername,
type:"video-answer",
sdp:mypeer.localDescription
};
sendtoserver(msg)
}).catch(handlegetusermediaerror);
}

function handlevideoanswermsg(msg){
var desc=new RTCSessionDescription(msg.dsp);
mypeer.setRemoteDescription(desc).catch(reporterror);
}

function handlenewicecandidatemsg(msg){
//if(mypeer==null)return;
var cand=new RTCIceCandidate(msg.candidate);
//mypeer.addIceCandidate(cand).catch(reporterror);
}

function handlegetusermediaerror(e){
switch(e.name){
case "NotFoundError":
alert("Unable to open your call cause no camera and or micrphone were found");
break;
case "SecurityError":
case "PermissionDeniedError":
break;
default:
alert("error opening yoour camera or microphone"+e.name);
break;
}
closevideocall();
}
function reporterror(er){
console.log(er.name+' '+er.message);
}
































































</script>
</main><footer id="footer">${footer.footer({})}</footer>
</body>
</html>`;
}
module.exports={busers};