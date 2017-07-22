const dev_pwd=process.env.DEV_PWD;
//const timeout_login=5000;
//var dev_pwd="kuku";
const dev_email=process.env.DEV_EMAIL;
const login_proto=n=>{
return `

<form id="mform" name="mform" action="/login" method="post">
<h4>Welcome. Please login.</h4>
<div class="email ${n.message && n.message !==null ? "red-warning":""}" style=""><label><strong>Email</strong> </label>
<input type="email" name="email"  placeholder="E-mail" value="${dev_email ? dev_email : ''}" required />
</div>
<div class="password ${n.message && n.message !==null ? "red-warning":""}">
<label><strong>Password</strong> <a style="float:right;" href="/forgot">Lost your password?</a></label>
<input type="password" name="password"  placeholder="Password" value="${dev_pwd ? dev_pwd : ''}" required />
</div>
<div class="submit" id="bottom">
<input type="submit" value="Log in" >
</div>

<strong style="">No account yet?</strong>&nbsp&nbsp<a href="/signup">Create one</a>
<br><br><strong>Or you can sign in with:</strong>
</form>
<!--
<div id="bott" class="bott"><strong style="">
<a href="/auth/facebook">
<div class="soc-desc fb"><div class="soc-desc1">
<img src="/images/facebook-icon_64.png"/>
</div>
<span class="span-social">facebook</span>
</div>
	</a>
<a href="/auth/vkontakte"><div class="soc-desc vk"><div class="soc-desc1"><img src="/images/vk.png"/></div><span class="span-social">vkontakte</span>
	</div></a>
</div> -->
`;
}
module.exports={login_proto}