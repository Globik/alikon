var smally=gid("smally"),
outresult=gid("outresult"),
form=gid("mform"),
wrap=gid("loginery-wrap"),
show_pwd=gid('show_pwd'),
submit=document.querySelector('.login-submit'),
pwd=form.password,
email=form.email,
token=form.token,
str_show="show password",
str_hide="hide password";
	
smally.onclick = if_show_pwd;
smally.ontouchstart = if_show_pwd;
pwd.oninput = go_show_pwd;
	
form.onsubmit=go_reset;

function go_reset(ev){
ev.preventDefault();
to_ajx(ev);
if_cont(submit,'waiting','no');
}	

function notif(e){	
outresult.style.display="block";
tohtml(outresult, '<p class="lightgreen"><h3>Password Change Complete!</h3>'+JSON.parse(e.response).message+'</p>');
removeForm();
}

function notif_er(e){
outresult.style.display="block";
tohtml(outresult, '<p class="red">Status: '+e.status+' : '+e.response+'</p>');
}

function to_ajx(l){
var xhr=new XMLHttpRequest();
var pars='password='+encodeURIComponent(pwd.value)+'&token='+encodeURIComponent(token.value)+'&email='+encodeURIComponent(email.value);
xhr.open(l.target.method,l.target.action);
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(evi){
if_cont(submit,'no','waiting');
if(xhr.status==200){
notif(this);
}else{
notif_er(this);
}}
xhr.onerror=function(e){
if_cont(submit,'no','waiting');
alert('Internet connection failed.');}
xhr.send(pars);
}
	
function removeForm(){
form.style.display="none";
form.onsubmit=null;
}
function if_show_pwd(e){
if(is_equal(smally, str_show)){
totext(smally, str_hide);
tohtml(show_pwd, ' '+ pwd.value);
}else{
totext(smally, str_show);
totext(show_pwd, "");
}
}
	
function go_show_pwd(e){
if(is_equal(smally, str_hide))
show_pwd.textContent=' '+ e.target.value;
}
	
function gid(id){return document.getElementById(id);}
function tohtml(s, v){return s.innerHTML=v;}
function totext(s, v){return s.textContent=v;}
function is_equal(d,s){
if(d.textContent===s) {return true;}else{return false;}
}

function if_cont(el,a,b){
if(el.classList.contains(b)){el.classList.remove(b)}
el.classList.add(a);}