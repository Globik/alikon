//demo_videostream.js
const head=require('./head'),
    header_menu=require('./header_menu'),
	admin_main_menu=require('./admin_main_menu'),
    footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;

const demo_videostream = n=>{
	let {model,showmodule:{mainmenu,profiler}}=n;const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- busers.js -->
<head>${head.head({title:"video_stream", csslink:"/css/main2.css"})}</head>
<body>${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap"> 

	<a href="/">home</a><br>
	<a href="/al.html" target="_blank">al.html</a><br>
<h3>Watch and Talk.</h3>
<b>Owner:</b><span id="owner"></span><br>
<b>current room: </b><span id="curentroom"></span><br>
<b>current user: </b><span id="curentuser"></span><br>
<form name="setuser"><b>Wanna to streaming? Check this checkbocks</b><input type="checkbox" name="ifstreamer"/><br>
<b>current user:</b><input type="text" id="username" name="username" placeholder="your name" value="Balice" required/>
<input type="submit" value="connect websocket"/>
</form><br>
<form name="setroomname"><b>Room name:</b><input type="text" id="roomname" name="roomname" value="Alice" required/>
<input type="submit" value="create room"/>
</form>
<br><!-- <button onclick="createroom();">create room</button> -->
<button onclick="deleteroom();">delete room</button><br>
<b>websocket id:</b><span id="wsid"></span><br>
<b>websocket info: </b><span id="wsout"></span><br>
<h4>List of rooms: </h4>
<div id="roomslist"></div>
<hr>
<div id="localcontainer">
<button id="start_video_button" onclick="startVideo();">Start Video</button>
<button id="stop_video_button" onclick="stopVideo();">Stop Video</button>
</div>
<button id="connect_button"  onclick="connect();">Connect</button>
<button id="disconnect_button"  onclick="dissconnect();">Disconnect</button> 
<input type="checkbox" id="plan_b_check" >planB<br>
<h4>user list</h4>
<div id="userlist"></div>
		
<form name="publish">
<input type="text" name="message">
<input type="submit" value="send to all">
</form>
<form name="mepublish">
<input type="text" name="message">
<input type="submit" value="send for me only">
</form>
<span id="out"></span><br>
<div>
local video<br>
<video id="local_video" autoplay style="width: 160px; height: 120px; border: 1px solid black;"></video>
<span id="state_span"></span>
</div>
remote video<br>
<div id="remote_container"></div>	
		
<script>
document.forms.setuser.onsubmit=function(){
if(this.ifstreamer.checked){
owner.textContent="true";					   
}else{
owner.textContent="false";
localcontainer.style.display="none";
}
if(this.username.value) {
curentuser.textContent=this.username.value;
connect_tows();}
return false;
}
document.forms.setroomname.onsubmit=function(){
if(owner.textContent=="true"){
if(curentuser.textContent){createroom()}
}
return false;
}
  const useTrickleICE = false;
  let localVideo = document.getElementById('local_video');
  let stateSpan = document.getElementById('state_span');
  let localStream = null;
  let peerConnection = null;
  
  // --- prefix -----
  navigator.getUserMedia  = navigator.getUserMedia    || navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia || navigator.msGetUserMedia;
  RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
  RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription;
  // init checkbox
  if (window.window.webkitRTCPeerConnection) {
    document.getElementById('plan_b_check').checked = true;
  }
  // -------- websocket ----  
var clientId=0;
var ws;
var myusername=null;
var name,connecteduser;
var targetusername=null;
var remoteContainer = document.getElementById('remote_container');

var loc1=location.hostname+':'+location.port;
var loc2='alikon.herokuapp.com';
var loc3=loc1 || loc2;
var new_uri;
//alert(window.location.protocol);
if(window.location.protocol==="https:"){
new_uri='wss:';
}else{
new_uri='ws:';
}
//var wsUrl = 'ws://localhost:5000/alice';
var wsUrl=new_uri+'//'+loc3+'/'+'alice'
function connect_tows(){
ws = new WebSocket(wsUrl);
ws.onopen = function(evt) {
console.log('ws open()');
wsout.innerHTML='websocket opened';
};
ws.onerror = function(err) {
console.error('ws onerror() ERR:', err);
wsout.innerHTML=err;
};
ws.onclose=function(){wsout.innerHTML='websocket closed';}
ws.onmessage=go_message;
}  
function go_message(evt) {
let message = JSON.parse(evt.data);
if(message.type==="id"){
clientId=message.id;
wsid.textContent=message.id;
setusername(ws);
}else if (message.type === 'response') {
// --- not used ----
console.warn('NOT USED');
}else if(message.type==="username"){
console.log("case username: "+evt.data);
}else if(message.type==="message"){
out.innerHTML+=evt.data+'<br>';
}else if(message.type==="userlist"){
console.log("case userlist: "+evt.data);
var si='';
message.users.forEach(function(el,i){
si+='<li><span onclick="callrtc(this);">'+el.username+'</span></li>';
})
userlist.innerHTML=si;

}else if(message.type==='genaurum'){
console.warn('On genaurum: ',evt.data);
var sr='';
sr+='<li><span data-pid="'+message.roomid+'">'+message.roomname+'</span>';
roomslist.innerHTML+=sr;
	
}else if(message.type==='roomcreated'){
console.warn('On roomcreated: ',evt.data);
}else if(message.type==='rooming'){
console.log('type rooming: '+evt.data);
}else
if (message.type === 'offer') {
      // -- got offer ---
console.log('Received offer ...');
let offer = new RTCSessionDescription(message);
setOffer(offer);
}
else if (message.type === 'answer') {
      // --- got answer ---
console.log('Received answer ...');
console.warn('NOT USED');
}else if(message.type==='goodbyeroom'){
if(owner.textContent==="true"){
console.log(evt.data);
goodbyeroom(message.vid);
}
}else if(message.type==='error'){
console.error('on error: ',evt.data);
}else if(message.type==='createroom'){
console.error('on createroom: ',evt.data);
}else if(message.type==='roomremove'){
if(owner.textContent==="false"){
console.warn('roomremove: ',evt.data);
}
}else{console.warn('unknown message type: ',message.type);}
}
	 
function setusername(s){
myusername=document.getElementById("username").value;
s.send(JSON.stringify({name:myusername,id:clientId,type:"username",owner:owner.textContent}));
}
	
document.forms.publish.onsubmit=function(){
var outm={};
outm.msg=this.message.value;
outm.id=clientId;
outm.type="message";
ws.send(JSON.stringify(outm));
return false;
}

document.forms.mepublish.onsubmit=function(){
var outm={};
outm.msg=this.message.value;
outm.name=myusername;
outm.id=clientId;
outm.type="message";
outm.target=username.value;
ws.send(JSON.stringify(outm));
return false
}
	
function getUsePlanB() {
let checkbox = document.getElementById('plan_b_check');
return (checkbox.checked === true);
}
  // ---------------------- media handling ----------------------- 
  // start local video
function startVideo() {
if(owner.textContent==="true"){
getDeviceStream({video: true, audio: true})
.then(function (stream) { // success
localStream = stream;
logStream('localstream', stream);
playVideo(localVideo, stream);
updateButtons();
}).catch(function (error) { // error
console.error('getUserMedia error:', error);
return;
});
}
}
  // stop local video
function stopVideo() {
if(owner.textContent==="true"){
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
}
  // -----  signaling ----
function sendSdp(sessionDescription) {
console.log('---sending sdp ---');
const jsonSDP = sessionDescription.toJSON();
jsonSDP.planb = getUsePlanB();
jsonSDP.roomname=roomname.value;
console.log('sending SDP:', jsonSDP);
sendJson(jsonSDP);
}
function sendJson(json) {
const message = JSON.stringify(json);
ws.send(message);  
}
  // ----------------------
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
if(owner.textContent==="false"){addRemoteVideo(stream.id, stream);}else{console.warn('IGNORE remote track');}
}
};
}else {
peer.onaddstream = function(event) {
console.log('-- peer.onaddstream()');
let stream = event.stream;
logStream('remotestream of onaddstream()', stream);
if(owner.textContent==="false"){
addRemoteVideo(stream.id, stream);
}else{
console.warn('IGNORE remote stream');
}
};
}
    // --- on get local ICE candidate
