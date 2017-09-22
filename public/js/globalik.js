'use strict';
var sounds={
l1:{src:"/sounds/KDE-Im-Contact-Out.ogg"},
l2:{src:"/sounds/KDE-Im-Low-Priority-Message.ogg"},
l3:{src:"/sounds/KDE-Im-Phone-Ring.ogg"},
complete:{src:"/sounds/complete.oga"},
bell:{src:"/sounds/bell.ogg"},
message:{src:"/sounds/message.ogg"}
}

function is_local_storage(){
if(typeof(Storage) !=='undefined'){return true;}else{
return false;}
}
function is_sound(){
if(is_local_storage()){
if(localStorage.soundenable){
if(localStorage.soundenable=="0"){return false;}else{return true;}
}
return true;
}
return false;
}
function shell(el,n,ml){
if(typeof HTMLDialogElement==='function'){
inbox3.innerHTML='<b>'+n+'</b>';dialogConfirm.showModal();
playSound(sounds.message.buffer);
dialogConfirm.onclose=function(ev){
if(ev.target.returnValue=='true'){el.target.dispatchEvent(ml);
ev.target.returnValue=null;
}
}}else{
if(confirm(n)){el.target.dispatchEvent(ml);}
}
}
function bvid(i){return document.getElementById(i);}
function galert(n){
//alert('what the fuck');
let c=window.getComputedStyle(document.querySelector('.popi'),null).getPropertyValue('z-index');
inbox2.innerHTML='<b>'+n+'</b>';
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
function rem_hash(){if(history)history.pushState('',null,window.location.pathname);}
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
inbox.innerHTML='<b>'+n+'</b>';
window.location.href="#message_box";
playSound(sounds.l1.buffer);
open_al();}