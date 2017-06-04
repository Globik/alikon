//demo_webrtc.js
const head=require('./head'),
    header_menu=require('./header_menu'),
	admin_main_menu=require('./admin_main_menu'),
    footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;

const demo_webrtc = n=>{
	let {model,showmodule:{mainmenu,profiler}}=n;const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- busers.js -->
<head>${head.head({title:"demo_webrtc", csslink:"/css/main2.css"})}</head>
<body>${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap"> 
<div class="firstchild" id="camera-container">
<div class="camera-box">
<div><h4>local video</h4><video id="localvideo" autoplay muted style="width:250px;height:250px;border:2px solid green;"></video></div>
<div><h4>remote video</h4><video id="remotevideo" autoplay style="width:250px;height:250px;border:2px solid red;"></video></div>

<button id="hangupbtn">Hung Up</button>
</div>
</div>
<input type="text" id="name" value="" placeholder="your name"><button onclick="do_socket();">connect websocket</button>
<br>
<button onclick="xir();">get xir</button><button onclick="bonfigu();">bonfig</button>
<br>
<span id="fuckingout"></span>
<br>
<h5>Userlist</h5>
<div id="userlist"></div>
<hr><output id="out"></output>
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
</main><footer id="footer">${footer.footer({})}</footer>
<script>
var mediaconstraints={audio:true,video:true};

var clientId=0;
var myusername=null;
var name,connecteduser;
var targetusername=null;
var pc=null;
var socket=null;
function do_socket(){
go_socket();
//return false;
}

var hasAddTrack=false;
//navigator.getUserMedia  = navigator.getUserMedia    || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription;

function setusername(s){
/*
if(owner.textContent==="true"){
myusername=modelName.textContent;//document.getElementById("name").value;
modelWebsocketId.textContent=clientId;
}else{
document.getElementById("yourWebsocketId").textContent=clientId;
if(yourName.textConent==="a Guest"){myusername="Guest"}else{myusername=yourName.textContent;}
}
*/
//alert(document.getElementById("name").value);
myusername=document.getElementById("name").value;
s.send(JSON.stringify({name:myusername,id:clientId,type:"username",owner:'bla'/*owner.textContent*/}));
}

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
function go_socket(){

socket=new WebSocket(new_uri+'//'+loc3+'/'+'pinupgirl');
socket.onopen=function(){
wso.innerHTML='websocket connected';
}
socket.onmessage=go_message;
socket.onerror=function(e){wso.innerHTML="error: "+e;}
socket.onclose=function(e){wso.innerHTML="closed";}
}

function sendtoserver(message){
if(connecteduser){
message.target=connecteduser;}
var msgjson=JSON.stringify(message);
console.log('msgjson: ',msgjson);
socket.send(msgjson);
}

/*
fuck.onclick=function(){
//alert('fuck');
var outm={};
outm.room=modelName.textContent;
outm.type="create_room";
outm.msg="Creating a room";
socket.send(JSON.stringify(outm));
}
*/




document.forms.publish.onsubmit=function(){
var outm={};
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
outm.id=clientId;
outm.type="message";
outm.target=gid('name').value;//modelName.textContent;

socket.send(JSON.stringify(outm));
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
var si='';
msg.users.forEach(function(el,i){
si+='<li><span onclick="callrtc(this);">'+el.username+'</span></li>';
})
userlist.innerHTML=si;

}else if(msg.type=='offer'){
handleoffer(msg.offer,msg.name);
}else if(msg.type=='answer'){
handleanswer(msg.answer);
}else if(msg.type=='candidate'){
handlecandidate(msg.candidate);
}else if(msg.type=='leave'){
handleleave();
}else if(msg.type=='call_offer'){
call_offer(msg.name);
}else if(msg.type=='call_answer'){
call_answer(msg.name,msg.answ);
}else if(msg.type=='reject_call'){
reject_call(msg.name);
}else{console.warn('uknown msg type',msg.type);}
showmessage(event.data);
}

function showmessage(message){
var messageelement=document.createElement('div');
messageelement.appendChild(document.createTextNode(message));
subscribe.appendChild(messageelement);
}

//webrtc one to one
/* var config = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'},{'urls': 'stun:stun.l.google.com:19302'},
{'urls':'turn:numb.viagenie.ca','username':'gru5@yandex.ru','credential':'bischt'}
]};*/
var bonfig={"iceServers":[{"url":"stun:stun.l.google.com:19302"}
,{"username":"gru5@yandex.ru","credential":"bischt","url":"turn:numb.viagenie.ca?transport=udp"},
{"username":"gru5@yandex.ru","credential":"bischt","url":"turn:numb.viagenie.ca?transport=tcp"}
]};
var config={"iceServers":[]};
function callrtc(el){
if(myusername==el.textContent){return;}
socket.send(JSON.stringify({name:myusername,target:el.textContent,type:"call_offer"}));
}

function call_offer(name){
if(confirm('User '+name+' sent you a call. Accept?')){
socket.send(JSON.stringify({type:"call_answer",answ:true,target:name,name:myusername}));
}else{
socket.send(JSON.stringify({type:"call_answer",answ:false,target:name,name:myusername}));
}
}

function call_answer(name,isok){
console.log('call_answer: ',name, isok);
if(isok){
go_webrtc(name);
}else{
socket.send(JSON.stringify({type:"reject_call",name:myusername,target:name}))
}
}
			
function reject_call(name){
console.warn('User '+name+' rejected your call!');
}

function go_webrtc(name){
//if(el.textContent===myname.value){alert('u cant talk to yourself');return;}
if(name==gid('name').value){alert('u cant talk to yourself');return;}
if(pc !=null){console.error('pc gibt es');console.log('pc: ',pc);return;}  
//var calltousername=el.textContent;
var calltousername=name;
//alert(calltousername);		
navigator.mediaDevices.getUserMedia({video:true,audio:false}).then(function(mstream){
				
localvideo.srcObject=mstream;
				
pc=new RTCPeerConnection(config);
pc.addStream(mstream);
pc.onaddstream=function(e){
remotevideo.srcObject=e.stream;
}
pc.onremovestream=function(){
handleleave();
console.log('on remove stream');					
}
pc.onicecandidate=function(event){
if(event.candidate){
sendtoserver({type:'candidate',candidate:event.candidate})
}
}

pc.oniceconnectionstatechange=function(ev){
if(pc){
console.log('ice connection state changed to: '+pc.iceConnectionState);
rtcerror.innerHTML+='ice connect state: '+pc.iceConnectionState+'<br>';
}
}

if(calltousername.length>0){
connecteduser=calltousername;
pc.createOffer().then(function(offer){
//sendtoserver({type:'offer',offer:offer, name:myusername})
 return pc.setLocalDescription(offer);
}).then(function(){
sendtoserver({type:'offer',offer:pc.localDescription, name:myusername})
}).catch(function(err){console.error(err);
rtcerror.innerHTML+=err+'<br>';
})
}
}).catch(function(er){console.error(er);
rtcerror.innerHTML+=er.name+'<br>';
})
}

function handleoffer(offer,name){
//if(pc){console.error('pc gibt es');return;}  
connecteduser=name;
			
navigator.mediaDevices.getUserMedia({video:true,audio:false}).then(function(stream){	

localvideo.srcObject=stream;
				
pc=new RTCPeerConnection(config);
pc.addStream(stream);
pc.onaddstream=function(e){
remotevideo.srcObject=e.stream;
}
pc.onremovestream=function(){
handleleave();
console.log('on remove stream');
}
pc.onicecandidate=function(event){
if(event.candidate){
sendtoserver({type:'candidate',candidate:event.candidate})
}
}
pc.oniceconnectionstatechange=function(ev){
if(pc){
console.log('ice connection state changed to: '+pc.iceConnectionState);
rtcerror.innerHTML+='ice connect state: '+pc.iceConnectionState+'<br>';
}
}
pc.setRemoteDescription(offer).then(function(){
//console.log('offer: ',offer.sdp);
return pc.createAnswer().then(function(answer){
return pc.setLocalDescription(answer);}).then(function(){
sendtoserver({type:'answer',answer:pc.localDescription})
}).catch(function(er){console.error(er);
rtcerror.innerHTML+=er+'<br>';
})
}).catch(function(er){console.error(er);
rtcerror.innerHTML+=er.name+'<br>';
})
})
}
			
function handleanswer(answer){
console.log('ANSWER: ',answer.sdp);
pc.setRemoteDescription(answer);
}
			
function handlecandidate(cand){
console.log('candidate came',cand);
if(pc)pc.addIceCandidate(cand).then(function(){
console.log('ice success');
rtcerror.innerHTML+='ice success<br>';
},function(e){console.error('ice: ',e);rtcerror.innerHTML+=e+'<br>';});
}
			
hangupbtn.addEventListener('click', function(){
sendtoserver({type:'leave'});
handleleave();
})
			
function handleleave(){
connecteduser=null;
if(remotevideo.srcObject){
remotevideo.srcObject.getTracks().forEach(function(track){track.stop();})
}
if(localvideo.srcObject){
localvideo.srcObject.getTracks().forEach(function(track){track.stop();})
}
remotevideo.src=null;
localvideo.src=null;
if(!pc.signalingState=='closed'){
console.log('pc: ',pc.signalingState);
pc.close();
pc.onicecandidate=null;
pc.onaddstream=null;
pc.onremovestream=null;
pc=null;
}
}

function xir(){
var ident="rony";
var secret="ff6a4897-e05c-4a19-9d2d-f555857a024a";
var domain="alikon.herokuapp.com";
//var domain="localhost:5000";
var application="default";
var room="default";
var secure=1;
var xhr=new XMLHttpRequest();
xhr.open("POST",/*"https://api.xirsys.com/getIceServers"*/'https://service.xirsys.com/ice',true);//getIceServers
var params='ident='+encodeURIComponent(ident)+'&secret='+encodeURIComponent(secret)
+'&domain='+encodeURIComponent(domain)+
'&application='+encodeURIComponent(application)+
'&room='+encodeURIComponent(room)+
'&secure='+encodeURIComponent(secure);
xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	 
xhr.onload=function(ev){
if(this.status==200){
alert(this.response);
var wedata=JSON.parse(this.response);
//fuckingout.innerHTML=this.response;
fuckingout.innerHTML=wedata.d;
//customConfig=data.d;
config=wedata.d;
	// alert('data.d : '+wedata.s);
}else{out.innerHTML=this.response;}}
xhr.onerror=function(e){alert(e);}
xhr.send(params);
}
function bonfigu(){
//alert(1);
config=bonfig;
}
function gid(id){return document.getElementById(id);}
</script>
</body>
</html>`;
}
module.exports={demo_webrtc};