//admin_bitaps.js
const head=require('./head.js');
const header_menu=require('./header_menu');
const admin_main_menu=require('./admin_main_menu');
const footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;
let admin_bitaps=n=>{
var {showmodule:{mainmenu,profiler}}=n;const buser=n.user;
	console.log('PAYMENT from admin_bitaps.js: ',n.payment)
return `<!DOCTYPE html><html lang="en"><head>${head.head({title:"bitaps", csslink:"/css/main2.css"})}</head><body>
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap">
<h1>Payment system</h1>
<form id="idpay1" method="post" action="/admin/conf_bitaps_payment" name="npay1">
${n.payment?get_payment_sys(n.payment):'<b>no payment system config file.</b>'}
<div><input type="submit" value="save" name="submit" disabled></div>
</form>
<b>hallo ${buser.name}</b><br>
<button onclick="duck();">duck</button><br>
<output id="mout"></output>
<output id="mout2"></output>
<h4>prior</h4>
<input type="text" id="prior" data-name="bitaps" value=""/><br>
<button onclick="do_fucking();">do fucking</button><br>
<script>
var gobject;
function duck(){
let d={};
let xhr=new XMLHttpRequest();
xhr.open('post','/api/payment_system');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
//mout.textContent=this.response;

try{let v=JSON.parse(this.response);
let g=JSON.stringify(v.m.pays);
mout.textContent=g;
gobject=v.m.pays;
//console.log(v.m.pays)
do_proc(v);}catch(e){mout.textContent=e;return;}
}else{
mout.textContent=this.response;
}}
xhr.onerror=function(e){console.log(this.response + e)}
d.fn="payment_system";
xhr.send(JSON.stringify(d));
}

function do_proc(d){
//alert(d.m.pays[0].name)
prior.value=d.m.pays[0].prior;
}

function do_fucking(){
//alert(prior.value);
gobject.forEach(function(el,i){
if(el.name=="bitaps"){
console.log(i)
gobject[i].prior=prior.value;
}
})
dobisch();
}
function dobisch(){
let a=JSON.stringify(gobject);
mout2.textContent=a;
}
function bp_enabler(el){
//alert(el.parentNode.parentNode.method)
try{if(el.value=="true"){
el.value="false";
idpay1.enabled.value="false";
el.textContent="enable";
}else{el.value="true";
idpay1.enabled.value="true";
el.textContent="disable";
}
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
}
else{
alert(this.response);
}}
xhr.onerror=function(e){alert(e);}
xhr.send(d);
ev.preventDefault();
}
</script>
</main><footer id="footer">${footer.footer({})}</footer></body></html>`;
}

module.exports={admin_bitaps};
function get_payment_sys(payment){
let s='';
let {name,enabled,test,real_adr,cold_adr,hotadr_quota,cb_part}=payment;
s+=`<div><b>name:</b><br><input type="text" name="name" value="${name}" readonly></div>`;
s+=`<div><b>enabled:</b><b>${enabled==true?'YES!':'NO!'}</b><br><input type="text" name="enabled" value="${enabled}">`;
s+=`<button value="${enabled}" onclick="bp_enabler(this);return false;">${enabled==true?'disable':'enable'}</button></div>`;
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










