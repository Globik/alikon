//busers.js
const head=require('./head'),
    header_menu=require('./header_menu'),
	admin_main_menu=require('./admin_main_menu'),
    footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;

const busers = n=>{
let {model,showmodule:{mainmenu,profiler}}=n;
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- busers.js -->
<head>${head.head({title:"User", csslink:"/css/main2.css"/*,js:[""]*/})}</head>
<body>${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : '')}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:'')}
<style>
/*#pagewrap{
background-image:url("/images/vk.png");
}*/
</style>
<main id="pagewrap"> 
k
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

#mainwrap{display:block;position:relative;background:pink;width:100%;}
#videowrap{width:50%;height:18em;background:lightgreen;float:left;psition:relative;display:block;}
#chatwrap{width:50%; height:18em;background:red;display:block;postion:relative;float:right;}

#local_video{width:100%;height:90%;background:black;}
.fuckvideo::after{content: "The member you are trying to view is currently offline. Please wait or choose another member to view.";
background:rgba(200,0,0,0.1);color:red;left:0;top:0;padding:10px;width:50%;height:auto;position:absolute;
transform:translate(0%,20%);
display:block;}

@media screen and (max-width: 650px) {
.popup{color:red;left:50%;top:50%;width:91%;height:70vmin;}
overlay:target+.popi{left:0;}
#chatwrap{background:lightblue;}
#chatwrap,#videowrap{float:none;width:100%;}
.fuckvideo::after{width:100%;}
#clearwrap{display:none;}
}
	
</style>
<div>
<b>buser: </b>${buser ? true : false}<br><br>

<div><b>obid: </b><span id="pid"></span></div>
<div><b>time: </b><span id="timeinfo"></span></div>

</div>

<sector id="mainwrap">
<div id="videowrap" class="fuckvideo">
<video id="local_video" class="" poster="${n.imgsrc && n.imgsrc !=='no' ? n.imgsrc : ''}" autoplay controls volume='0'>

</video>
</div>
<div id="chatwrap">chatwrap</div>
<div id="clearwrap" style="clear:both;background:brown;">.</div>
</sector>

<!-- model -->
<input type="hidden" id="modelName" value="${model.name}"/>
<input type="hidden" id="modelId" value="${model.id}"/>
<input type="hidden" id="modelEmail" value="${model.email}"/>
<input type="hidden" id="owner" value='${n.owner}'/>
<input type="hidden" id="modelTokens" value="${model.items}"/>

<!-- You -->
<input type="hidden" id="buser" value="${buser ? true : false}"/>
<input type="hidden" id="shortid" value="${n.shortid}"/>
<input type="hidden" id="yourName" value="${buser ? buser.name : ''}"/>

<input type="hidden" id="yourId" value="${buser ? buser.id : ''}"/>
<input type="hidden" id="yourEmail" value="${buser ? buser.email:''}"/>
<input type="hidden" id="yourTokens" value="${buser ? buser.items:''}"/>


<div class="firstchild" id="camera-container">
<div class="camera-box">
<!--
<div><h4>local video</h4><video id="localvideo" autoplay muted style="width:250px;height:250px;border:2px solid green;"></video></div>
<div><h4>remote video</h4><video id="remotevideo" autoplay style="width:250px;height:250px;border:2px solid red;"></video></div>
-->
<button id="hangupbtn">Hung Up</button>
</div>
</div>



<div>
<button onclick="get_one();">send tips</button><br><br>
<button onclick="get_room();">privat</button> <span id="tokpermin">10</span> tokens/min<br><br>

</div>
Time: <span id="mer">00:00:00</span><br><br>

<br>

<br>
<span id="fuckingout"></span>
<br>
<hr><output id="out"></output>

<a href="#" class="overlay" id="resultativ"></a>
<output id="pop" class="popi">
<a href="#" class="close"></a>
<p>Output <a href="/tipping/purchase_tokens">purchase tokens</a></p>
<p>You have <span id="yourTokens2"></span> tokens.</p>
<p><input id="tokTosend" type="number" value="1" placeholder="1"/></p>
<button onclick="send_tokens();">send</button>
</output>
${n.owner ? `
<div id="localcontainer">
<button id="start_video_button" onclick="startVideo();">Start Video</button>
<button id="stop_video_button" onclick="stopVideo();">Stop Video</button>
</div> ` : ''}
<button id="connect_button"  onclick="connect();">Connect</button>
<button id="disconnect_button"  onclick="dissconnect();">Disconnect</button> 
<input type="checkbox" id="plan_b_check" >planB<br>