peer.onicecandidate = function (evt) {
if (evt.candidate) {
console.log(evt.candidate);
if (useTrickleICE) {
          // Trickle ICE の場合は、ICE candidateを相手に送る
          // send ICE candidate when using Trickle ICE
console.warn('NOT SUPPORTED YET');
}else {
          // Vanilla ICE の場合には、何もしない
          // do NOTHING for Vanilla ICE
}
} else {
console.log('empty ice event');
if (useTrickleICE) {
          // Trickle ICE の場合は、何もしない
          // do NOTHING for Trickle ICE
}else {
          // Vanilla ICE の場合には、ICE candidateを含んだSDPを相手に送る
          // send SDP with ICE candidtes when using Vanilla ICE
sendSdp(peer.localDescription);
}
}
};
    // --- when need to exchange SDP ---
peer.onnegotiationneeded = function(evt) {
console.log('-- onnegotiationneeded() ---');
console.warn('--- IGNORE ---');
};
    // --- other events ----
peer.onicecandidateerror = function (evt) {
console.error('ICE candidate ERROR:', evt);
};
peer.onsignalingstatechange = function() {
console.log('== signaling state=' + peer.signalingState);
};
peer.oniceconnectionstatechange = function() {
console.log('== ice connection state=' + peer.iceConnectionState);
showState('ice connection state=' + peer.iceConnectionState);
if (peer.iceConnectionState === 'disconnected') {
console.log('-- disconnected --');
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
if(owner.textContent==="false"){
removeRemoteVideo(stream.id, stream);
}else{console.log('ignoring remove stream');}
};
// -- add local stream --
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
        // -- Trickle ICE の場合は、初期SDPを相手に送る --
        // send initial SDP when using Trickle ICE
console.warn('NOT SUPPORTED YET');
}else {
        // -- Vanilla ICE の場合には、まだSDPは送らない --
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
  // start PeerConnection
function connect() {
callWithCapabilitySDP();
updateButtons();
}
function callWithCapabilitySDP() {
peerConnection = prepareNewConnection();
var vopt={ offerToReceiveAudio: false, offerToReceiveVideo: false};
if(owner.textContent==="false"){
vopt.offerToReceiveAudio=true;
vopt.offerToReceiveVideo=true;
}
peerConnection.createOffer(vopt).then(function(sessionDescription){
console.log('createOffer() succsess in callWithCapabilitySDP()');
console.log('calling with Capalibity SDP ..');
var whatsend={type: "call", planb: getUsePlanB(), capability: sessionDescription.sdp,roomname:roomname.value};
if(owner.textContent==="false"){
whatsend.type="call_downstream";
}
sendJson(whatsend);
}).catch(function(err) {
console.error('ERROR in callWithCapabilitySDP():', err);
});
}
	
function createroom(){
console.log('create room');
if(owner.textContent=='true'){
console.log('sending create room');
sendJson({type:"createroom",roomname:roomname.value,owner:owner.textContent,id:clientId});
curentroom.textContent=roomname.value;
}
}
	
function deleteroom(){
if(curentroom.textContent){
sendJson({type:'removeroom',roomname:curentroom.textContent,owner:owner.textContent,id:clientId})
}else{alert('what a room to delete?');}
}
function goodbyeroom(vid){
if(vid){
curentroom.textContent='';
var bud=document.querySelector('[data-pid="'+vid+'"]');
//alert(bud.textContent);
bud.remove();
}
}
  // close PeerConnection
function dissconnect() {
sendJson({type: "bye",roomname:roomname.value});
if (peerConnection) {
console.log('Hang up.');
peerConnection.close();
peerConnection = null;
if(owner.textContent==="false"){removeAllRemoteVideo();}
}else {
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
if(owner.textContent==="true"){
if (peerConnection) {
disableElement('start_video_button');//true
disableElement('stop_video_button');//true
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
}else if(owner.textContent==="false"){
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
let element = document.getElementById(id);
if (element) {element.setAttribute('disabled', '1');}    
}
updateButtons();

function addRemoteVideo(id, stream) {
let element = document.createElement('video');
remoteContainer.appendChild(element);
element.id = 'remote_' + id;
element.width = 320;
element.height = 240;
element.srcObject = stream;
element.play();
element.volume = 0;
element.controls = true;
}
  
function removeRemoteVideo(id, stream) {
console.log(' ---- removeRemoteVideo() id=' + id);
let element = document.getElementById('remote_' + id);
if (element) {
element.pause();
element.srcObject = null;
remoteContainer.removeChild(element);
}else {
console.log('child element NOT FOUND');
}
}
function removeAllRemoteVideo() {
while (remoteContainer.firstChild) {
remoteContainer.firstChild.pause();
remoteContainer.firstChild.srcObject = null;
remoteContainer.removeChild(remoteContainer.firstChild);
}
}
</script>
</main><footer id="footer">${footer.footer({})}</footer>
</body>
</html>`;
}
module.exports={demo_videostream};