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
</div><br>

<br>
<div class="modrtc">
<h4>You</h4>
<b>As</b> <span id="yourName">${buser ? buser.nick:'a Guest'}</span><br>
<b>Email: </b><span id="yourEmail">${buser ? buser.email:""}</span><br>
<b>Tokens: </b><span id="yourTokens">${buser ? buser.items:''}</span><br>
<b>your websocket id: </b><span id="yourWebsocketId"></span><br>
</div><br>
<div class="firstchild" id="camera-container">
<div class="camera-box">
<div><h4>local video</h4><video id="localvideo" autoplay muted style="width:250px;height:250px;border:2px solid green;"></video></div>
<div><h4>remote video</h4><video id="remotevideo" autoplay style="width:250px;height:250px;border:2px solid red;"></video></div>

<button id="hangupbtn">Hung Up</button>
</div>
</div>



<div>
<button onclick="get_one();">send tips</button><br><br>
<button onclick="get_room();">privat</button> <span id="tokpermin">10</span> tokens/min<br><br>

</div>
Time: <span id="mer">00:00:00</span><br><br>
<input type="text" id="name" value="" placeholder="your name"><button onclick="do_socket();">connect websocket</button>
<h5>Userlist</h5>
<div id="userlist"></div>
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


<div id="subscribe"></div>
<br><b>WebRTC errors:</b><br>
<span id="rtcerror"></span><br>
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
out.innerHTML=this.response;;
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
//<input type="text" id="name" value="" placeholder="your name"><button onclick="do_socket();">connect websocket</button>
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

socket=new WebSocket(new_uri+'//'+loc3+'/'+modelName.textContent);
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

fuck.onclick=function(){
//alert('fuck');
var outm={};
outm.room=modelName.textContent;
outm.type="create_room";
outm.msg="Creating a room";
socket.send(JSON.stringify(outm));
}





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
 var config = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'},{'urls': 'stun:stun.l.google.com:19302'},
{'urls':'turn:numb.viagenie.ca','username':'gru5@yandex.ru','credential':'bischt'}
]};

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
if(calltousername.length>0){
connecteduser=calltousername;
pc.createOffer(function(offer){
sendtoserver({type:'offer',offer:offer, name:myusername})
pc.setLocalDescription(offer);
},function(err){console.error(err);
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
pc.setRemoteDescription(offer);
console.log('offer: ',offer.sdp);
pc.createAnswer(function(answer){
pc.setLocalDescription(answer);
sendtoserver({type:'answer',answer:answer})
},function(er){console.error(er);
rtcerror.innerHTML+=er+'<br>';
})
}).catch(function(er){console.error(er);
rtcerror.innerHTML+=er.name+'<br>';
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
//if(!pc.signalingState=='closed'){
console.log('pc: ',pc.signalingState);
pc.close();
pc.onicecandidate=null;
pc.onaddstream=null;
pc.onremovestream=null;
pc=null;
//}
}


function gid(id){return document.getElementById(id);}
</script>
</main><footer id="footer">${footer.footer({})}</footer>
</body>
</html>`;
}
module.exports={busers};