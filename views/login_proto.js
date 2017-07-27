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
const login_proto=n=>{
return html`
<div id="loginery-wrap">
<form id="mform" name="mform" action="/login" method="post" onsubmit="baba(this);return false;">
<h4>Welcome. Please login.<a href="/" style="float:right;font-size:1em;">home</a></h4>
<span id="sessRed" class="${n.errmsg?'red':''}">${messi(n)}</span><br>
<label><strong>Email</strong> </label>
<input type="email" name="email" class="login-email ${n.errmsg?'redinput':''}" placeholder="E-mail" value="" required />
<label style=""><strong>Password</strong></label><a style="float:right;" href="/forgot"><strong>Lost your password?</strong></a>
<input type="password" name="password" class="login-pwd ${n.errmsg?'redinput':''}" placeholder="Password" value="" required />
<input type="submit" value="Log in" class="login-submit" ${n.user ? 'disabled':''}>
<div class="underform"><strong style="">No account yet?</strong><a href="/signup" style="float:right;">
<strong>Create one</strong></a><hr>
</div><div class="underform"><strong>Or you can sign in with:</strong></div>
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
</div>
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