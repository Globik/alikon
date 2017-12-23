var seat=0,init=0,pidi=0,btype=0,myusername=null,ignory=new Set(),conn_timeout=0;
var startDate,clocker,mlocker, startingDate;

var txarComplain=gid("txar-complain"),
complainiSelector=gid("complaini-selector"),
modelName=gid('modelName').value,modelId=gid('modelId').value,modelTokens=gid('modelTokens'),
yourName=gid('yourName').value,yourId=gid('yourId').value,yourTokens=gid('yourTokens'),tokTosend=gid('tokTosend'),
submitChat=document.querySelector('#underchat input[type=submit].subm-state'),loginstr=gid('loginstr'),localVideo = gid('local_video'),
vidW=gid('video-wrapper'),str_langsam_stop=gid('str_langsam_stop').value,str_emergency_stop=gid('str_emergency_stop').value;

yourTokens2.textContent=yourTokens.value;
function buser(){
if(gid('buser').value==='true'){return true;}else{return false;}
}
function owner(){
if(gid('owner').value==='true'){return true;}else{return false;}
}
function ink(){
if(gid('inkognito').value==='true'){return true;}else{return false;}
}
function is_banned(){
if(gid('is_banned').value==='yes'){return true;}else{return false;}
}
function is_langsam_stop(){
if(gid('langsam_stop').value==='true'){return true;}else{return false;}
}
function send_tokens(){
if(pidi==0){message_box("user is offline");return;}
if(buser()){
console.log('buser!')
if(!owner()){
console.log('not owner!')
if(yourTokens.value !="0"){
console.log('tokens not 0');
var data={};
data.from=yourId;
data.to=modelId;
data.amount=Number(tokTosend.textContent);
data.btype=1;
data.type="money_trans";
data.pid=pid.textContent;
data.from_nick=yourName;
data.msg=toki_s(data.amount);
data.roomname=modelName;
if(Number(tokTosend.textContent)<=Number(yourTokens.value)){
console.log('send token via Websoket')
to_xhr(data);
}else{out.innerHTML="Not enouth tokens!";}
}else{out.innerHTML="Not enough tokens!";}
}else{
console.log('you are an owner!');
out.innerHTML='not selbst!';
}}else{
out.innerHTML='Please <a href="/login">log in</a>';
}
}


function vor_login(){
vorlogincontainer.innerHTML=loginstr.value;
var col=window.getComputedStyle(gid('loginery-wrap'),null).getPropertyValue('background');
vorlogin.style.background=col;
window.location.href="#vorlogery";
}

function rechnet(amount){
modelTokens.value=Number(modelTokens.value)+Number(amount);
yourTokens.value-=amount;
yourTokens2.textContent-=amount;
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

var balu=false;
var btnok=document.querySelector('.btnok');
var btnotok=document.querySelector('.btnnotok');
var r=document.querySelector('#pop button');
var ptokenstosend=document.querySelector('.ptokenstosend');

function to_xhr(n){
balu=true;
if(r)r.classList.toggle('btnajx');
ptokenstosend.style.background="black";
console.log('sending token: ',n);
sendJson(n);
var xhr=new XMLHttpRequest();
xhr.open("POST","/api/set_transfer");
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
var m=JSON.parse(this.response);
success_token_transfer(m.amount)
}else{
console.error('xhr from server: ',this.response);
unsucces_token_transfer(this.response);
}}
xhr.onerror=function(e){console.error(e)};
xhr.send(JSON.stringify(n));
	
}


function success_token_transfer(amount_token){
if(r)r.classList.toggle('btnajx');
ptokenstosend.style.background="initial";
tokTosend.classList.add('extra');
btnok.classList.add('extra');
balu=true;
outi.innerHTML='<b class="ok-info">Thank you!</b>';
rechnet(amount_token);
//setTimeout(close_tokensblatt,1000);
}

function unseccess_token_transfer(resu){
if(r)r.classList.toggle('btnajx');
btnotok.classList.add('notok');
ptokenstosend.style.background="initial";
outi.innerHTML='<b class="er-info">Error occured! '+resu+'</b>';
setTimeout(close_tokensblatt,1000);
}