<!-- local video<br>
<video id="local_video2" autoplay style="width: 160px; height: 120px; border: 1px solid black;"></video> -->
<span id="state_span"></span>
</div>
remote video<br>
<div id="remote_container"></div>	



<form name="publish">
<input type="text" name="message">
<input type="submit" value="send">
</form>
<form name="mepublish">
<input type="text" name="message">
<input type="submit" value="send to only me">
</form>


<div id="subscribe"></div>
<br><b>WebRTC errors:</b><br>
<span id="rtcerror"></span><br>
<br><span id="wso"></span>

<script>
var seat=0;
var init=0;
var pidi=0;
var btype=0;

var startDate,clocker,mlocker, startingDate;
var modelName=gid('modelName').value;
var modelEmail=gid('modelEmail').value;
var modelId=gid('modelId').value;
var modelTokens=gid('modelTokens');

var yourName=gid('yourName').value;
var yourId=gid('yourId').value;
var yourEmail=gid('yourEmail').value;
var yourTokens=gid('yourTokens');

var tokTosend=gid('tokTosend');

yourTokens2.textContent=yourTokens.value;
function buser(){
if(gid('buser').value==='true'){return true;}else{return false;}
}
function owner(){
if(gid('owner').value==='true'){return true;}else{return false;}
}

function send_tokens(){
if(pidi==0)return;
if(buser()){
console.log('buser!')
if(!owner()){
console.log('not owner!')
if(yourTokens.value !="0"){
console.log('tokens not 0');
var data={};
data.from=yourEmail;
data.to=modelEmail;
data.amount=Number(tokTosend.value);
data.type=1;
data.pid=pid.textContent;
console.log('data: ',data)
if(Number(tokTosend.value)<=Number(yourTokens.value)){
console.log('send xhr')
to_xhr(JSON.stringify(data),true);
}else{out.innerHTML="Not enouth tokens!";}
}else{out.innerHTML="Not enough tokens!";}
}else{
console.log('you are an owner!');
out.innerHTML='not selbst!';
}}else{out.innerHTML='Please <a href="/login">log in</a>';}
}

function rechnet(n){
var mata=JSON.parse(n);
modelTokens.value=Number(modelTokens.value)+Number(mata.info.amount);
yourTokens.value-=mata.info.amount;
yourTokens2.textContent-=mata.info.amount;
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
out.innerHTML=this.response;;
if(bool) rechnet(this.response);
}else{
out.innerHTML=this.response+this.status;
}}
xhr.onerror=function(e){out.innerHTML=this.response + ' '+ e};
console.log('sending xhr: ',n);
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
seat=1;
setTimeout(showTime, 1000);
}

function showTime(){
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
if(owner()){
var data={};
data.pid=pidi;
data.type=btype;
data.who=modelEmail;
var xhr=new XMLHttpRequest();
xhr.open('post','/api/set_seat');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
//out.innerHTML=this.response;
console.warn('xhr from server: ',this.response);
}else{
//out.innerHTML=this.response+this.status;
console.error('xhr from server: ',this.response);
}}
xhr.onerror=function(e){out.innerHTML=this.response + ' '+ e};
console.log(JSON.stringify(data));
xhr.send(JSON.stringify(data));
}
}

var mediaconstraints={audio:true,video:true};

var clientId=0;
var myusername=null;
var name,connecteduser;
var targetusername=null;
var pc=null;
var socket=null;
var roomcreated=false;



function setusername(s){
if(owner()){
myusername=modelName;
}else{
if(yourName){myusername=yourName}else{myusername='Guest_'+shortid.value;}
}
if(s)s.send(JSON.stringify({name:myusername,id:clientId, type:"username",owner:owner()}));
}

var loc1=location.hostname+':'+location.port;
var loc2='alikon.herokuapp.com';
var loc3=loc1 || loc2;
var new_uri;
if(window.location.protocol==="https:"){
new_uri='wss:';
}else{
new_uri='ws:';
}

if(buser()){go_socket();}
console.warn('buser: '+buser());

