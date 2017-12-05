const file='admin_bitaps.js',fg=`<!-- ${file} -->`;
const head=require('./head.js');
const header_menu=require('./header_menu');
const admin_main_menu=require('./admin_main_menu'),footer=require('./footer');
var warnig=false,haupt_ban=false;
let admin_bitaps=n=>{
var {showmodule:{mainmenu,profiler}}=n;const buser=n.user;
return `<!DOCTYPE html><html lang="en"><head>${head.head({title:"bitaps", csslink:"/css/main2.css",luser:buser})}
</head><body>
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
<b>parol: </b><input id="bparol" type="text" value="mumia"><br>
<b>red_id: </b><div><span id="bapRedid"></span></div><br>
<b>act addr: </b><div><span id="actBapAdr"></span><br></div><br>
<b>reedem code: </b><div><span id="redeemBap"></span><br>
<button id="btnChkBalanceRc" onclick="check_balance_rc(this);">check balance</button>
</div><br>
<b>type: </b><div><span id="bapRcType"></span><br>
<button id="btnMakeRcActive" onclick="make_rc_active(this);">make active</button></div>
<b>invoice: </b><div><span id="bapInv"></span></div>
<b>cold address: </b><div><span id="coldAdr" contenteditable=true oninput="legin(this);"></span>
<br><button id="btnSaveColdAdr" onclick="saveColdAdr(this);">save cold address</button>
</div><br>
<br>
<br><button onclick="get_new_reedem_code();">get new reedem_code</button> 
<br><br><button onclick="geti();">get</button>

<script>
var g_psys_enabler=null;
var g_actual_rc;
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
vax(ev.target.method,ev.target.action,d,obusi,erl,true);//true means formdata, not an json set request header
ev.preventDefault();
}

function obusi(f){
if(!f.info && !f.info.enabled){return;}
console.warn('saved');
g_psys_enabler=f.info.enabled=="true"?"YES!":f.info.enabled=="false"?"NO!":g_psys_enabler;
}
var strty="pay_sys_reload";
function reload_pay_sys(){
let d={};
d.type=strty;
vax('post','/admin/uncache_what',d,omsuc,erl);
}

function omsuc(b){
console.log(miss(b))
try{
if(b.info.type==strty){
enablerMarker.textContent=g_psys_enabler;
}
}catch(er){alert(er)}
}

var g_cur_inv,g_cur_rc,g_cur_t,g_cur_adr;

function get_new_reedem_code(){
if(!bparol.value){alert('fill in parol field');return;}
let d={};
d.parol=bparol.value;
vax('post','/api/create_redeem_code',d,onsuc,erl);
}

function onsuc(e){
try{
let b=e;
let adr=actBapAdr.textContent=b.dbdec.red_adr;
g_cur_adr=adr;
let rc=redeemBap.textContent=b.dbdec.red_c;
g_cur_rc=rc;
btnChkBalanceRc.value=rc;
btnMakeRcActive.value=b.dbdec.red_id;
bapRedid.textContent=b.dbdec.red_id;
let t=bapRcType.textContent=b.dbdec.red_t;
g_cur_t=t;
let inv=bapInv.textContent=b.dbdec.red_inv;
g_cur_inv=inv;
coldAdr.textContent=b.dbdec.red_cold_adr;
btnSaveColdAdr.value=coldAdr.textContent;
}catch(er){alert(er)}
}
function legin(el){btnSaveColdAdr.value=el.textContent;}
function check_balance_rc(el){
if(!el.value){alert('redeem code not provided: '+el.value);return;}
//alert(el.value)
let d={};d.rc=el.value;
vax('post','/admin/check_balance_rc',d,onl,erl);
}

function make_rc_active(el){
if(!el.value){alert('no reedem code provided!');return;}
let d={}
d.rc_id=el.value;
vax('post','/make_rc_active',d,onl,erl);
}

function onl(e){alert(miss(e))}

function erl(e){alert('ajx err : '+e)}

function geti(){
vax('get','/mid/Bob',null,onl,erl)
}
function saveColdAdr(el){
if(el.value=='no'){alert(el.value+' cold address provided');return;}
let d={};d.cold_adr=el.value;d.red_id=bapRedid.textContent;
vax('post','/saveColdAdr',d,onl,erl)
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