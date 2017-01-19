//login.js
var head=require('./head.js');
var dev_user=process.env.DEV_USER;
var dev_pwd=process.env.DEV_PWD;
var dev_email=process.env.DEV_EMAIL;
var login= n =>{
	let {buser,showmodule:{mainmenu,profiler}}=n;
return `<!DOCTYPE html><html lang="en"><head>${head.head({title:"Log in",csslink:`${getCssLink()}`})}</head>
<body>
<main id="pagewrap" style="backround:pink;">
<a href="/">home</a>
${n.message && n.message !== null ? `<span id="red-warnig">${n.message}</span>` : ``}
<div class="form-box">

<form action="/login" method="post">
<div class="imgcontainer">img</div>
	<div class="container">
	<label>Email</label>
<input type="email" name="email"  placeholder="E-mail" value="${dev_email ? dev_email : ''}" required />
<label>Password</label>
<input type="password" name="password"  placeholder="Password" value="${dev_pwd ? dev_pwd : ''}" required />

<button>Sign In</button>
</div><div class="imgcontainer">
<p>No account yet? <a href="/signup">Create one</a></p>
<p>Forgot a password? <a href="/forgot">reset password</a></p>
</div>
</form>
</div>

</main></body></html>`;}
module.exports={login};
function getCssLink(){return `/css/login2.css`;}