function go_socket(){
if(socket){console.log('scho gibts socket!');return;}
socket=new WebSocket(new_uri+'//'+loc3+'/'+modelId);
socket.onopen=function(){
wso.innerHTML='websocket connected';
}
socket.onmessage=go_message;
socket.onerror=function(e){wso.innerHTML="error: "+e;}
socket.onclose=function(e){wso.innerHTML="closed";socket=null;}
}

function sendtoserver(message){
if(connecteduser){
message.target=connecteduser;}
var msgjson=JSON.stringify(message);
console.log('msgjson: ',msgjson);
if(socket)socket.send(msgjson);
}

document.forms.publish.onsubmit=function(){
var outm={};
outm.msg=this.message.value;
outm.id=clientId;
outm.type="message";
if(socket)socket.send(JSON.stringify(outm));
return false;
}

document.forms.mepublish.onsubmit=function(){
var outm={};
outm.msg=this.message.value;
outm.name=myusername;
outm.id=clientId;
outm.type="message";
outm.target=clientId;
if(socket)socket.send(JSON.stringify(outm));
return false
}

function go_message(event){
var msg=JSON.parse(event.data);
if(msg.type=="id"){
clientId=msg.id;
setusername(socket);
console.log("case id: "+event.data);
}else if(msg.type=="username"){
console.log("case username: "+event.data);
}else if(msg.type=="message"){
//console.log("case message: "+event.data);
showmessage(event.data);
}else if(msg.type=="userlist"){
console.log("case userlist: "+event.data);
if(!owner()){
if(msg.ready){roomcreated=true;console.log('roomcreated: ',roomcreated);
if(msg.pidi && msg.pidi !==0 && msg.pidi !==undefined){
pidi=msg.pidi;
pid.textContent=pidi;
}

}
}

}else if(msg.type=='joined_user'){
console.warn('onJoinedUser: ',event.data);
}else if(msg.type=='Doffer'){
handleoffer(msg.offer,msg.from_target);
}else if(msg.type=='Danswer'){
handleanswer(msg.answer);
}else if(msg.type=='Dcandidate'){
handlecandidate(msg.candidate);
}else if(msg.type=='leave'){
handleleave();
}else if(msg.type=='call_offer'){
//call_offer(msg.name);
call_offer(msg.from_target);
}else if(msg.type=='call_answer'){
//call_answer(msg.name,msg.answ);
call_answer(msg.from_target,msg.answ);
}else if(msg.type=='reject_call'){
//reject_call(msg.name);
reject_call(msg.from_target);

//mediasoup stuff

}else if(msg.type==='onroom'){
console.warn('On created room: ', event.data);
roomcreated=true;
}else if(msg.type==='roomer_online'){
console.warn('on roomer_online: ',event.data);
if(owner()){broadcast();}
}else if(msg.type==='roomer_offline'){
console.warn('on roomer_offline: ',event.data);
pidi=0;seat=0;
if(peerConnection){
console.log('signaling state: ',peerConnection.signalingState)
console.log('ice connection state: ',peerConnection.iceConnectionState);

if(!buser()){dissconnect();if(socket)socket.close();}
}

}else if(msg.type === 'offer') {
console.log('Received offer ...');
let offer = new RTCSessionDescription(msg);
setOffer(offer);
}
else if (msg.type === 'answer') {
console.log('Received answer ...');
console.warn('NOT USED');
}else if(msg.type==='goodbyeroom'){
console.log('type goodbye room came')
if(owner()){
console.log(event.data);
goodbyeroom(msg.vid);
}
}else if(msg.type==='error'){
console.error('on error: ',event.data);
if(msg.num=="101"){

if(!buser()){dissconnect();if(socket)socket.close();}
}
if(peerConnection)console.log(peerConnection.signalingState)
}else if(msg.type==='roomremove'){
if(!owner()){
console.warn('roomremove: ',event.data);
}
}else{console.warn('uknown msg type',msg.type);}

}

function showmessage(message){
var messageelement=document.createElement('div');
messageelement.appendChild(document.createTextNode(message));
subscribe.appendChild(messageelement);
}

const useTrickleICE = false;
  let localVideo = gid('local_video');
  let stateSpan = gid('state_span');
  let localStream = null;
  let peerConnection = null;
  
  navigator.getUserMedia  = navigator.getUserMedia    || navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia || navigator.msGetUserMedia;
  RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
  RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription;
  // init checkbox
  if (window.window.webkitRTCPeerConnection) {
//alert('check true');
    gid('plan_b_check').checked = true;
  }

