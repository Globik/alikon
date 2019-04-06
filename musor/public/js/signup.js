var smally=gid("smally"),
	outresult=gid("outresult"),
    form=document.forms.namedItem("mform"), //gid("mform"),
	show_pwd=gid('show_pwd'),
    pwd=form.password,
	email=form.email,
submit=document.querySelector('.login-submit'),
	username=form.username,
	str_show="show password",
	str_hide="hide password";
	
	smally.onclick = if_show_pwd;
	smally.ontouchstart = if_show_pwd;
	pwd.oninput = go_show_pwd;
var red_email=document.querySelector('.login-email');
var red_username_input=document.querySelector('.login-text');

form.addEventListener('submit',baba, false);
function baba(ev){
ev.preventDefault();
if_cont(submit,'waiting','no')
to_ajx(ev);
}

function to_ajx(ev){
var pars={};
pars.email=email.value;
pars.username=username.value;
pars.password=pwd.value;
var xhr=new XMLHttpRequest();
xhr.open(ev.target.method, ev.target.action);
xhr.setRequestHeader('Content-Type', 'application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(evi){
if_cont(submit,'no','waiting');
if(xhr.status==200){
var ra=JSON.parse(this.response);
if(ra.success==false){notif_er(ra)}else{notif(ra);}

}else{
notif_er(this);
}
}
xhr.onerror=function(e){
if_cont(submit,'no','waiting');
console.error(e);
alert('Internet connection failed');
}
var dies=JSON.stringify(pars);
xhr.send(dies);
}
function notif(e){	
outresult.style.display="block";
tohtml(outresult, '<p class="green"><h3>Thanks for creating an account with Alikon!</h3>'+e.message+'<br><br>Go to <a href="/">home</a><br><br></p>');
removeForm();
setTimeout(function(){window.location.href=e.redirect;},2000);
}


function notif_er(e){
if(e.code=='23505'){
if(e.bcode==2){
redmail();
mailout.textContent=e.message;
}else if(e.bcode==1){
redusername();
nameout.textContent=e.message;
}else{
}
}else if(e.code=='23514'){
redmail();
}else{}
console.warn('kuku: ',e);
}

red_email.oninput=function(e){
red_email.style.border="initial";
red_email.style.color="initial";
mailout.textContent='';
}

function redmail(){
red_email.style.border="2px solid red";
outresult.style.background="pink";
mailout.style.color="red";
}

function redusername(){
red_username_input.style.border="2px solid red";
nameout.style.color="red";
}

red_username_input.oninput=function(e){
red_username_input.style.border="initial";
red_username_input.style.color="initial";
nameout.textContent='';
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