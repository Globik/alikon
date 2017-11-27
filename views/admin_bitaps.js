const file='admin_bitaps.js',fg=`<!-- ${file} -->`;
const head=require('./head.js');
const header_menu=require('./header_menu');
const admin_main_menu=require('./admin_main_menu'),footer=require('./footer');
var warnig=false,haupt_ban=false;
let admin_bitaps=n=>{
var {showmodule:{mainmenu,profiler}}=n;const buser=n.user;
return `<!DOCTYPE html><html lang="en"><head>${head.head({title:"bitaps", csslink:"/css/main2.css",luser:buser})}</head><body>
${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${haupt_ban?'<div id="haupt-banner"><div id="real-ban">Banner</div></div>':''}
${buser && buser.role=='superadmin'?admin_main_menu.admin_main_menu(n):''}
${fg}
<main id="pagewrap">
Hallo <b>${buser.name}</b><br>
<h1>Payment system</h1>
<form id="idpay1" method="post" action="/admin/conf_bitaps_payment" name="npay1">
${n.payment?get_payment_sys(n.payment):'<b>no payment system config file.</b>'}
<div><input type="submit" value="save" name="submit" disabled></div>
</form>
<br><button onclick="reload_pay_sys();">reload pay sys</button><br>
<script>
var g_psys_enabler=null;

function bp_enabler(el){
//alert(el.parentNode.parentNode.method)
try{
let f=el.value=="true"?true:false;
el.value=f?"false":"true";
idpay1.enabled.value=f?"false":"true";
el.textContent=f?"enable":"disable";
idpay1.submit.disabled=false;
}catch(e){alert(e);}}

idpay1.addEventListener('submit',send_pay_config,false);

function send_pay_config(ev){
let d=new FormData(ev.target);
if(!d)return;
var xhr=new XMLHttpRequest();
xhr.open(ev.target.method,ev.target.action,true);
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
alert(this.response)
let f;
try{
f=JSON.parse(this.response);
parse_pay_sys(f)
}catch(e){alert(e)}
}else{alert(this.response);}}
xhr.onerror=function(e){alert(e);}
xhr.send(d);
ev.preventDefault();
}

function parse_pay_sys(f){
if(!f.info && !f.info.enabled){return;}
g_psys_enabler=f.info.enabled=="true"?"YES!":f.info.enabled=="false"?"NO!":g_psys_enabler;
}

function reload_pay_sys(){
let d={};
d.type="pay_sys_reload";
var xhr=new XMLHttpRequest();
xhr.open('post','/admin/uncache_what',true);
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
alert(this.response)
try{
let b=JSON.parse(this.response);
if(b.info.type==d.type){
enablerMarker.textContent=g_psys_enabler;
}
}catch(e){alert(e)}
}
else{
alert(this.response);
}}
xhr.onerror=function(e){alert(e);}
xhr.send(JSON.stringify(d));
}
</script>
</main>${fg}<footer id="footer">${footer.footer({})}</footer></body></html>`;
}

module.exports={admin_bitaps};
function get_payment_sys(payment){
let s='';
let {name,enabled,test,real_adr,cold_adr,hotadr_quota,cb_part}=payment;
s+=`<div><b>name:</b><br><input type="text" name="name" value="${name}" readonly></div>`;
s+=`<div><b>enabled:</b><b id="enablerMarker">${enabled=="true"?'YES!':'NO!'}</b><br><input type="text" name="enabled" value="${enabled}">`;
s+=`<button value="${enabled}" onclick="bp_enabler(this);return false;">${enabled=="true"?'disable':'enable'}</button></div>`;
s+=`<div><b>test mode:</b><br><input type="text" name="test" value="${test}" readonly></div>`;
s+=`<div><b>hot address:</b><br><input type="text" name="real_adr" value="${real_adr}" readonly></div>`;
s+=`<div><b>cold address:</b><br><input type="text" name="cold_adr" value="${cold_adr}" readonly></div>`;
s+=`<div><b>hot address quote:</b><br><input type="text" name="hotadr_quota" value="${hotadr_quota}" readonly></div>`;
s+=`<div><b>callback:</b><br><input type="text" name="cb_part" value="${cb_part}" readonly></div>`;
return s;
}
/*
"enabled":true,
	"test":false,
	"name":"bitaps",
	"real_adr":false,
	"cold_adr":false,
	"hotadr_quota":60,
	"cb_part":"bitaps/cb"*/