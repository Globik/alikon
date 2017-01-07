var reset= n =>{
return `<!DOCTYPE html><html lang="en">
<head>
<meta charset="utf-8">
<title>Forgot password</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="shortcut icon" type="image/ico" href="/w4.png"> 
<!-- [if lt IE 9]><script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
<!-- [if lt IE 9]><script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script><![endif]-->
</head><body>
<a href="/">home</a>
<span id="span-result"></span>
<span id="prBar"></span>
<h1>Reset Password</h1><hr>
<b>Reset token: </b> <span id="reset-token">${n["reset-token"]}</span>
<form id="reset-form" method="post">
<h4>Your E-mail</h4>
<input type="email" name="email" placeholder="E-mail" required>
<h4>New Password</h4>
<input type="password" placeholder="New password" required>
<h4>Confirm Password</h4>
<input type="password" name="password" placeholder="Confirm password" required><br>
<input type="text" name="token" value="${n['reset-token']}" placeholder="${n['reset-token']}"><br>
<button>Update Password</button>
</form>
<script>
var spResult=document.getElementById("span-result");
var prBar=document.getElementById("prBar");

var signup_form=document.getElementById('reset-form');
signup_form.onsubmit=function(eva){
//alert('submit!!! '+eva + ' : '+ajx_login_form.email.value);
prBar.innerHTML='<span class="green">connecting...</span>';
var email= signup_form.email.value;
var pwd=signup_form.password.value;
var token=signup_form.token.value;
alert('pwd :'+pwd+ 'token : '+token);
var pars='password='+encodeURIComponent(pwd)+'&token='+encodeURIComponent(token)+'&email='+encodeURIComponent(email);

var xhr=new XMLHttpRequest();
xhr.open("post","/reset/"+token);
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xhr.onload=function(evi){
if(xhr.status==200){
//alert('from onsubmit: '+this.response+' : '+spResult);
prBar.innerHTML='';
spResult.textContent=this.response;

//var spi=JSON.parse(this.response).redirection;
//window.location.href=spi;

}else{
alert(this.response+' : '+this.status);
var lata=JSON.parse(this.response);
spResult=this.response;
prBar.innerHTML='<span class="orange"><b>'+lata.message+'</b></span>';
}
}
xhr.onerror=function(e){alert(e);}

xhr.send(pars);
eva.preventDefault();
}
</script>
</body></html>
`;
};
module.exports={reset};