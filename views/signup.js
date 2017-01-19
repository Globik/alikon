//signup.js
var dev_user=process.env.DEV_USER;
var dev_pwd=process.env.DEV_PWD;
var dev_email=process.env.DEV_EMAIL;
var head=require('./head.js');
var dupl_str=`duplicate key value violates unique constraint "busers_pkey"`;
var signup = n =>{
return `<!DOCTYPE html><html lang="en"><head>
${head.head({title:"sign up", csslink:`${get_local_style()}`})}
</head>
<body>
<main id="pagewrap" style="background:pink;">
<a href="/">home</a>
<div id="loader"></div>

<form id="mform" action="/signup" method="post">
<div class="imgcontainer">img</div>
	<div class="container">
		<label>Username</label>
<input type="text" name="username" placeholder="Username" value="markus" required/> 
<label>Email</label>
<input type="email" name="email"  placeholder="E-mail" value="gru5@yandex.ru" required />
<label>Password</label>
<input type="password" name="password"  placeholder="Password" value="${dev_pwd ? dev_pwd : ''}" required pattern=".{6,}" maxlength="20"/><br>
<u class="blue"><small id="smally" class="blue">show password</small></u><span id="show_pwd"></span>
<button>Sign Up</button>
</div>
<div class="imgcontainer">
<p>Or <a href="">sign up via fb, vk</a></p>
 Already a member? Login </div>
</form>
<div id="outresult" class="animate-bottom"></div>
<script>
var smally=gid("smally"),
	outresult=gid("outresult"),
	bod=document.getElementsByTagName('body')[0],
    form=gid("mform"),
	show_pwd=gid('show_pwd'),
    pwd=form.password,
		email=form.email,
		username=form.username,
	str_show="show password",
	str_hide="hide password";
	
	smally.onclick = if_show_pwd;
	smally.ontouchstart = if_show_pwd;
	pwd.oninput = go_show_pwd;
	
mform.onsubmit=function(ev){
ev.preventDefault();
form.style.opacity="0.2";
bod.style.background="rgba(0,0,0,0.3)";
loader.style.display="block";
to_ajx();
}

function to_ajx(){
var pars='email='+encodeURIComponent(email.value)+'&password='+encodeURIComponent(pwd.value)+'&username='+encodeURIComponent(username.value);
var xhr=new XMLHttpRequest();
xhr.open("post","/signup");
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xhr.onload=function(evi){
if(xhr.status==200){notif(this);
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
    tohtml(outresult, '<p class="lightgreen"><h3>Thanks for creating an account with Alikon!</h3>'+JSON.parse(e.response).message+'</p>');
	removeForm();
}

function notif_er(e){
loader.style.display="none";
bod.style.background="initial";
form.style.opacity="1";
outresult.style.display="block";
var er_msg=(e.status==409 ? 'This email is already occupied!' : 'Failed. Unknown reason');
console.log(e.response);
tohtml(outresult, '<p class="red">Status: '+er_msg+'</p>');
}

function removeForm(){
	form.style.display="none";
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
