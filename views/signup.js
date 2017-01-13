//signup.js
    var dev_user=process.env.DEV_USER;
var dev_pwd=process.env.DEV_PWD;
var dev_email=process.env.DEV_EMAIL;
var head=require('./head.js');
var signup = n =>{
return `<!DOCTYPE html><html lang="en"><head>
${head.head({title:"sign up", csslink:`${get_local_style()}`, csslink2:"/css/main2.css"})}
</head>
<body>
<main id="pagewrap" style="backround:pink;">
${(n.message && n.message.length > 0 ? `<span id="red-warnig">${n.message}</span>` : ``)}
<div class="form-box">k
<a href="/">home</a>
<span id="span-result"></span><br>
<span id="prBar"></span><br>

<form id="form" action="/signup" method="post">
<div class="group">
<input type="text" name="username" placeholder="Username" value="" required/> <br>
<input type="email" name="email"  placeholder="E-mail" value="" required /><br>
<input type="password" name="password"  placeholder="Password" value="" required /><br>
<!-- <input type="password" name="password"  placeholder="Password" value="" required /> -->

</div>
<button>Sign Up</button>
<p>Or <a href="">sign up via fb, vk</a></p>
 Already a member? Login 
</form>
</div>
<script>
var spResult=document.getElementById("span-result");
var prBar=document.getElementById("prBar");

var signup_form=document.getElementById('signup-form');
signup_form.onsubmit=function(eva){
//alert('submit!!! '+eva + ' : '+ajx_login_form.email.value);
prBar.innerHTML='<span class="green">connecting...</span>';
var email= signup_form.email.value;
var pwd=signup_form.password.value;
var username=signup_form.username.value;
alert(email+ ' : '+pwd+'  : '+username);
var pars='email='+encodeURIComponent(email)+'&password='+encodeURIComponent(pwd)+'&username='+encodeURIComponent(username);



var xhr=new XMLHttpRequest();
xhr.open("post","/signup");
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xhr.onload=function(evi){
if(xhr.status==200){
alert('from onsubmit: '+this.response+' : '+spResult);
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
</main></body></html>`;}
function get_local_style(){
return `/css/login2.css`;
}
module.exports={signup};
function getCssLink(){return `/css/login.css`;}