var clientId=0;
var ws;
var myusername=null;
var name,connecteduser;
var targetusername=null;
var remoteContainer = gid('remote_container');

function getUsePlanB() {
let checkbox = gid('plan_b_check');
return (checkbox.checked === true);
}

function startVideo() {
if(owner()){
getDeviceStream({video: true, audio: true})
.then(function (stream) {
localStream = stream;
logStream('localstream', stream);
playVideo(localVideo, stream);
updateButtons();
}).catch(function (error) { // error
console.error('getUserMedia error:', error);
rtcerror.innerHTML=error;
return;
});
}
}
  // stop local video
function stopVideo() {
if(owner()){
pauseVideo(localVideo);
stopLocalStream(localStream);
localStream = null;
updateButtons();
}
}
function stopLocalStream(stream) {
let tracks = stream.getTracks();
if (! tracks) {
console.warn('NO tracks');
return;
}
for (let track of tracks) {
track.stop();
}
}
  
function getDeviceStream(option) {
if ('getUserMedia' in navigator.mediaDevices) {
console.log('navigator.mediaDevices.getUserMadia');
return navigator.mediaDevices.getUserMedia(option);
}else {
console.log('wrap navigator.getUserMadia with Promise');
return new Promise(function(resolve, reject){    
navigator.getUserMedia(option,resolve,reject);
});      
}
}

function playVideo(element, stream) {
if ('srcObject' in element) {
element.srcObject = stream;
}else {
element.src = window.URL.createObjectURL(stream);
}
element.play();
element.volume = 0;

}

function pauseVideo(element) {
element.pause();
if ('srcObject' in element) {
element.srcObject = null;
}else {
if (element.src && (element.src !== '') ) {
window.URL.revokeObjectURL(element.src);
}
element.src = '';
}
deleteroom();
}
 
function sendSdp(sessionDescription) {
console.log('---sending sdp ---');
const jsonSDP = sessionDescription.toJSON();
jsonSDP.planb = getUsePlanB();
jsonSDP.roomname=modelId;
sendJson(jsonSDP);
}

function sendJson(json) {
var mess = JSON.stringify(json);
if(socket)socket.send(mess);
}

function prepareNewConnection() {
let pc_config = {"iceServers":[]};
let peer = new RTCPeerConnection(pc_config);
    // --- on get remote stream ---
if ('ontrack' in peer) {
peer.ontrack = function(event) {
console.log('-- peer.ontrack()');
let stream = event.streams[0];
logStream('remotestream of ontrack()', stream);
if ( (stream.getVideoTracks().length > 0) && (stream.getAudioTracks().length > 0) ) {
if(!owner()){addRemoteVideo(stream.id, stream);}else{console.warn('IGNORE remote track');}
}
};
}else {
peer.onaddstream = function(event) {
console.log('-- peer.onaddstream()');
let stream = event.stream;
logStream('remotestream of onaddstream()', stream);
if(!owner()){
addRemoteVideo(stream.id, stream);
}else{
console.warn('IGNORE remote stream');
}
};
}

peer.onicecandidate = function (evt) {
if (evt.candidate) {
console.log(evt.candidate);
if (useTrickleICE) {
console.warn('NOT SUPPORTED YET');
}else {
// Vanilla ICEしない
// do NOTHING for Vanilla ICE
}
} else {
console.log('empty ice event');
if (useTrickleICE) {
// Trickle ICEしない
// do NOTHING for Trickle ICE
}else {
// Vanilla ICE
// send SDP with ICE candidtes when using Vanilla ICE
sendSdp(peer.localDescription);
}
}
};

peer.onnegotiationneeded = function(evt) {
console.log('-- onnegotiationneeded() ---');
console.warn('--- IGNORE ---');
};
peer.onicecandidateerror = function (evt) {
console.error('ICE candidate ERROR:', evt);
};
peer.onsignalingstatechange = function() {
console.log('== signaling state=' + peer.signalingState);
};
peer.oniceconnectionstatechange = function() {
console.log('== ice connection state=' + peer.iceConnectionState);
showState('ice connection state=' + peer.iceConnectionState);
if(peer.iceConnectionState==='completed'){
//alert('completed!')
if(owner()){
pidi=obid();
pid.textContent=pidi;
sendJson({type:'online',roomname:modelId,pidi:pidi});
}
}else if(peer.iceConnectionState==='connected'){
if(owner()){
pidi=obid();
pid.textContent=pidi;
sendJson({type:'online',roomname:modelId,pidi:pidi});
}
}else if(peer.iceConnectionState==='closed'){
if(owner()){sendJson({type:'offline', roomname:modelId,pidi:pidi});pidi=0;pid.textContent=pidi;}
}else if(peer.iceConnectionState==='failed'){
pidi=0;pid.textContent=pidi;
if(!buser()){
dissconnect();
if(socket)socket.close();
}
}else if (peer.iceConnectionState === 'disconnected') {
console.warn('-- disconnected --');
if(!owner()){roomcreated=false;pidi=0;pid.textContent=pidi;
if(!buser()){if(socket)socket.close();}
}
dissconnect();
}
};
peer.onicegatheringstatechange = function() {
console.log('==***== ice gathering state=' + peer.iceGatheringState);
};
peer.onconnectionstatechange = function() {
console.log('==***== connection state=' + peer.connectionState);
};
peer.onremovestream = function(event) {
console.log('-- peer.onremovestream()');
let stream = event.stream;
if(owner()){
removeRemoteVideo(stream.id, stream);
}else{console.log('ignoring remove stream');}
};
if (localStream) {
console.log('Adding local stream...');
peer.addStream(localStream);
}else {
console.warn('no local stream, but continue.');
}
return peer;
}

