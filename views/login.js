//login.js
const head=require('./head.js');
const login_css=require('./login_css.js');
const dev_user=process.env.DEV_USER;
const dev_pwd=process.env.DEV_PWD;
const timeout_login=5000;
//var dev_pwd="kuku";
const dev_email=process.env.DEV_EMAIL;
var login= n =>{
	let {buser,showmodule:{mainmenu,profiler}}=n;
return `<!DOCTYPE html><html lang="en"><head>${head.head({title:"Log in",cssl:["css/login2.css"]})}</head>
<body>
<main id="pagewrap">
<a class="nav" href="/">home</a><br>

<br>
<div id="wrap">
<h2>Welcome. Please login.</h2>
<div class="bott">
${n.message && n.message !== null ? `<span id="red-warnig">${n.message}</span>` : ``}
<br><br><span id="sessRed" class="sess_orange"></span>
</div>
<form id="mform" action="/login" method="post">

<div class="email ${n.message && n.message !==null ? "red-warning":""}" style=""><label><strong>Email</strong> </label>
<input type="email" name="email"  placeholder="E-mail" value="${dev_email ? dev_email : ''}" required />
</div>
<div class="password ${n.message && n.message !==null ? "red-warning":""}">
<label><strong>Password</strong> <a style="float:right;" href="/forgot">Lost your password?</a></label>
<input type="password" name="password"  placeholder="Password" value="${dev_pwd ? dev_pwd : ''}" required />
</div>
<div class="submit" id="bottom">
<input type="submit" value="Log in" >
</div></form>

<div id="bott" class="bott"><strong style="">No account yet?</strong>&nbsp&nbsp<a href="/signup">Create one</a>
<br><br><strong>Or you can sign in with:</strong><br><br>

<a href="/auth/facebook"><div class="soc-desc fb"><div class="soc-desc1"><img src="/images/facebook-icon_64.png"/></div><span class="span-social">facebook</span></div>
	</a>

<a href="/auth/vkontakte"><div class="soc-desc vk"><div class="soc-desc1"><img src="/images/vk.png"/></div><span class="span-social">vkontakte</span>
	</div>
	</a>
	
</div>
</div>
</main></body>
<script>

if(window.sessionStorage){
//alert('session storage supported');
mform.onsubmit=function(e){
if(sessionStorage.count){
sessionStorage.count=Number(sessionStorage.count)+1;
}else{
sessionStorage.count=1;
}
//sessRed.textContent=sessionStorage.count;

if(sessionStorage.count > 5){sessRed.innerHTML="Forgot your password? Go to <a href='/forgot'>reset</a> it.";
xhr_failed_login(e);
//setTimeout(go_wieder, 5000);
return false;
}
function go_wieder(){
sessionStorage.count=1;
return true;
}
}
}else{alert('sessionstorage not supported!')}

function xhr_failed_login(e){
//alert(e.target.email.value);
var xhr=new XMLHttpRequest();
xhr.open('post','/xhr_failed_login');
xhr.onload=function(evi){
if(xhr.status==200){
alert(this.response);
}else{
alert(this.response);
}
}
xhr.onerror=function(e){console.log(e);}
if(e.target.email.value){
xhr.send(e.target.email.value);
}
}
</script>
</html>`;}
module.exports={login};
function getCssLink(){return `/css/login2.css`;}