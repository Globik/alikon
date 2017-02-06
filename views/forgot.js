var head=require('./head.js');
var login_css=require('./login_css.js');
var glocal_style=true;

var forgot= n =>{
return `<!DOCTYPE html><html lang="en">
<head>
${head.head({title:"Reset Password", 
[`${glocal_style ? 'csshelper' : 'csslink'}`]:`${glocal_style ? `${login_css.login_css({})}` : `${get_local_style()}`}`})}

</head><body>
<main id="pagewrap">
<a class="nav" href="/">home</a>
<div id="loader"></div>
<div id="wrap">
<form id="mform" action="/forgot" method="post">
<div class="">
<h3>Forgot your password?</h3>
<p>
Enter your email address below to reset your password. 
You will be sent an email  which you will need to open to continue. 
You may need to check your spam folder.
</p>
</div>
	<div class="email">
		<label><strong>Email</strong></label>
<input type="email" name="email"  placeholder="E-mail" value="gru5@yandex.ru" required /></div>

<div class="submit">
<input type="submit" value="Reset">
</div>
</form>
<div id="bott">
<small><a href="/login">Back to log in</a></small>
</div>
</div>
<div id="outresult" class="animate-bottom"></div>
<script>
outresult=gid("outresult"),
bod=document.getElementsByTagName('main')[0],
wrap=gid('wrap'),
mform=gid('mform'),
email=mform.email;

var red_label=document.querySelector('.email label strong');
var red_email=document.querySelector('input[type=email]');

mform.onsubmit=function(ev){
ev.preventDefault();
mform.style.opacity="0.2";
bod.style.background="rgba(0,0,0,0.3)";
loader.style.display="block";
to_ajx();
}
function to_ajx(){
var pars='email='+encodeURIComponent(email.value);
var xhr=new XMLHttpRequest();
xhr.open("post","/forgot");
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xhr.onload=function(evi){
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
	loader.style.display="none";
	outresult.style.display="block";
    tohtml(outresult, '<p class="lightgreen"><h3>Your password reset email has been sent!</h3>'+JSON.parse(e.response).message+'</p>');
	removeForm();
}

function notif_er(e){
var er_str='insert or update on table "tokens" violates foreign key constraint "tokens_email_fkey"';
loader.style.display="none";
bod.style.background="initial";
mform.style.opacity="1";
outresult.style.display="block";

red_label.style.color="red"; 
red_email.style.border="2px solid red";

var msg_er='';
if(e.response==er_str){msg_er=er_str}else{
msg_er=e.response;
}
tohtml(outresult, '<p class="red">Status: '+msg_er+'</p>');
}

function removeForm(){
	mform.style.display="none";
    wrap.style.display="none"
    bod.style.background="initial";
	mform.onsubmit=null;
}

function tohtml(s, v){return s.innerHTML=v;}
function totext(s, v){return s.textContent=v;}
function gid(id){return document.getElementById(id);}
</script>
</main></body></html>`;
}
function get_local_style(){
return `/css/login2.css`;
}
module.exports={forgot};