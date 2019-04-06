const html_head=require('./html_head');
const dev_pwd=process.env.DEV_PWD;
const login_css=require('./login_css.js');
const {js_help}=require('../libs/helper.js');

const reset= n =>{
function messi(n){
let s='';
if(n){
if(n.success){s=n.message}else{s=`<b>Your Password Change Complete!</b><br><br>${n.message}`}
}
return s;
}
let classi=n=>{
let s='';
if(n.success){s+='green'}else{s+='red';}
return s;
}
return `<!DOCTYPE html><html lang="en">
<head>
${html_head.html_head({title:"Reset Password", cssl:["/css/login2.css"]})}
</head><body><main id="pagewrap">
<a href="/">home</a>
<div id="loginery-wrap">
<form id="mform" method="post" action="/reset/${n['reset-token']}">
<h4>Reset Password</h4>
<div class=""><p>
Enter your new account password below. Once confirmed, you'll be logged into your account and your new password will be active.
</p></div>
<span id="sessRed" class="${n.errmsg?classi(n.errmsg):''}">${messi(n.errmsg)}</span><br>
<label><strong>Email</strong></label>
<input type="email" class="login-email" name="email" value="" placeholder="Your email" required>
<label><strong>Password</strong></label>
<input type="password" class="login-pwd" name="password" placeholder="password" value="${dev_pwd ? dev_pwd : ''}" required autofocus pattern=".{6,}" maxlength="20">

<input type="hidden" name="token" value="${n['reset-token']}">
<u class="blue"><small id="smally" class="blue">show password</small></u><span id="show_pwd"></span>
<input type="submit" class="login-submit" value="Save" ${n.errmsg && n.errmsg.success ? 'disabled':''}>
</form>
</div>
<div id="outresult" class="animate-bottom"></div>
${js_help(['/js/reset.js'])}
</main></body></html>`;};
module.exports={reset};