function setOffer(sessionDescription) {
let waitForCandidates = true;
if (peerConnection) {
console.log('peerConnection alreay exist, reuse it');
if (peerConnection.remoteDescription && (peerConnection.remoteDescription.type === 'offer')) {
// got re-offer, so DO NOT wait for candidates even using Vanilla ICE
waitForCandidates = false;
}
}else {
console.log('prepare new PeerConnection');
peerConnection = prepareNewConnection();
}
peerConnection.setRemoteDescription(sessionDescription).then(function() {
console.log('setRemoteDescription(offer) succsess in promise');
makeAnswer(waitForCandidates);
}).catch(function(err) {
console.error('setRemoteDescription(offer) ERROR: ', err);
});
}
  
function makeAnswer(waitForCandidates) {
console.log('sending Answer. Creating remote session description...' );
if (! peerConnection) {
console.error('peerConnection NOT exist!');
return;
}
peerConnection.createAnswer().then(function (sessionDescription) {
console.log('createAnswer() succsess in promise');
return peerConnection.setLocalDescription(sessionDescription);
}).then(function() {
console.log('setLocalDescription() succsess in promise');
if (useTrickleICE) {
// Trickle ICE
// send initial SDP when using Trickle ICE
console.warn('NOT SUPPORTED YET');
}else {
//Vanilla ICE
// wait for ICE candidates for Vanilla ICE
//sendSdp(peerConnection.localDescription);
// if got re-offer, then NO MORE ice candidates will come, so send SDP right now
if (! waitForCandidates) {
sendSdp(peerConnection.localDescription);
}
}
}).catch(function(err) {
console.error(err);
});
}
 
//go_socket();
function connect() {
if(!buser()){go_socket();}
setTimeout(function(){
if(roomcreated){
//alert('is room created? '+roomcreated)
callWithCapabilitySDP();
updateButtons();
}else{
if(!buser()){if(socket)socket.close();}
}
},2000)
}

function callWithCapabilitySDP() {
peerConnection = prepareNewConnection();
var vopt={ offerToReceiveAudio: false, offerToReceiveVideo: false};
if(!owner()){
vopt.offerToReceiveAudio=true;
vopt.offerToReceiveVideo=true;
}
peerConnection.createOffer(vopt).then(function(sessionDescription){
console.log('createOffer() succsess in callWithCapabilitySDP()');
console.log('calling with Capalibity SDP ..');
var whatsend={type: "call", planb: getUsePlanB(), capability: sessionDescription.sdp,roomname:modelId};
if(!owner()){
whatsend.type="call_downstream";
}

sendJson(whatsend);
}).catch(function(err) {
console.error('ERROR in callWithCapabilitySDP():', err);
});
}
	
function createroom(src){
if(owner()){
var vobj={};
vobj.roomname=modelId;
vobj.owner=owner();
vobj.id=clientId;
vobj.email=modelEmail;
vobj.name=modelName;
vobj.src=src;
vobj.type="createroom";
sendJson(vobj);
}
}
	
