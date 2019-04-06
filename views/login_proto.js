const dev_pwd=process.env.DEV_PWD;
//const timeout_login=5000;
const dev_email=process.env.DEV_EMAIL;
let messi=m=>{
let s='';
if(m.errmsg){
if(!m.errmsg.success)s=m.errmsg.error;
}
return s;
}
let classi=n=>{
let s='';
if(n.success){s+='green'}else{s+='red';}
return s;
}
const login_proto=n=>{
return html`
<section id="loginery-wrap">
<form id="mform" name="mform" action="/login" method="post" onsubmit="go_login(this);return false;">
<h4>Welcome. Please login.<a href="/" style="float:right;font-size:1em;">home</a></h4>
<span id="sessRed" class="${n.errmsg?classi(n.errmsg):''}">${messi(n)}</span><br>
<label><strong>Name</strong> </label>
<div class="inpwrap">
<input type="text" name="username"  class="login-email ${n.errmsg?'redinput':''}" placeholder="your name" value="globik" required />
</div>
<label style=""><strong>Password</strong></label><a style="float:right;" href="/forgot"><strong>Lost your password?</strong></a>
<div class="inpwrap">
<input type="password" name="password" class="login-pwd ${n.errmsg?'redinput':''}" placeholder="Password" value="1234" required />
</div>
<div class="submitWrap">
<input type="submit" value="Log in" class="login-submit" ${n.user ? 'disabled':''}>
</div>
<div class="underform"><strong style="">No account yet?</strong><a href="/signup" style="float:right;">
<strong>Create one</strong></a><hr>
</div>
</form>
</section>
`;
}
module.exports={login_proto}
function html(s,...v){
let r='';
for(let i=0;i<v.length;i++){
r+=s[i];
r+=v[i];
}
r+=s[s.length-1];
return r.replace(/\n/g,'');
}
