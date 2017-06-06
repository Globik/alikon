//signup.js
var dev_user=process.env.DEV_USER;
var dev_pwd=process.env.DEV_PWD;
var dev_email=process.env.DEV_EMAIL;
var login_css=require('./login_css.js');
var head=require('./head.js');
//var glocal_style=true;

const signup = n =>{
	
let messi=m=>{
console.log('msg: ',m)
let s='';
if(m.success==false){
if(m.code){
if(m.code=='23505'){s+=' User email already exists';fu=false;}else{s+=`${m.error ? m.error : ''}`}
}else{s+=`${m.error ? m.error : ''}`;}
}else if(m.success==true){s+=`${m.msg ? m.msg : ''}`}else{}
return s;
}
	
return `<!DOCTYPE html><html lang="en">
<head>
${head.head({title:"sign up",cssl:["/css/login2.css"]})};
</head>
<body>
<main id="pagewrap">
<a class="nav" href="/">home</a>
<div id="loader"></div>
<div id="wrap">
<h2>Welcome. Please sign up.</h2>
${n.errmsg ? `<span id="red-warnig">${messi(n.errmsg)}</span>` : ``}
<form id="mform" name="mform" action="/signup" method="post">
<div class="username">
<label><strong>Username</strong></label>
<input type="text" name="username" placeholder="Username" value="markus" required/>
</div>
<div class="email">
<label><strong>Email</strong></label>
<input type="email" name="email"  placeholder="E-mail" value="gru5@yandex.ru" required/>
</div>
<div class="password">
<label><strong>Password</strong></label>
<input type="password" name="password"  placeholder="Password" value="${dev_pwd ? dev_pwd : ''}" required pattern=".{6,}" maxlength="20"/><br>
<u class="blue"><small id="smally" class="blue">show password</small></u><span id="show_pwd"></span>
</div>
<div class="submit">
<input type="submit" value="Sign Up">
</div>
</form>
<div id="bott">
 <strong>Already a member?</strong> <a href="/login">Login</a><br><br>
<strong>Or you can sign in with:</strong><br><br>

<a href="/auth/facebook">
<div class="soc-desc fb">
<div class="soc-desc1">
<img src="/images/facebook-icon_64.png"/>
</div>
<span class="span-social">facebook</span>
</div>
	</a>
<a href="/auth/vkontakte"><div class="soc-desc vk"><div class="soc-desc1"><img src="/images/vk.png"/></div><span class="span-social">vkontakte</span>
	</div>
	</a>
	
</div>
</div>
<div id="outresult" class="animate-bottom">i am a div</div>
<script>
var smally=gid("smally"),
	outresult=gid("outresult"),
	bod=document.getElementsByTagName('main')[0],
    wrap=gid("wrap"),
    form=document.forms.namedItem("mform"), //gid("mform"),
	show_pwd=gid('show_pwd'),
    pwd=form.password,
	email=form.email,
	username=form.username,
	str_show="show password",
	str_hide="hide password";
	
	smally.onclick = if_show_pwd;
	smally.ontouchstart = if_show_pwd;
	pwd.oninput = go_show_pwd;
var red_label=document.querySelector('.email label strong');
var red_email=document.querySelector('input[type=email]');

//form.addEventListener('submit',baba, false);
function baba(ev){
ev.preventDefault();
//form.style.opacity="0.2";
wrap.style.opacity="0.9";
bod.style.background="rgba(0,0,0,0.9)";
loader.style.display="block";
to_ajx(ev);
}

function to_ajx(ev){
var pars={};
pars.email=email.value;
pars.username=username.value;
pars.password=pwd.value;
var xhr=new XMLHttpRequest();
xhr.open(ev.target.method, ev.target.action);
//xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xhr.setRequestHeader('Content-Type', 'application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(evi){
if(xhr.status==200){
var ra=JSON.parse(this.response);
if(ra.success==false){notif_er(ra)}else{notif(ra);}

}else{
notif_er(this);
}
}
xhr.onerror=function(e){console.error(e);
loader.style.display="none";
alert('Internet connection failed');
}
var dies=JSON.stringify(pars);
xhr.send(dies);
}
function notif(e){	
loader.style.display="none";
outresult.style.display="block";
tohtml(outresult, '<p class="green"><h3>Thanks for creating an account with Alikon!</h3>'+e.message+'</p>');
removeForm();
}

/*
.email label strong{color:red;}
.email{border:1px solid red;}
*/
function notif_er(e){

loader.style.display="none";
bod.style.background="initial";
wrap.style.opacity="1";
outresult.style.display="block";
var er_msg='';
if(e.code=='23505'){
redmail();
er_msg=e.message;
}else if(e.code=='23514'){
redmail();
er_msg=e.message;
}else{
if(e.message){
er_msg=e.message;
}else{er_msg=e.response;}
}
console.log('kuku: ',e.response,e.message);
tohtml(outresult, '<p class="red">'+er_msg+'</p>');
}

red_email.oninput=function(e){
red_label.style.color="initial";
red_email.style.border="initial";
}

function redmail(){
red_label.style.color="red"; 
red_email.style.border="2px solid red";
outresult.style.background="pink";
}
function removeForm(){
wrap.style.display="none";
bod.style.background="initial";
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
</script>
</main></body></html>`;}
function get_local_style(){
return `/css/login2.css`;
}
module.exports={signup};
