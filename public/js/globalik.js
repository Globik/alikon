'use strict';
var sounds={
l1:{src:"/sounds/KDE-Im-Contact-Out.ogg"},
l2:{src:"/sounds/KDE-Im-Low-Priority-Message.ogg"},
l3:{src:"/sounds/KDE-Im-Phone-Ring.ogg"},
complete:{src:"/sounds/complete.oga"},
bell:{src:"/sounds/bell.ogg"},
message:{src:"/sounds/message.ogg"}
}

function is_local_storage(){return (typeof(Storage) !=='undefined'?true:false);}
function is_sound(){
if(is_local_storage()){
if(localStorage.soundenable){
if(localStorage.soundenable=="0"){return false;}else{return true;}
}
return true;}
return false;}
function is_dialogi(){return (typeof HTMLDialogElement==='function'?true:false);}
function bzuka(el,n,ml){
inbox3.innerHTML='<b>'+n+'</b>';
//dialogConfirm.style.display="block";
dialogConfirm.showModal();
playSound(sounds.message.buffer);
dialogConfirm.onclose=function(ev){
ev.target.returnValue=='true'?luzda(el,ml):null;
ev.target.returnValue=null;
}}
function shell(el,n,ml){is_dialogi()?bzuka(el,n,ml):puzuki(el,n,ml);}
function puzuki(el,n,ml){confirm(n)?luzda(el,ml):null}
function luzda(el,ml){
	if(!el.target.dispatchEvent(ml)){alert('el.target.dispatchEvent() API is not supported!');}
	(el?el.target.dispatchEvent(ml):pizda(ml));
}
function bvid(i){return document.getElementById(i);}
function galert(n){
let c=window.getComputedStyle(document.querySelector('.popi'),null).getPropertyValue('z-index');
inbox2.innerHTML='<b>'+n+'</b>';
playSound(sounds.complete.buffer);
if(c)bvid('alert_id').style.zIndex=c+1;
bvid('alert_id').classList.add('ak');
setTimeout(function(){
bvid('alert_id').classList.remove('ak');
},5000)
}
function open_al(){
bvid('message_box').onclick=function(e){
in_rem_hash();
}}
function in_rem_hash(){setTimeout(function(){rem_hash();},0);}
function rem_hash(){
if(history)history.pushState('',null,window.location.pathname);}
var ax=null;
function getAudioContext(){
try{ax=new (window.AudioContext || window.webkitAudionContext);}catch(e){
console.error('audiocontext:  '+e);
ax=null;
}}
getAudioContext();
function fogg(){
let b=!!(new Audio().canPlayType('audio/ogg;codecs="vorbis"'));
console.warn('can play ogg: ', b);
if(b){return true;}else{return false;}
}
fogg();
function loadSoundObj(obj){
let r=new XMLHttpRequest();
r.open('GET',obj.src,true)
r.setRequestHeader('X-Requested-With','XMLHttpRequest');
r.responseType='arraybuffer';
r.onload=function(){
ax.decodeAudioData(r.response,function(buffer){obj.buffer=buffer;},function(err){console.error(err)})}
r.send();}
function loadSounds(obj){
if(ax==null)return;
var len=obj.length,i;
for(i in obj){
if(obj.hasOwnProperty(i)){loadSoundObj(obj[i]);}
}} 
loadSounds(sounds);
function blaysound(buffer){
if(ax==null)return;
if(buffer){
try{
let s=ax.createBufferSource();
	s.buffer=buffer;
	s.connect(ax.destination);
	s.start(0);
}catch(e){console.error(e);return;}
}}
function playSound(buffer){
if(!is_sound())return;
if(!fogg())return;

return blaysound(buffer);
}
function message_box(n){
	console.log('mess: ',n)
inbox.innerHTML='<b>'+n+'</b>';
window.location.href="#message_box";
playSound(sounds.complete.buffer);
open_al();
}
var gevS=null;
if(!!window.EventSource){
gevS=new EventSource('/log_rooms');
	gevS.onopen=function(){console.log('sse opened');}
	gevS.onerror=function(e){/*console.error("event source error: ");*/}
}else{}
function vax(m,u,d,o,z,bool){let x=new XMLHttpRequest();if(!x){return false;}x.open(m,u);
if(!bool){x.setRequestHeader('Content-Type','application/json','utf-8');}x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
x.onload=function(e){
	//alert('mu '+this.response);
	x.status==200?o(demiss(this.response)):z(this.response)};x.onerror=z;if(!bool){let v=miss(d);x.send(v);}else{x.send(d)}}
function miss(n){let a;try{a=JSON.stringify(n);return a;}catch(er){throw er;}}
function demiss(n){let b;try{b=JSON.parse(n);return b;}catch(er){throw er;}}