const test=n=>{
return `<html><head><title>Tests</title></head><body>
<div><a href="/">home</a></div>
<button value="ok" data-id="ID200" onclick="malert(this);">click test</button> <button onclick="query();">query selector test</button><br><br>
<button value="on touch ok" ontouchstart="malert(this);">on touchstart test</button><br><br>
<!-- <button value="on touch ok" ontouch="malert(this);">on touch test</button><br><br> -->
<button onclick="check_form_data(this);">check form data</button><br><br>
<button onclick="check_xhr();">check xhr</button><br><br>
<button onclick="check_custom_event();">check_custom_event</button><br><br>
<button onclick="show_pwd();">show password</button><br><br>
<button onclick="check_href();">check_href</button><br><br>
<button onclick="check_event_source();">check event source</button><br><br>
<hr>opera-mini specific<hr>
<button onclick="check_opera_custom_event(this);">check opera custom event</button><br><br>
<br>
<form name="fname" id="fnameid" method="post" action="/fucking_arschloch" enctype="multipart/form-data">
<input type="text" name="username" value="globik">
<input type="radio" name="type" value="active" checked>
<input type="radio" name="type" value="passive">
<input id="pwd" type="password" name="pwd" value="mama">
<input type="submit" value="submit">
</form>
<h4>Outputs:</h4>
<div id="out"></div>
<script>
'use strict';
function cr_event(name){
var makaka23=null;
try{
makaka23=new Event(name);return makaka23;
}catch(e){
makaka23=document.createEvent('Event');
makaka23.initEvent(name,true,true);
return makaka23;
}
return makaka23;
}
var out=document.getElementById('out');
var pwd=document.getElementById('pwd');
var fnameid=document.getElementById('fnameid');
out.innerHTML='';
function malert(el){alert('value: '+el.value);
out.innerHTML+='<b>value: </b>'+el.value+'<br>';
}
function check_form_data(){
var elfd=document.getElementById('fnameid');
var fd;
try{fd=new FormData(elfd);
out.innerHTML+='form data api: '+fd+'<br>';
out.innerHTML+='<b>elfd.pwd.value: </b>'+elfd.pwd.value+'<br>';
}catch(e){out.innerHTML+=e+'<br>';alert(e);}

}
function query(){
var quel;
try{
quel=document.querySelector('button[value="ok"]');
out.innerHTML+='query selector: '+quel+'<br>';
out.innerHTML+='<b>data-id: </b>'+quel.getAttribute("data-id")+'<br>';
}catch(e){out.innerHTML+=e+'<br>';alert(e);}

}

function check_xhr(){
try{
var xhr=new XMLHttpRequest();
xhr.open('post','/get_me_please');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
alert(this.response+' '+this.responseText);
out.innerHTML+=this.response+'='+this.responseText+'<br>';
}else{alert('not 200: '+this.response+' '+this.responseText);}
}
xhr.onerror=function(){alert('xhr onerror event');}
var d={};
d.me="globik";
var ws=JSON.stringify(d);
xhr.send(ws);
}catch(e){out.innerHTML+='xhr: '+e+'<br>';alert(e);}
}
function check_custom_event(){
var event;
try{
event=new Event('suka');
out.innerHTML+='custom event: '+event+'<br>';
}catch(e){
out.innerHTML+='custom event error: '+e+'<br>';
}
}
var aha=false;
function show_pwd(){
if(!aha){pwd.type="text";aha=true;}else{pwd.type="password";aha=false;}
}
function check_href(){
out.innerHTML+='location.href: '+window.location.href+'<br>';
}
function check_event_source(){

try{
var b="b is in let b variable";
// fuck 'let' does not work in opera mini and chrome for android
out.innerHTML+='<b>let b=</b>'+b+'<br>';
}catch(e){out.innerHTML+='var b='+e+'<br>';}

try{
if(window.EventSource){
out.innerHTML+='event source-1 YES<br>';
var ev=new EventSource('/log_rooms');
ev.onopen=function(){out.innerHTML+='<b>EventSource</b> opened!<br>';}
}else{
out.innerHTML+='event source-1 NO<br>';
}
}catch(e){out.innerHTML+=e+'<br>';}

try{
if(!!window.EventSource){
out.innerHTML+='eventsource-2 YES<br>';
}else{
out.innerHTML+='event source-2 NO<br>';
}
}catch(e){out.innerHTML+=e+'<br>';}

}
function check_opera_custom_event(el){
try{
var opevent=cr_event('build');
if(opevent)pwd.dispatchEvent(opevent);
}catch(e){out.innerHTML+='err: '+e+'<br>';}
}
pwd.addEventListener('build',function(e){
out.innerHTML+='<b>An event ocured! YES!</b><br>';
},false)
</script>

</body></html>`;
}
module.exports={test};