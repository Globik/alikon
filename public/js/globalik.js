function message_box(n){
inbox.innerHTML='<b>'+n+'</b>';
window.location.href="#message_box";
open_al();
}

function shell(el,n,ml){
if(typeof HTMLDialogElement==='function'){
inbox3.innerHTML='<b>'+n+'</b>';dialogConfirm.showModal();
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
//setTimeout(function(){rem_hash();},0);
in_rem_hash();
}}
function in_rem_hash(){
setTimeout(function(){rem_hash();},0);
}

	
function rem_hash(){
if(history)history.pushState('',null,window.location.pathname);
}