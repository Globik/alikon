var head=require('./head');
var dev_pwd=process.env.DEV_PWD;
var login_css=require('./login_css.js');
var glocal_style=true;

var reset= n =>{
return `<!DOCTYPE html><html lang="en">
<head>
${head.head({title:"Reset Password", 
[`${glocal_style ? 'csshelper' : 'csslink'}`]:`${glocal_style ? `${login_css.login_css({})}` : `${get_local_style()}`}`})}

</head><body><main id="pagewrap">
<a href="/">home</a>
<h2>Reset Password</h2>
	<div id="loader"></div>
	<div id="wrap">
<form id="mform" method="post" action="/">
	<div class=""><p>
Enter your new account password below. Once confirmed, you'll be logged into your account and your new password will be active.
</p></div>

	<div class="email">
	<label><strong>Email</strong></label>
	<input type="email" name="email" value="gru5@yandex.ru" placeholder="email@example.com" required>
    </div>
<div class="password">
<label><strong>Password</strong></label>
<input type="password" name="password" placeholder="password" value="${dev_pwd ? dev_pwd : ''}" required autofocus pattern=".{6,}" maxlength="20">
</div>
<div class="hidden">
<input type="hidden" name="token" value="${n['reset-token']}">
<u class="blue"><small id="smally" class="blue">show password</small></u><span id="show_pwd"></span>
</div>
<div class="submit">
	<input type="submit" value="Save">
</div>	

</form>
</div>
<div id="outresult" class="animate-bottom"></div>

<script>
	var smally=gid("smally"),
	outresult=gid("outresult"),
	bod=document.getElementsByTagName('main')[0],
    form=gid("mform"),
    wrap=gid("wrap"),
	show_pwd=gid('show_pwd'),
    pwd=form.password,
		email=form.email,
		token=form.token,
	str_show="show password",
	str_hide="hide password";
	
	smally.onclick = if_show_pwd;
	smally.ontouchstart = if_show_pwd;
	pwd.oninput = go_show_pwd;
	
    form.onsubmit=function(ev){
	ev.preventDefault();
    form.style.opacity="0.2";
	bod.style.background="rgba(0,0,0,0.3)";
		loader.style.display="block";
	//setTimeout(notif,3000);
to_ajx();
	}			 
function notif(e){	
	loader.style.display="none";
	outresult.style.display="block";
    tohtml(outresult, '<p class="lightgreen"><h3>Password Change Complete!</h3>'+JSON.parse(e.response).message+'</p>');
	removeForm();
}

function notif_er(e){
loader.style.display="none";
bod.style.background="initial";
form.style.opacity="1";
outresult.style.display="block";
tohtml(outresult, '<p class="red">Status: '+e.status+' : '+e.response+'</p>');
}

function to_ajx(){
	//alert(pwd.value+' '+email.value+' '+token.value);
var xhr=new XMLHttpRequest();
var pars='password='+encodeURIComponent(pwd.value)+'&token='+encodeURIComponent(token.value)+'&email='+encodeURIComponent(email.value);
xhr.open("post","/reset/"+token.value);
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xhr.onload=function(evi){
if(xhr.status==200){
notif(this);
}else{
notif_er(this);
}}
xhr.onerror=function(e){alert('HERE ERROR-2 '+e);}
xhr.send(pars);
}
	
function removeForm(){
	form.style.display="none";
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
</main></body></html>
`;
};

function get_local_style(){
return `/css/login2.css`;
}
module.exports={reset};