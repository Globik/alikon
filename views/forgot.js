var head=require('./head.js');
var forgot= n =>{
return `<!DOCTYPE html><html lang="en">
<head>
${head.head({title:"Reset Password", csslink:`${get_local_style()}`, csslink2:"/css/main2.css"})}

</head><body>
<a href="/">home</a>
<div id="loader"></div>

<form id="mform" action="/forgot" method="post">
<div class="imgcontainer">img</div>
	<div class="container">
		<label>Email</label>
<input type="email" name="email"  placeholder="E-mail" value="" required /><br>

<button>Reset Password</button>
</div>
<div class="imgcontainer">crc</div>
</form>
<div id="outresult" class="animate-bottom"></div>
<script>
outresult=gid("outresult"),
bod=document.getElementsByTagName('body')[0],
mform=document.getElementById('mform'),
email=mform.email;

mform.onsubmit=function(ev){
ev.preventDefault();
mform.style.opacity="0.2";
bod.style.background="rgba(0,0,0,0.3)";
loader.style.display="block";
to_ajx();
}
function to_ajx(){
var pars='email='+encodeURIComponent(email.value);
var xhr=new XMLHttpRequest();
xhr.open("post","/forgot");
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xhr.onload=function(evi){
if(xhr.status==200){ notif(this);
}else{
notif_er(this);
}
}
xhr.onerror=function(e){alert(e);}
xhr.send(pars);
}

function notif(e){	
	loader.style.display="none";
	outresult.style.display="block";
    tohtml(outresult, '<p class="lightgreen">'+JSON.parse(e.response).message+'</p>');
	removeForm();
}

function notif_er(e){
loader.style.display="none";
bod.style.background="initial";
mform.style.opacity="1";
outresult.style.display="block";
tohtml(outresult, '<p class="red">Status: '+e.status+' : '+e.response+'</p>');
}

function removeForm(){
	mform.style.display="none";
bod.style.background="initial";
	mform.onsubmit=null;
}

function tohtml(s, v){return s.innerHTML=v;}
function totext(s, v){return s.textContent=v;}
function gid(id){return document.getElementById(id);}
</script>
</body></html>`;
}
function get_local_style(){
return `/css/login2.css`;
}
module.exports={forgot};