function close_tokensblatt(){
window.location.href='#';
}
function get_complain(el){
window.location.href="#get_complaini";
}
var sendabusi=0;
function send_abuse(){
	sendabusi++;
var a=complainiSelector.value;
var b=txarComplain.value;
var c=modelId;
var d={};
var e=myusername;
d.selector=a;d.text=b;d.us_id=c;d.who=e;
var j=JSON.stringify(d);
var xhr=new XMLHttpRequest();
xhr.open('post','/api/send_abuse');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
console.warn('xhr from server: ',this.response);
}else{
console.error('xhr from server: ',this.response);
}}
xhr.onerror=function(e){console.error(e)};
xhr.send(j);
var ru={};
ru.m=sendabusi;
ru.who=myusername;
if(!localStorage.abuse){localStorage.abuse=JSON.stringify(ru);}else{localStorage.abuse=JSON.stringify(ru);}
console.error('abusi: ',localStorage.abuse,' : ',JSON.parse(localStorage.abuse).who,' : ',JSON.parse(localStorage.abuse).m);
}


function tip(){
if(pidi==0){
message_box('No broadcasting of this user at the moment!');
return;
}
if(is_langsam_stop()){message_box(str_langsam_stop);return;}
if(buser()){
window.location.href="#resultativ";
tokTosend.textContent='';
reset_send_tok_style();}else{
vor_login();
}
}

function reset_send_tok_style(){
if(tokTosend.classList.contains('extra')){
tokTosend.classList.remove('extra');
}
if(btnotok.classList.contains('notok')){
btnotok.classList.remove('notok');
}
if(btnok.classList.contains('extra')){btnok.classList.remove('extra');}
outi.innerHTML='';
}

var boxis=document.querySelectorAll('.zbox');
for(var i=0;i<boxis.length;i++){
var boxi=boxis[i];
boxi.addEventListener('click', fertig_tok);
}
		
function fertig_tok(ev){
if(ev.target.textContent !=='backspace'){
if(tokTosend.textContent.length > 2)return;
if(balu){tokTosend.textContent='';balu=false;}
reset_send_tok_style();
tokTosend.textContent+=ev.target.textContent;
}else{
var str=tokTosend.textContent;
var fi=str.slice(0,-1);
tokTosend.textContent=fi;
}
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
//startingDate=new Date();
sendxhr();
}

function sendxhr(){
if(owner()){
var data={};
data.pid=pidi;
data.type=btype;
data.who=modelName;
var xhr=new XMLHttpRequest();
xhr.open('post','/api/set_seat');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
console.warn('xhr from server: ',this.response);
}else{
console.error('xhr from server: ',this.response);
}}
xhr.onerror=function(e){out.innerHTML=this.response + ' '+ e};
console.log(JSON.stringify(data));
xhr.send(JSON.stringify(data));
}
}
var mediaconstraints={audio:true,video:true};

var clientId=0;
//var myusername=null;
var name,connecteduser;
var targetusername=null;
var pc=null;
var socket=null;
var roomcreated=false;
var whoaccept=0;

function get_ops(){
// 1 - no guest; 2 - no guest, no user width no tokens
if(owner()){
if(is_local_storage()){
if(localStorage.chatac)return Number(localStorage.chatac);
}else{return 0;}
}else{return 0;}
}

