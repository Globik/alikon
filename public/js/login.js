var si=0, sendto=true;
//var formface=document.forms.namedItem("mform");
//formface.addEventListener('submit', baba, false);
function baba(ev){
var submit=cl('login-submit'),sessRed=gid('sessRed');
si++;
var xhr=new XMLHttpRequest();
xhr.open(ev.method, ev.action);
xhr.setRequestHeader('Content-Type', 'application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(if_cont(submit,'waiting'));
if(xhr.status==200){
add_st();
if_cont(sessRed,'red');
var mata=JSON.parse(this.response);
sessRed.innerHTML=mata.info;
window.location.href=mata.redirect;
}else{
if_cont(sessRed,'red');
sessRed.innerHTML=this.response;
add_st();
}}
xhr.onerror=function(e){console.error('XHR onerror: '+e);sessRed.innerHTML='Internet connection lost.';}
var data={};
data.email=ev.email.value;
data.password=ev.password.value;
var mid=JSON.stringify(data);
if(window.sessionStorage){
if(sessionStorage.count){
sessionStorage.count=Number(sessionStorage.count)+1;
}else{
sessionStorage.count=1;
}
if(sessionStorage.count > 15){
if_cont(sessRed,'red');
sessRed.innerHTML="Forgot your password? Go to <a href='/forgot'>reset</a> it.";

try{xhr_failed_login(ev);}catch(e){alert(e);console.log(e)}
setTimeout(go_wieder, 5000);
sendto=false;
}

function go_wieder(){
console.log('istablished');
sessionStorage.count=1;
sendto=true;
if_cont(gid('sessRed'),'red');
}
}else{
if(si>4){console.warn('great then 4');sendto=false;}
}
if(sendto){
if_cont(submit,'waiting');
xhr.send(mid);
}}

function xhr_failed_login(e){
var xhr=new XMLHttpRequest();
xhr.open('post','/xhr_failed_login');
xhr.onload=function(evi){
if(xhr.status==200){
console.log('from server failed login process: '+this.response);
}else{
console.log(this.response);
}
}
xhr.onerror=function(e){console.error(e);}
if(e.email.value){xhr.send(e.email.value);
}}
function add_st(){
var em=cl('login-email'),pwd=cl('login-pwd');
if_cont(em,'redinput');
if_cont(pwd,'redinput');
}
function cl(n){return document.getElementsByClassName(n)[0];}
function if_cont(el,clas){
if(!el.classList.contains(clas)){el.classList.add(clas)}else{el.classList.remove(clas);}
}
function gid(id){return document.getElementById(id);}