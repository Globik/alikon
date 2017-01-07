var forgot= n =>{
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
<h1>forgot password</h1>
<h3>Enter Your Email</h3>
<form id="forgot-form" action="/forgot" method="post">
<input type="email" name="email"  placeholder="E-mail" value="" required /><br>

<button>Reset Password</button>
</form>
<script>
var spResult=document.getElementById("span-result");
var prBar=document.getElementById("prBar");

var signup_form=document.getElementById('forgot-form');
signup_form.onsubmit=function(eva){
//alert('submit!!! '+eva + ' : '+ajx_login_form.email.value);
prBar.innerHTML='<span class="green">connecting...</span>';
var email= signup_form.email.value;
//var pwd=signup_form.password.value;
//var username=signup_form.username.value;
alert(email+ ' : ');
var pars='email='+encodeURIComponent(email);



var xhr=new XMLHttpRequest();
xhr.open("post","/forgot");
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
</body></html>`;
}
module.exports={forgot};