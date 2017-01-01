var dev_user=process.env.DEV_USER;
var dev_pwd=process.env.DEV_PWD;
var dev_email=process.env.DEV_EMAIL;
var do_login_parol=n=> `<b> halie hallo from do_login_parol</b><br>

<div  id="mudle" class="form-box">
<h2>ki</h2>
<form id="ajx-login-form" action="/custom_login" method="post" name="login-form">
<div class="group">
<input type="email" name="email"  placeholder="E-mail" value="${dev_email ? dev_email : ''}" required />
<input type="password" name="password"  placeholder="Password" value="${dev_pwd ? dev_pwd : ''}" required />
</div>
<input type="submit" value="Sign In">
<p>No account yet? <a href="">Create one</a></p>
<!-- Already a member? Login -->
</form>
</div>`;
module.exports={do_login_parol};

// from main site
pub.post('/login', function*(next) {
var ctx = this;yield* passport.authenticate('local',function*(err, user,info) {if (err) throw err;
if (!user) {ctx.session.messaga=[info.message];
	ctx.body={message: ctx.session.messaga};} else {yield ctx.login(user);ctx.body={"redirection": ctx.session.dorthin};}}).call(this, next)});


<dialog id="dialog_login_parol">
<span id="prBar" class="prBar"></span><br>
<span id="span-result"></span><br>
<button onclick="close_dialog_login_parol()">close</button><br>

<output id="login_parol">login:

</output>

</dialog>
//end
<button id="login_parol_btn" onclick="do_login_parol();">ajx-login</button>

<script>
var prBar=document.getElementById('prBar');
var spResult=null;
function do_login_parol(el){
alert(el.value);
	var xhr=new XMLHttpRequest();


	xhr.open('get','/do_login_parol');
	xhr.onload=function(e){
	if(xhr.status==200){
if(ishtmlelementsupported('dialog')){
    show_login_parol();
    muddy(this);}
else{alert('fuck');
window.location.href=el.value;
}
	}
	else{alert(this.response);}
}
 xhr.onerror=function(e){alert('error'+e);}
 xhr.send();

}
var di=document.getElementById("dialog_login_parol");
function show_login_parol(){
di.show();
}
function close_dialog_login_parol(){
di.close();
}


function muddy(ev){

spResult=document.getElementById("span-result");
login_parol.innerHTML=ev.response;
var ajx_login_form=document.getElementById('ajx-login-form');
ajx_login_form.onsubmit=function(eva){
//alert('submit!!! '+eva + ' : '+ajx_login_form.email.value);
prBar.innerHTML='<span class="green">connecting...</span>';
var email=ajx_login_form.email.value;
var pwd=ajx_login_form.password.value;
var pars='email='+encodeURIComponent(email)+'&password='+encodeURIComponent(pwd);



var xhr=new XMLHttpRequest();
xhr.open("post","/custom_login");
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xhr.onload=function(evi){
if(xhr.status==200){
//alert('from onsubmit: '+this.response+' : '+spResult);
prBar.innerHTML='';
spResult.textContent=this.response;

var spi=JSON.parse(this.response).redirection;
window.location.href=spi;

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
}

//if(typeof HTMLDialogElement ==='function'){alert('htmldialogelement is supported')}else{alert('no')}
function ishtmlelementsupported(elem){
return (Object.prototype.toString.call(document.createElement(elem)) !== '[object HTMLUnknownElement]');
}


</script>
