var outresult=gid("outresult"),
mform=gid('mform'),
email=mform.email;
var submit=document.querySelector('.login-submit'),
red_email=document.querySelector('.login-email');
mform.onsubmit=do_reset;
function do_reset(ev){
ev.preventDefault();
if_cont(submit,'waiting','no');
to_ajx(ev);
}

function to_ajx(ev){
var pars='email='+encodeURIComponent(email.value);
var xhr=new XMLHttpRequest();
xhr.open(ev.target.method,ev.target.action);
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(evi){
if_cont(submit,'no','waiting');
if(xhr.status==200){ 
notif(this);
}else{
notif_er(this);
}
}
xhr.onerror=function(e){alert(e);}
xhr.send(pars);
}

function notif(e){	
outresult.style.display="block";
if_cont(outresult,'ok','not-ok');
tohtml(outresult,'<h3>Your password reset email has been sent!</h3><p>'+JSON.parse(e.response).message+'</p>');
removeForm();
}

function notif_er(e){
var er_str='insert or update on table "tokens" violates foreign key constraint "tokens_email_fkey"';
outresult.style.display="block";
if_cont(outresult,'not-ok','ok');
red_email.style.border="2px solid red";

var msg_er='';
if(e.response==er_str){msg_er='No such email addresse.'}else{
msg_er=e.response;
}
tohtml(outresult, '<p class="red">Status: '+msg_er+'</p>');
}

function removeForm(){
mform.style.display="none";
mform.onsubmit=null;
}

function tohtml(s, v){return s.innerHTML=v;}
function totext(s, v){return s.textContent=v;}
function gid(id){return document.getElementById(id);}
function if_cont(el,a,b){
if(el.classList.contains(b)){el.classList.remove(b)}
el.classList.add(a);}