function setusername(s){
if(owner()){
myusername=modelName;
}else{
if(yourName){myusername=yourName}else{myusername='Guest_'+shortid.value;}
}
if(s)s.send(JSON.stringify({name:myusername,id:clientId, type:"username",owner:owner(),room:modelName}));
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
submitChat.disabled=true;
function go_socket(){
if(!window.WebSocket)return;
if(socket){console.log('scho gibts socket!');return;}
socket=new WebSocket(new_uri+'//'+loc3+'/'+modelName);
socket.onopen=function(){
submitChat.disabled=false;
wso.innerHTML='websocket connected';
}
socket.onmessage=go_message;
socket.onerror=function(e){wso.innerHTML="error: "+e;}
socket.onclose=function(e){wso.innerHTML="closed";socket=null;
submitChat.disabled=true;
submitChat.value="closed";
}
}

function sendtoserver(message){
if(connecteduser){
message.target=connecteduser;}
var msgjson=JSON.stringify(message);
console.log('msgjson: ',msgjson);
if(socket)socket.send(msgjson);
}
var to=10;
document.forms.publish.onsubmit=function(){
try{
console.log('whoaccept: '+whoaccept)
	
if(whoaccept===1){
if(!owner()){
if(!buser()){insert_message('<span class="chat-message">This room only allows users to chat if they are logged in.</span>');
return false;}}
}else if(whoaccept===2){
//alert('PIZDA! '+Number(yourTokens.value))
if(yourTokens.value && Number(yourTokens.value) > 1){console.log('what?');}else{
if(!owner())insert_message('<span class="chat-message">This room only allows members to chat if they have tokens.</span>');return false;}
			 
}else{console.log('fuck knows what is chat.accept must be');}

var outm={};
outm.msg=this.message.value;
outm.id=clientId;
outm.from_nick=myusername;
outm.roomname=modelName;
outm.type="message";
if(this.message.value){
try{
sendJson(outm);
set_chat_btn_green();
}catch(e){console.error(e);}
}
return false;
}catch(e){console.error(e);return false;}
}
function set_chat_btn_green(){
submitChat.classList.toggle('waiting');
}
/*
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
*/
function sendtome(){
var d={}
d.msg="Test target message";
d.username=myusername;
d.roomname=modelName;
d.from_nick=myusername;
d.target=myusername;
d.type="message";
sendJson(d)
}
function send_btc_cb(){
	//alert('a?');
var d={};
	d.type="bitaps_cb";
	d.btc=0.05;
	d.target="globik";
	d.omg="hali halo";
	sendJson(d);
}
function go_message(event){
	//console.log(event.data)
	try{
var msg=JSON.parse(event.data);
	}catch(e){console.error(e);alert(e);return;}
if(msg.type=="id"){
clientId=msg.id;
setusername(socket);
console.log("case id: "+event.data);
}
else if(msg.type=="message"){
	//console.log(msg);
if(!find_ignor(ignory,msg.from_nick))showmessage(msg);
if(msg.admin_type){
if(msg.admin_type=="stop_broadcast"){
console.log("stop broadcast!");
if(owner()){
gid('is_banned').value='yes';
dissconnect();
stopVideo();
vidW.setAttribute('data-banned',class_you_ban.value);
vidW.classList.add('banned');
video_starter.textContent="banned";
video_starter.disabled=true;
}
}else if(msg.admin_type=="you_ban_out"){
if(owner()){
gid('is_banned').value='no';
vidW.classList.remove('banned');
video_starter.textContent="start video";
video_starter.disabled=false;
}
}else{}
}

if(msg.sub_admin_type){
if(msg.sub_admin_type=='us_ban'){
if(!owner()){
vidW.setAttribute('data-banned',class_us_ban.value);
vidW.classList.add('banned');

}
}
}
	
}else if(msg.type=='bitaps_cb'){
	console.log('bitaps_cb : ',event.data)
alert('type bitaps_cb: '+event.data)	
}else if(msg.type=='history'){
//console.warn('on history: ',event.data)
show_history(msg);
}else if(msg.type=='joined_user'){
console.warn('onJoinedUser: ',event.data);
	console.log('msg.chat: ',msg.chataccess)
if(!owner()){
if(msg.chataccess)whoaccept=msg.chataccess;
}
if(!owner()){
if(msg.ready){roomcreated=true;console.log('roomcreated: ',roomcreated);
if(msg.pidi && msg.pidi !==0 && msg.pidi !==undefined){
pidi=msg.pidi;
pid.textContent=pidi;
remove_user_offline();	
	}

}else{roomcreated=false;disableElement('connect_starter');}
}
playSound(sounds.l2.buffer);
rchaters.textContent=msg.mus_cnt;
}else if(msg.type=="out_user"){
console.log('on out_user: ',event.data);
rchaters.textContent=msg.mus_cnt;
}else if(msg.type=='Doffer'){
handleoffer(msg.offer,msg.from_target);
}else if(msg.type=='Danswer'){
handleanswer(msg.answer);
}else if(msg.type=='Dcandidate'){
handlecandidate(msg.candidate);
}else if(msg.type=='leave'){
handleleave();
}else if(msg.type=='call_offer'){

call_offer(msg.from_target);
}else if(msg.type=='call_answer'){

call_answer(msg.from_target,msg.answ);
}else if(msg.type=='reject_call'){

reject_call(msg.from_target);

//mediasoup stuff

}else if(msg.type==='onroom'){
console.warn('On created room: ', event.data);
if(vidW.classList.contains('owner-offline')){
vidW.classList.remove('owner-offline');
vidW.classList.add('owner-onroom');
}	
roomcreated=true;
}else if(msg.type==='roomer_online'){
//console.warn('on roomer_online: ',event.data);
console.log('on roomer_online')
remove_user_offline();

if(owner()){
disableElement('video_starter');
broadcast();
if(vidW.classList.contains('owner-onroom')){vidW.classList.remove('owner-onroom')}
gid('online-detector').classList.toggle('puls');
}else{
if(msg.src){console.log('going to poster');localVideo.poster=msg.src;}
if(msg.ready){enabelElement('connect_starter');pidi=msg.pidy;roomcreated=true;}
//if(msg.chataccess){whoaccept=msg.chataccess;}
}
}else if(msg.type==='roomer_offline'){

console.warn('on roomer_offline: ',event.data);
pidi=0;seat=0;
if(owner()){enabelElement('video_starter');
gid('online-detector').classList.toggle('puls');
vidW.classList.add('owner-onroom');
}else{
disableElement('connect_starter');
localVideo.poster='';
add_user_offline();
}
//add_user_offline();
if(peerConnection){
console.log('signaling state: ',peerConnection.signalingState)
console.log('ice connection state: ',peerConnection.iceConnectionState);

if(!buser()){
dissconnect();
if(ink()){if(socket)socket.close();}
}else{
if(!owner()){
dissconnect();
}

}
}

}else if(msg.type === 'offer') {
console.log('Received offer ...');
var offer = new RTCSessionDescription(msg);
setOffer(offer);
}
else if (msg.type === 'answer') {
console.log('Received answer ...');
console.warn('NOT USED');
}else if(msg.type==='goodbyeroom'){
console.log('type goodbye room came')
if(owner()){
	console.log('goodbyeroom: ', event.data);
	vidW.classList.remove('owner-onroom');
	vidW.classList.add('owner-offline')
	//add_user_offline();
	roomcreated=false;
}


}else if(msg.type==='token_antwort'){
//to all
console.warn('token_answer occured!: ',event.data)
show_event_token(msg);
}else if(msg.type==='error'){
console.error('on error: ',event.data);
	message_box(msg.ename);
if(msg.num=="101"){
if(!buser()){
dissconnect();
if(ink()){if(socket)socket.close();}
}
}
if(peerConnection)console.log(peerConnection.signalingState)
}else if(msg.type==='overfilled'){
console.error(msg);
	//alert(msg);
message_box('Overfilled occured! Limit. No room. No peer. Please wait your turn.');
}else if(msg.type==='emergency_stop'){
if(owner()){dissconnect();stopVideo();}else{dissconnect();}
message_box(str_emergency_stop);
gid('langsam_stop').value="true";
}else if(msg.type==='roomremove'){
if(!owner()){console.warn('roomremove: ',event.data);}
}else if(msg.type=='dump'){
console.log('on dump')
console.error(event.data);
dfucker.innerHTML+=event.data+'<br>';
}else if(msg.type=='stat_room'){
	//alert('stat_room occured!');
console.log('on stat_room: ',event.data);
var c=rview.textContent;
var d=Number(c);
rview.textContent=msg.peers;
if(owner()){
if(msg.peers > d){
playSound(sounds.bell.buffer);
}else{
playSound(sounds.message.buffer);
}
}
}else{console.warn('uknown msg type',msg.type);}
}
var chat=gid('chat'),useTrickleICE=false,stateSpan=gid('state_span'),localStream=null,peerConnection=null;

navigator.getUserMedia=navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
RTCPeerConnection=window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
RTCSessionDescription=window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription;
if (window.window.webkitRTCPeerConnection) {gid('plan_b_check').checked=true;}
var clientId=0,ws,myusername=null,name,connecteduser,targetusername=null,remoteContainer = gid('remote_container'),fl=false;
function getUsePlanB(){return (gid('plan_b_check').checked === true);}
function get_vid(el){
if(is_langsam_stop()){message_box(str_langsam_stop);return;}
if(owner()){
if(is_banned()){message_box("We're sorry you are banned from using this site.");return;}
}
if(!fl){
startVideo(el);
}else{
stopVideo();
el.textContent='start video';
fl=false;
}
}

function show_history(m){
if(m.d && m.d.length > 0){
m.d.forEach(function(el,i){
vr_mess(el.us_name,el.msg)
})
}
}
function vr_mess(nick,msg){

var d=bo_mes(nick,msg);
insert_message(d);
}
function showmessage(message){
console.log('message: ',message);
if(message){
var s=bo_mes(message.from_nick,message.msg);
insert_message(s);
playSound(sounds.l1.buffer);
if(message.from_nick===myusername)set_chat_btn_green();
document.forms.publish.message.value="";
}
}

function bo_mes(from_nick,msg){
var sadmin='';
if(from_nick=='admin'){sadmin=' sadmin';}else if(from_nick=='moderator'){
sadmin=' smoderator';
}else{sadmin='';
	 if(owner())sadmin=' sowner';
	 }
var d='<b class="chat-user'+sadmin+'" data-from_nick="'+from_nick+'" onclick="user_menu(this);">'+from_nick+':&nbsp;</b>';
var s=d+'<span class="chat-message'+sadmin+'">'+escape_html(msg)+'</span>';
return s;
}
var srigi='globik';
var rigi=[]
var du=new Set();
function find_ignor(arr,n){
if(arr.has(n))return true
return false;}
function update_ignor(arr,n){
if(!find_ignor(arr,n)){arr.add(n);return true;}
return false;
}
function remove_ignor(arr,n){
if(find_ignor(arr,n)){arr.delete(n);return true;}
}

function user_menu(el){
//alert(el.getAttribute('data-from_nick'));

var b=el.getAttribute('data-from_nick');
if(b)
if(myusername===b)return;
if(confirm('Do you wish to ignore the messages from '+b+'?')){
var l=update_ignor(ignory,b);
	console.warn('l: ',l);
}
}


function get_acc_users(){
var s='',t='';
if(is_local_storage()){
if(localStorage.chatac){s=localStorage.chatac;}
if(localStorage.soundenable){t=localStorage.soundenable;}

if(s=='1'){gid('canchat_guest').checked=true;}else{gid('canchat_logged').checked=true;}
if(t!=='1'){gid('soundenableid').checked=true;
		   gid('soundenableid').value="0";
		   gid('soundenablelabelid').textContent="sound disabled";}else{
gid('soundenableid').checked=false;
gid('soundenableid').value="1";
gid('soundenablelabelid').textContent="sound enabled";
}
}else{console.log('localStorage not available');}
}
gid('soundenableid').onclick=function(e){
//alert(e.target.checked+' '+e.target.value);
if(!e.target.checked){
soundenablelabelid.textContent="sound enabled";
e.target.value="1";
}else{
soundenablelabelid.textContent="sound disabled";	
e.target.value="0";
}
}
function chat_gear(){
get_acc_users();
window.location.href="#chatnastroi";
playSound(sounds.message.buffer);
}
document.forms.canchat.onsubmit=save_acc_users;
function save_acc_users(ev){
ev.preventDefault();
//alert(ev.target.chataccess.value)
localStorage.chatac=ev.target.chataccess.value;
localStorage.soundenable=ev.target.soundenable.value;
message_box('Saved!');
}

function show_event_token(m){
console.log('m: ',m);
var s=tok_str(m.amount,m.user_nick)
insert_message(s);
if(owner()){
	//alert('a? '+m.amount)
var l=gid('tokens_panel').textContent;
var i=Number(l);
l=i+m.amount;
	console.log('l ',l)
	gid('tokens_panel').textContent=l;
playSound(sounds.complete.buffer);
updateModelTokens();
}
}
function tok_str(am,nick){
var ds=(am==1?'':'s');
var b='<b class="chat-user">'+nick+':&nbsp;</b>';
var s=b+'<span class="chat-message">'+toki_s(am)+'</span>';
return s;
}
function toki_s(am){
var ds=(am==1?'':'s');
var s='Sent '+am+' tip'+ds+'.';
return s;
}
function insert_message(div){
var m=document.createElement('div');
m.className="chat-div";
m.innerHTML=div;
chat.appendChild(m);

chat.scrollTop=chat.clientHeight;
}

function escape_html(s){
return s.replace(/[&<>'"]/g,function(m){return '';})
}

function updateModelTokens(){
var xhr=new XMLHttpRequest();
	//alert('model.id: '+modelId);
	xhr.open("GET","/fetch_toks/"+modelId);
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	xhr.onload=function(e){
	if(xhr.status==200){
		//alert(this.response)
	var m=JSON.parse(this.response);
		console.warn('items: ',m.items);
	//modelTokens.textContent=m.items;
	modelTokens2.textContent=m.items;
	}else{
		//alert(this.response);
		  console.log(this.response);
	}
	}
	xhr.onerror=function(e){console.log(e)};
	xhr.send();
}

function remove_user_offline(){
if(owner()){
if(vidW.classList.contains('owner-offline'))vidW.classList.remove('owner-offline');
}else{
if(vidW.classList.contains('offline'))vidW.classList.remove('offline');
}
}

function add_user_offline(){
if(owner()){
	//if !peerConnection add class owner-offline-with-room
if(!vidW.classList.contains('owner-offline'))vidW.classList.add('owner-offline');console.log(peerConnection)
//}else{console.warn('todo add class owner-offline-no_room',peerConnection)}
}else{
if(!vidW.classList.contains('offline'))vidW.classList.add('offline');
}
}

function startVideo(el) {
if(owner()){
getDeviceStream({video: true, audio: true})
.then(function (stream) {
localStream = stream;
var videoTracks = stream.getVideoTracks();
if (videoTracks) {
console.log('videoTracks.length=' + videoTracks.length);
if(videoTracks.length==0) throw 'Have you enabled your web camera?';
}
logStream('localstream', stream);
playVideo(localVideo, stream);
updateButtons();
fl=true;
el.textContent='stop video';
}).catch(function (error) { 
alert('Have you enabled your webcam?');
fl=false;
el.textContent='start video';
rtcerror.innerHTML=error;
return;
});
}
}
 
function stopVideo() {
if(owner()){
pauseVideo(localVideo);
stopLocalStream(localStream);
localStream = null;
updateButtons();
}
}

function stopLocalStream(stream) {
	if(stream==null)return;
var tracks = stream.getTracks();
if (! tracks) {
console.warn('NO tracks');
return;
}
	
for (var track in tracks) {
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
if(pidi==0){
element.poster='';
add_user_offline();
}
if(owner()){deleteroom();}
}
 
function sendSdp(sessionDescription) {
console.log('---sending sdp ---');
const jsonSDP = sessionDescription.toJSON();
jsonSDP.planb = getUsePlanB();
jsonSDP.roomname=modelName;
sendJson(jsonSDP);
}

function sendJson(json) {
var mess = JSON.stringify(json);
if(socket)socket.send(mess);
}


function prepareNewConnection() {
var pc_config = {"iceServers":[]};
var peer = new RTCPeerConnection(pc_config);
    // --- on get remote stream ---
if ('ontrack' in peer) {
peer.ontrack = function(event) {
console.log('-- peer.ontrack()');
var stream = event.streams[0];
logStream('remotestream of ontrack()', stream);
if ( (stream.getVideoTracks().length > 0) && (stream.getAudioTracks().length > 0) ) {
if(!owner()){addRemoteVideo(stream.id, stream);}else{console.warn('IGNORE remote track');}
}
};
}else {
peer.onaddstream = function(event) {
console.log('-- peer.onaddstream()');
var stream = event.stream;
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
console.error('completed!');
/*
if(owner()){
pidi=obid();
pid.textContent=pidi;
sendJson({type:'online',roomname:modelId,pidi:pidi});

}*/
}else if(peer.iceConnectionState==='connected'){
console.error('connected!')
if(owner()){
	/*
pidi=obid();
pid.textContent=pidi;
sendJson({type:'online',roomname:modelName, pidi:pidi});
*/
	get_image();
}

}else if(peer.iceConnectionState==='closed'){
if(owner()){sendJson({type:'offline', roomname:modelName,pidi:pidi});pidi=0;pid.textContent=pidi;}
}else if(peer.iceConnectionState==='failed'){
pidi=0;pid.textContent=pidi;
if(!buser()){
dissconnect();
if(ink()){if(socket)socket.close();}
}else{if(!owner())dissconnect();}
}else if (peer.iceConnectionState === 'disconnected') {
console.warn('-- disconnected --');
if(!owner()){
roomcreated=false;pidi=0;pid.textContent=pidi;
if(!buser()){if(ink()){if(socket)socket.close();}}
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
var stream = event.stream;
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
var waitForCandidates = true;
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
var con_fl=false;

function do_conn(el){
if(is_langsam_stop()){message_box(str_langsam_stop);return;}
if(!con_fl){
if(owner()){
if(roomcreated){
connect(el);
con_fl=true;
el.textContent='disconnect';
}else{alert('You have to start video first. Then press "connect"');}
}else{
if(roomcreated){
connect(el);
con_fl=true;
el.textContent='disconnect';
}else{connect(el);}
}

}else{
dissconnect();
con_fl=false;
el.textContent='connect';
}
}
if(!ink()){if(!buser())go_socket();}
function connect(el) {
if(!buser()){if(ink())go_socket();}
setTimeout(function(){
if(roomcreated){
//alert('is room created? '+roomcreated)
if(!buser()){con_fl=true;el.textContent='disconnect';}
callWithCapabilitySDP();
updateButtons();
}else{
if(!buser()){if(ink()){if(socket)socket.close();}}
}
},conn_timeout)
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
var whatsend={type: "call", planb: getUsePlanB(), capability: sessionDescription.sdp,roomname:modelName};
if(!owner()){
whatsend.type="call_downstream";
}

sendJson(whatsend);
}).catch(function(err) {
console.error('ERROR in callWithCapabilitySDP():', err);
});
}
	
function createroom(){
if(owner()){
var vobj={};
vobj.roomname=modelName;
vobj.owner=owner();
vobj.id=clientId;
//vobj.src=src;
vobj.type="createroom";
sendJson(vobj);
}
}
	
function deleteroom(){
if(roomcreated){
sendJson({type:'removeroom', roomname:modelName,owner:owner(),id:clientId})
}else{console.warn('roomcreated: ',roomcreated);}
}



function dissconnect() {
sendJson({type: "bye",roomname: modelName});
if (peerConnection) {
console.log('Hang up.');
peerConnection.close()
peerConnection = null;
if(!owner()){
connect_starter.textContent='connect';
con_fl=false;
if(pidi==0)disableElement('connect_starter');
removeRemoteVideo(1,1);
//pidi=0;
pid.textContent=pidi;
if(!buser()){if(ink()){if(socket)socket.close();}}

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
var videoTracks = stream.getVideoTracks();
if (videoTracks) {
console.log('videoTracks.length=' + videoTracks.length);
videoTracks.forEach(function(track) {
console.log(' track.id=' + track.id);
});
}
var audioTracks = stream.getAudioTracks();
if (audioTracks) {
console.log('audioTracks.length=' + audioTracks.length);
audioTracks.forEach(function(track) {
console.log(' track.id=' + track.id);
});
}}


function updateButtons() {
if(owner()){
if (peerConnection) {
disableElement('plan_b_check');
}else {
if (localStream) {
enabelElement('connect_starter');
}else {
disableElement('connect_starter');
}
enabelElement('plan_b_check');
}
}else if(!owner()){
if(peerConnection){

disableElement('plan_b_check');
}else{
enabelElement('plan_b_check');
}
}else{console.log('nothing in else update button');}
}

function enabelElement(id) {
var el = gid(id);
if (el) {el.removeAttribute('disabled');}
}

function disableElement(id) {
var el= gid(id);
if (el) {el.setAttribute('disabled', '1');}    
}

updateButtons();

function addRemoteVideo(id, stream) {
localVideo.srcObject=stream;
}
  
function removeRemoteVideo(id, stream) {
pauseVideo(localVideo);
}


function get_image(){
var cnv=document.createElement('canvas');
var w=300,h=200;
cnv.width=w;
cnv.height=h;
//local_video.width=130;
//local_video.height=130;
//alert(cnv.width+' '+cnv.height+' '+local_video.width+', '+local_video.height)
var c=cnv.getContext("2d");
c.drawImage(localVideo,0,0,w,h);
setTimeout(function(){
var li=cnv.toDataURL('image/png',1.0);
var emg=document.createElement('img');
emg.src=li;
pagewrap.appendChild(emg);
pidi=obid();
pid.textContent=pidi;
sendJson({type:'online',roomname:modelName, pidi:pidi,src:li,chataccess:get_ops()});
//createroom(li);
},10)
}

localVideo.onloadedmetadata=function(e){
if(owner())createroom();//get_image(roomcreated);
}
function gid(i){return document.getElementById(i);}
