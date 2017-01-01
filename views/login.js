//login.js
var head=require('./head'),
    header_menu=require('./header_menu');
    var dev_user=process.env.DEV_USER;
var dev_pwd=process.env.DEV_PWD;
var dev_email=process.env.DEV_EMAIL;
var login= n =>{
	let {buser,showmodule:{mainmenu,profiler}}=n;
return `<!DOCTYPE html><html lang="en"><head>${head.head({title:"Log in",csslink:`${getCssLink()}`,
csslink2:"/css/main2.css"})}</head>
<body><nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
<main id="pagewrap" style="backround:pink;">
${(n.message && n.message.length > 0 ? `<span id="red-warnig">${n.message}</span>` : ``)}
<div class="form-box">
<h2>ki</h2>
<form action="/login" method="post">
<div class="group">
<input type="email" name="email"  placeholder="E-mail" value="${dev_email ? dev_email : ''}" required />
<input type="password" name="password"  placeholder="Password" value="${dev_pwd ? dev_pwd : ''}" required />
</div>
<button>Sign In</button>
<p>No account yet? <a href="">Create one</a></p>
<!-- Already a member? Login -->
</form>
</div>

</main></body></html>`;}
module.exports={login};
function getCssLink(){return `/css/login.css`;}