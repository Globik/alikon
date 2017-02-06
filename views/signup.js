//signup.js
var dev_user=process.env.DEV_USER;
var dev_pwd=process.env.DEV_PWD;
var dev_email=process.env.DEV_EMAIL;
var login_css=require('./login_css.js');
var head=require('./head.js');
var glocal_style=true;

var signup = n =>{
return `<!DOCTYPE html><html lang="en"><head>
${head.head({title:"sign up",[`${glocal_style ? 'csshelper' : 'csslink'}`]:`${glocal_style ? `${login_css.login_css({})}` : `${get_local_style()}`}`})}

</head>
<body>
<main id="pagewrap">
<a class="nav" href="/">home</a>
<div id="loader"></div>
<div id="wrap">
<h2>Welcome. Please sign up.</h2>
<form id="mform" action="/signup" method="post">
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



<a href="/auth/facebook"><div class="soc-desc fb"><div class="soc-desc1"><img src="/images/facebook-icon_64.png"/></div><span>facebook</span></div>
	</a>

<a href="/auth/vkontakte"><div class="soc-desc vk"><div class="soc-desc1"><img src="/images/vk.png"/></div><span>vkontakte</span>
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
var red_label=document.querySelector('.email label strong');
var red_email=document.querySelector('input[type=email]');
	
mform.onsubmit=function(ev){
ev.preventDefault();
//form.style.opacity="0.2";
wrap.style.opacity="0.9";
bod.style.background="rgba(0,0,0,0.9)";
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
    tohtml(outresult, '<p class="green"><h3>Thanks for creating an account with Alikon!</h3>'+JSON.parse(e.response).message+'</p>');
	removeForm();
}

/*
.email label strong{color:red;}
.email{border:1px solid red;}
*/
function notif_er(e){
//alert(e.response);
var dupl_str='duplicate key value violates unique constraint "busers_pkey"';
var check_email_fail='new row for relation "busers" violates check constraint "busers_email_check"';

loader.style.display="none";
bod.style.background="initial";
wrap.style.opacity="1";
outresult.style.display="block";
var er_msg='';
if(e.status==409 ){
red_label.style.color="red"; 
red_email.style.border="2px solid red";
outresult.style.background="pink";
if(e.response===dupl_str){
er_msg='Another user with this email already exists.';
}else if(e.response===check_email_fail){
er_msg='The email address you entered is not valid. Please try again.';
}else{er_msg=e.response}

}
//var er_msg=(e.status==409 ? 'This email is already occupied!' : 'Failed. Unknown reason');
console.log(e.response);
tohtml(outresult, '<p class="red">'+er_msg+'</p>');
}

red_email.oninput=function(e){
red_label.style.color="initial";
red_email.style.border="initial";
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
