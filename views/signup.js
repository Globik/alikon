//signup.js
var dev_user=process.env.DEV_USER,
dev_pwd=process.env.DEV_PWD,
dev_email=process.env.DEV_EMAIL;
const login_css=require('./login_css.js'),
head=require('./head.js');
const {js_help}=require('../libs/helper.js');

var fu=true;var fu2=true;
const signup = n =>{
	
let messi=m=>{
console.log('msg: ',m)
let s='';
if(m){
if(!m.success){
if(m.code){
if(m.code=='23505'){
if(m.bcode==2){s=m.message;fu2=false;}else if(m.bcode==1){
s=m.message;
fu=false;
}else{s+=m.message}

}else{
s=m.message;
}
}else{s=m.message;}
}else{s+=`${m.msg ? m.msg : ''}`}
	}
return s;
}
let f='border:2px solid red;color:red;'
function do_inp(){
let s='';
if(!fu)s+=f;fu=true;
return s;
}
function do_inp2(){
let s='';
if(!fu2)s+=f;fu2=true;
return s;
}
return `<!DOCTYPE html><html lang="en">
<head>
${head.head({title:"sign up",cssl:["/css/login2.css"]})}
</head>
<body>
<main id="pagewrap">
<div id="loginery-wrap">
<form id="mform" name="mform" action="/signup" method="post">
<h4>Welcome. Please sign up.<a href="/" style="float:right;font-size:1em;">home</a></h4>
<span id="sessRed" class="${n.errmsg?'red':''}">${messi(n.errmsg)}</span><br>

<label><strong>Username</strong></label>&nbsp;&nbsp;<span id="nameout"></span>
<input type="text" class="login-text" style="${do_inp()}" name="username" placeholder="Username" value="mark" required/>
<label><strong>Email</strong></label>&nbsp;&nbsp;<span id="mailout"></span>
<input type="email" class="login-email" name="email" style="${do_inp2()}" placeholder="E-mail" value="ag@yandex.ru" required/>

<label><strong>Password</strong></label>
<input type="password" name="password"
class="login-pwd" placeholder="Password" value="${dev_pwd ? dev_pwd : ''}" required pattern=".{6,}" maxlength="20"/><br>
<u class="blue"><small id="smally" class="blue">show password</small></u><span id="show_pwd"></span>

<input type="submit" class="login-submit" value="Sign Up" ${n.user?'disabled':''}>

<div class="underform"><strong>Already a member?</strong> <a href="/login" style="float:right;">Login</a></div>
<div class="underform"><strong>Or you can sign in with:</strong></div>
<a href="/auth/facebook">
<div class="soc-part fb">
<div class="soc-icon"><img src="/images/facebook-icon_64.png"/></div><div class="soc-besch"><span>facebook</span></div>
</div>
</a>
<a href="/auth/vkontakte">
<div class="soc-part vk">
<div class="soc-icon"><img src="/images/vk.png"></div><div class="soc-besch"><span>vk</span></div>
</div>
</a>
</form>
<div id="outresult" class="animate-bottom">buuu</div>
</div>
${js_help(['/js/signup.js'])}
</main></body></html>`;}
module.exports={signup};
function html(s,...v){
let r='';
for(let i=0;i<v.length;i++){
r+=s[i];
r+=v[i];
}
r+=s[s.length-1];
return r.replace(/\n/g,'');
}