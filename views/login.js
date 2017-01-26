//login.js
var head=require('./head.js');
var login_css=require('./login_css.js');
var dev_user=process.env.DEV_USER;
var dev_pwd=process.env.DEV_PWD;
var dev_email=process.env.DEV_EMAIL;
var login= n =>{
	let {buser,showmodule:{mainmenu,profiler}}=n;
return `<!DOCTYPE html><html lang="en"><head>${head.head({title:"Log in",csshelper:`${login_css.login_css({})}`})}</head>
<body>
<main id="pagewrap">
<a href="/">home</a><br>
${n.message && n.message !== null ? `<span id="red-warnig">${n.message}</span>` : ``}

<div id="wrap">
<h2>Welcome. Please login.</h2>
<form id="mform" action="/login" method="post">

<div class="email" style=""><label><strong>Email</strong> </label>
<input type="email" name="email"  placeholder="E-mail" value="${dev_email ? dev_email : ''}" required />
</div>
<div class="password">
<label><strong>Password</strong> <a style="float:right;" href="/forgot">Lost your password?</a></label>
<input type="password" name="password"  placeholder="Password" value="${dev_pwd ? dev_pwd : ''}" required />
</div>
<div class="submit" id="bottom">
<input type="submit" value="Log in" >
</div></form>

<div id="bott"><strong style="">No account yet?</strong>&nbsp&nbsp<a href="/signup">Create one</a>
<br><br><strong>Or you can sign in with:</strong><br><br>
<div class="fb">
<div class="soc-desc1"><img src="/images/facebook-icon_64.png"/></div><a href=""><div class="soc-desc"><span>facebook</span></div>
	</a></div>
<div class="vk">
<div class="soc-desc1"><img src="/images/vk.png"/></div><a href=""><div class="soc-desc"><span>vkontakte</span>
	</div>
	</a></div>
	
</div>
</div>
</main></body></html>`;}
module.exports={login};
function getCssLink(){return `/css/login2.css`;}