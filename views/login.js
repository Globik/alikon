//login.js
const head=require('./head.js');
const login_css=require('./login_css.js');
const dev_user=process.env.DEV_USER;
const dev_pwd=process.env.DEV_PWD;
const timeout_login=5000;
//var dev_pwd="kuku";
const dev_email=process.env.DEV_EMAIL;
const login= n =>{
let {showmodule:{mainmenu,profiler}}=n;
const buser=n.user;
var fu=true;
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
	
return `<!DOCTYPE html><html lang="en"><head>${head.head({title:"Log in",cssl:["css/login2.css"]})}</head>
<body>
<main id="pagewrap">
<a class="nav" href="/">home</a><br>

<br>
<div id="wrap">
<h2>Welcome. Please login.</h2>
<div class="bott">
${n.errmsg ? `<span id="red-warnig">${messi(n.errmsg)}</span>` : ``}
<br><br><span id="sessRed" class="sess_orange"></span>
</div>
<form id="mform" name="mform" action="/login" method="post">
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
var si=0, sendto=true;
var formface=document.forms.namedItem("mform");
//formface.addEventListener('submit', baba, false);
function baba(ev){
si++;
var xhr=new XMLHttpRequest();
xhr.open(ev.target.method, ev.target.action);
xhr.setRequestHeader('Content-Type', 'application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
//alert(this.response);
var mata=JSON.parse(this.response);
sessRed.innerHTML=mata.info;
window.location.href=mata.redirect;
}else{
sessRed.innerHTML=this.response;
}
}

xhr.onerror=function(e){console.error('XHR onerror: '+e);sessRed.innerHTML='Internet connection lost.';}
var data={};
data.email=formface.email.value;
data.password=formface.password.value;

var mid=JSON.stringify(data);

if(window.sessionStorage){
if(sessionStorage.count){
sessionStorage.count=Number(sessionStorage.count)+1;
}else{
sessionStorage.count=1;
}
if(sessionStorage.count > 5){sessRed.innerHTML="Forgot your password? Go to <a href='/forgot'>reset</a> it.";
xhr_failed_login(ev);
setTimeout(go_wieder, 5000);
sendto=false;
}
function go_wieder(){
console.log('istablished');
sessionStorage.count=1;
sendto=true;
}
}else{
if(si>4){console.warn('great then 4');sendto=false;}
}

if(sendto){console.log('here');xhr.send(mid);}
ev.preventDefault();
}

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
if(e.target.email.value){
xhr.send(e.target.email.value);
}
}
</script>
</html>`;}
module.exports={login};
function getCssLink(){return `/css/login2.css`;}