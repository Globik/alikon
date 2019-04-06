//signup.js
var dev_user=process.env.DEV_USER,
dev_pwd=process.env.DEV_PWD,
dev_email=process.env.DEV_EMAIL;
const login_css=require('./login_css.js'),
html_head=require('./html_head.js');
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
let classi=n=>{
let s='';
if(n.success){s+='green'}else{s+='red';}
return s;
}
return html`<!DOCTYPE html><html lang="en">
<head>
${html_head.html_head({title:"sign up",cssl:["/css/login2.css"]})}
</head>
<body>

<main id="pagewrap">
<section id="loginery-wrap">
<form id="mform" name="mform" action="/signup" method="post">
<h4>Welcome. Please sign up.<a href="/" style="float:right;font-size:1em;">home</a></h4>
<span id="sessRed" class="${n.errmsg?classi(n.errmsg):''}">${messi(n.errmsg)}</span><br>

<label><strong>Username</strong></label>&nbsp;&nbsp;<span id="nameout"></span>
<div class="inpwrap"><input type="text" class="login-text" style="${do_inp()}" name="username" maxlength="20" placeholder="Username" value="mark" required/></div>

<label><strong>Age</strong></label><div class="inpwrap">
<input type="number" name="age" class="login-age" placeholder="your age" min="6" max="100" required>
</div>

<label><strong>Gender</strong></label>
<div class="inpwrap" style=""><label style="">
<input style="vertical-align:middle;" type="radio" name="fem" value="true" checked/><strong class="fem">female</strong></label>
</div>
<div class="inpwrap">
<label><input  style="vertical-align:middle;" type="radio"  name="fem" value="false"/><strong class="fem">male</strong></label></div>


<!--
<label><strong>Email</strong></label>&nbsp;&nbsp;<span id="mailout"></span>
<input type="email" class="login-email" name="email" style="" placeholder="E-mail" value="ag@yandex.ru" required/>
-->
<label for="password"><strong>Password</strong></label><label style="margin-left:10px;"><!-- <strong>show password</strong>--></label>
<div class="inpwrap">
<!-- required pattern=".{6,}" -->
<input type="password" id="password" name="password"
class="login-pwd" placeholder="Password" value="${dev_pwd?dev_pwd:''}"  maxlength="20"/>
<label id="lShow" onclick="show_pwd(this);" title="show password">
<strong id="sShow">show</strong></label></div>
<small id="smally" class="blue">By creating an account you agree to our <a href="/">Terms & Privacy</a></small>
<div class="submitWrap">
<input type="submit" class="login-submit" value="Sign Up"${n.user?'disabled':''}>
</div>
<div class="underform"><strong>Already a member?</strong> <a href="/login" style="margin-left:20px;color:blue;"><b>Login</b></a></div><hr>
</form>
</section>

<div id="outresult" class="animate-bottom">buuu</div>

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
