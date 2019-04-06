const head=require('./head.js'),login_css=require('./login_css.js');
const {js_help}=require('../libs/helper.js');

const forgot= n =>{
function messi(n){
let s='';
if(n.errmsg && n.errmsg.message){
if(!n.errmsg.success){
if(n.errmsg.message.includes('tokens_email_fkey'))s+='No such email addresse'
}else{s+=n.errmsg.message;}}
return s}
let classi=n=>{
let s='';
if(n.success){s+='green'}else{s+='red';}
return s;
}
return `<!DOCTYPE html><html lang="en">
<head>
${head.head({title:"Reset Password",cssl:["/css/login2.css"] })}
</head><body>
<main id="pagewrap">
<a href="/">home</a>
<div id="loginery-wrap">
<form id="mform" action="/forgot" method="post">
<h4>Forgot your password?</h4>
<p>
Enter your email address below to reset your password. 
You will be sent an email  which you will need to open to continue. 
You may need to check your spam folder.
</p>
<span id="sessRed" class="${n.errmsg?classi(n.errmsg):''}">${messi(n)}</span><br>
<label><strong>Email</strong></label>
<input type="email" name="email" class="login-email ${(n.errmsg)?`${n.errmsg.success?'':'redinput'}`:''}" placeholder="E-mail" value="gru5@yandex.ru" required />
<input type="submit" class="login-submit" value="Reset" ${n.errmsg && n.errmsg.success ? 'disabled':''}>
<div class="underform">
<small><a href="/login">Back to log in</a></small>
</div>
</form>
</div>
<div id="outresult" class="animate-bottom"></div>
${js_help(['/js/forgot.js'])}
</main></body></html>`;
}
module.exports={forgot};