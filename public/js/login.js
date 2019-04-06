var si=0, sendto=true;
function go_login(ev){
var submit=cl('login-submit'),sessRed=gid('sessRed');
si++;
var xhr=new XMLHttpRequest();
xhr.open(ev.method, ev.action);
xhr.setRequestHeader('Content-Type', 'application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(if_cont(submit,'no','waiting'));
if(xhr.status==200){
submit.disabled=true;
add_st(true);
if_cont(sessRed,'green','red');
var mata=JSON.parse(this.response);
sessRed.innerHTML=mata.info;
window.location.href=mata.redirect;
}else{
if_cont(sessRed,'red','green');
sessRed.innerHTML=this.response;
add_st(false);
}}
xhr.onerror=function(e){console.error('XHR onerror: '+e);sessRed.innerHTML='Internet connection lost.';}
var data={};
data.username=ev.username.value;
data.password=ev.password.value;
var mid=JSON.stringify(data);
if(window.sessionStorage){
if(sessionStorage.count){
sessionStorage.count=Number(sessionStorage.count)+1;
}else{
sessionStorage.count=1;
}
if(sessionStorage.count > 15){
if_cont(sessRed,'red','green');
sessRed.innerHTML="Forgot your password? Go to <a href='/forgot'>reset</a> it.";

try{xhr_failed_login(ev);}catch(e){alert(e);console.log(e)}
setTimeout(go_wieder, 5000);
sendto=false;
}

function go_wieder(){
console.log('istablished');
sessionStorage.count=1;
sendto=true;
if_cont(sessRed,'green','red');
}
}else{
if(si>4){console.warn('great then 4');sendto=false;}
}
if(sendto){
if_cont(submit,'waiting','no');
	console.log(mid);
xhr.send(mid);
}}

function xhr_failed_login(e){
var xhr=new XMLHttpRequest();
xhr.open('post','/xhr_failed_login');
xhr.onload=function(evi){
if(xhr.status==200){
console.log('from server failed login process: '+this.response);
}else{
console.error(this.response);
}
}
xhr.onerror=function(e){console.error(e);}
if(e.email.value){xhr.send(e.email.value);
}}
function add_st(b){
var em=cl('login-email'),pwd=cl('login-pwd');
if(b){
if_cont(em,'no','redinput');
if_cont(pwd,'no','redinput');
}else{
if_cont(em,'redinput','no');
if_cont(pwd,'redinput','no');}}
function cl(n){return document.getElementsByClassName(n)[0];}
function if_cont(el,a,b){
if(el.classList.contains(b)){el.classList.remove(b)}
el.classList.add(a);}
function gid(id){return document.getElementById(id);}