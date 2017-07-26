var si=0, sendto=true;
//var formface=document.forms.namedItem("mform");
//formface.addEventListener('submit', baba, false);

function baba(ev){

si++;
var xhr=new XMLHttpRequest();
//alert(ev.method+ev.action)
xhr.open(ev.method, ev.action);
xhr.setRequestHeader('Content-Type', 'application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
//alert(this.response);
var mata=JSON.parse(this.response);
sessRed.innerHTML=mata.info;
window.location.href=mata.redirect;
}else{
sessRed.innerHTML=this.response;

}
}

xhr.onerror=function(e){console.error('XHR onerror: '+e);sessRed.innerHTML='Internet connection lost.';}
var data={};
data.email=ev.email.value;
data.password=ev.password.value;

var mid=JSON.stringify(data);
//alert(mid)

if(window.sessionStorage){
if(sessionStorage.count){
sessionStorage.count=Number(sessionStorage.count)+1;
}else{
sessionStorage.count=1;
}
if(sessionStorage.count > 5){
sessRed.innerHTML="Forgot your password? Go to <a href='/forgot'>reset</a> it.";

try{xhr_failed_login(ev);}catch(e){alert(e);console.log(e)}
setTimeout(go_wieder, 5000);
//ev.preventDefault();
//return false;
sendto=false;

}

function go_wieder(){
console.log('istablished');
sessionStorage.count=1;
sendto=true;
}

}else{
if(si>4){console.warn('great then 4');sendto=false;}
}
	if(sendto){
//console.log('here');
xhr.send(mid);
}
//return false;
//ev.preventDefault();

}

function xhr_failed_login(e){
//alert('a')
var xhr=new XMLHttpRequest();
xhr.open('post','/xhr_failed_login');
xhr.onload=function(evi){
if(xhr.status==200){
console.log('from server failed login process: '+this.response);
}else{
console.log(this.response);
}
}
xhr.onerror=function(e){console.error(e);}
if(e.email.value){
//alert(e.email.value)
xhr.send(e.email.value);
//return false;
}
}