function deleteroom(){
if(roomcreated){
sendJson({type:'removeroom', roomname:modelId,owner:owner(),id:clientId,email:modelEmail})
}else{console.warn('roomcreated: ',roomcreated);}
}

function goodbyeroom(vid){
if(vid){
var bud=document.querySelector('[data-pid="'+vid+'"]');
bud.remove();
roomcreated=false;
}
}
  
function dissconnect() {
sendJson({type: "bye",roomname: modelId});
if (peerConnection) {
console.log('Hang up.');
peerConnection.close();
peerConnection = null;
if(!owner()){removeAllRemoteVideo();
pidi=0;pid.textContent=pidi;
if(!buser()){if(socket)socket.close();}
}
}else{
console.warn('peer NOT exist.');
}
updateButtons();
}
  
function showState(state) {
stateSpan.innerText = state;
}
function logStream(msg, stream) {
console.log(msg + ': id=' + stream.id);
let videoTracks = stream.getVideoTracks();
if (videoTracks) {
console.log('videoTracks.length=' + videoTracks.length);
videoTracks.forEach(function(track) {
console.log(' track.id=' + track.id);
});
}
let audioTracks = stream.getAudioTracks();
if (audioTracks) {
console.log('audioTracks.length=' + audioTracks.length);
audioTracks.forEach(function(track) {
console.log(' track.id=' + track.id);
});
}}
function updateButtons() {
if(owner()){
if (peerConnection) {
disableElement('start_video_button');
disableElement('stop_video_button');
disableElement('connect_button');
enabelElement('disconnect_button');
disableElement('plan_b_check');
}else {
if (localStream) {
disableElement('start_video_button');
enabelElement('stop_video_button');
enabelElement('connect_button');
}else {
enabelElement('start_video_button');
disableElement('stop_video_button');
disableElement('connect_button');        
}
disableElement('disconnect_button');
enabelElement('plan_b_check');
}
}else if(!owner()){
if(peerConnection){
disableElement('connect_button');
enabelElement('disconnect_button');
disableElement('plan_b_check');
}else{
enabelElement('connect_button');
disableElement('disconnect_button');
enabelElement('plan_b_check');
}
}else{console.log('nothing in else update button');}
}
function enabelElement(id) {
let element = document.getElementById(id);
if (element) {element.removeAttribute('disabled');}
}

function disableElement(id) {
let element = gid(id);
if (element) {element.setAttribute('disabled', '1');}    
}

updateButtons();

function addRemoteVideo(id, stream) {
/*let element = document.createElement('video');
remoteContainer.appendChild(element);
element.id = 'remote_' + id;
element.width = 320;
element.height = 240;
element.srcObject = stream;
console.warn('addremotevideo');
element.play();
element.volume = 0;
element.controls = true;
*/
localVideo.srcObject=stream;
}
  
function removeRemoteVideo(id, stream) {
/*console.log(' ---- removeRemoteVideo() id=' + id);
let element = gid('remote_' + id);
if (element) {
element.pause();
element.srcObject = null;
remoteContainer.removeChild(element);
}else {
console.log('child element NOT FOUND');
}*/
localVideo.pause();
localVideo.srcObject=null;
localVideo.src='';
}

function removeAllRemoteVideo() {
while (remoteContainer.firstChild) {
remoteContainer.firstChild.pause();
remoteContainer.firstChild.srcObject = null;
remoteContainer.removeChild(remoteContainer.firstChild);
}
}

function get_image(){
var cnv=document.createElement('canvas');
let w=300;
let h=200;
cnv.width=w;
cnv.height=h;
//local_video.width=130;
//local_video.height=130;
//alert(cnv.width+' '+cnv.height+' '+local_video.width+', '+local_video.height)
var c=cnv.getContext("2d");
c.drawImage(local_video,0,0,w,h);
setTimeout(function(){
var li=cnv.toDataURL('image/png',1.0);
var emg=document.createElement('img');
emg.src=li;
pagewrap.appendChild(emg);
createroom(li);
},10)
}

local_video.onloadedmetadata=function(e){
if(owner())get_image();
}
function gid(id){return document.getElementById(id);}
</script>
</main><footer id="footer">${footer.footer({})}</footer>
</body>
</html>`;
}
module.exports={busers};