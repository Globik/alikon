const file='admin_bitaps.js',fg=`<!-- ${file} -->`;
const head=require('./head.js'),header_menu=require('./header_menu');
const admin_main_menu=require('./admin_main_menu'),footer=require('./footer'),
	  admin_v_bitaps_reedem=require('./admin_v_bitaps_reedem.js');
var warnig=false,haupt_ban=false;
let admin_bitaps=n=>{
var {showmodule:{mainmenu,profiler}}=n;const buser=n.user;
return `<!DOCTYPE html><html lang="en"><head>${head.head({title:"bitaps", csslink:"/css/main2.css",luser:buser})}
<style>table,th,td{border:1px solid black;}
table.rd-info.tododelete{background:red;color:green;}
.bggreen{background:green;}
form[name=formrdtype]{background:red;display:inline;}
td button{background:violet;height:100%;width:100%;margin:0;padding:0;border:none;}
td:nth-child(3) {background:violet;}

@media screen and (max-width:700px){
			body{background:lightgreen;}
			table{width:100%;}
			td{display:block;}
/*
			td:nth-child(3) {background:green;color:red;}
			tr:nth-child(odd) {background:gray;}
			tr:nth-child(even) {background:lightblue;}
*/
			thead{display:none;}
		}
</style>
</head><body>
${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${haupt_ban?'<div id="haupt-banner"><div id="real-ban">Banner</div></div>':''}
${buser && buser.role=='superadmin'?admin_main_menu.admin_main_menu(n):''}
${fg}
<main id="pagewrap">
Hallo <b>${buser.name}</b><br>
<h1>Bitaps payment configuration.</h1>
<b> from personal wallet: </b>${n.cwa?n.cwa:''}
<form id="idpay1" method="post" action="/admin/conf_bitaps_payment" name="npay1">
${n.payment?get_payment_sys(n.payment):'<b>no payment system config file.</b>'}
<div><input type="submit" value="save" name="submit" disabled></div>
</form>
<br><button onclick="reload_pay_sys();">reload pay sys</button><br>
<b>parol: </b><input id="bparol" type="text" value="mumia"><br>
<b>error: </b>${n.error?n.error:'no error'}
${n.curd?n.curd.rd_id:'<h5>no reedem data.</h5>'}
<br>${admin_v_bitaps_reedem.admin_v_bitaps_reedem(n)}<br>
<hr><button onclick="get_new_reedem_code();">get new reedem_code</button><br>
<section id="redIn"></section>
<hr>
<br><b>how much: </b>${n.dmount?n.dmount:'0'}<br>
<button onclick="showMore();">show more reedems!</button><br>
<section id="redIn2"></section>

<script>
var g_psys_enabler=null;
var g_actual_rc;
function bp_enabler(el){
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

function get_new_reedem_code(){
if(!bparol.value){alert('fill in parol field');return;}
let d={};
d.parol=bparol.value;
vax('post','/api/create_redeem_code',d,onsuc,erl);
}


function onsuc(e){
if(!e.htmlbody){alert('no htmlbody attr found!');return;}
redIn.innerHTML=e.htmlbody;

}
function legin(el){}

function check_balance_rc(el){
if(!el.value){message_box('redeem code not provided.');return;}
let enc=el.getAttribute('data-enc')
let d={}
if(enc=='true'){
if(!bparol.value){message_box('fill in parol field!');return;}
d.parol=bparol.value;
}
d.rc=el.value;d.enc=enc;
vax('post','/admin/check_balance_rc',d,on_bal,on_bal_er);
el.classList.add('bggreen');
}
function on_bal(e){
rem('bggreen');
message_box(e.b.address);
}
function on_bal_er(e){
rem('bggreen')
message_box(e);
}
function rem(d){
let l=document.querySelector('.'+d);
if(l)l.classList.remove(d);
}
function make_rc_active(el){
let dTbody=el.parentElement.parentElement.parentElement;
if(!dTbody){message_box('No tbody element found!');retrun;}
let dForm=el.parentElement.previousElementSibling.firstChild;
if(!dForm){message_box('No form element found! It looks like you have an old browser.');return;}
let c=dForm.f.value;
let rdid=dTbody.getAttribute('data-rdid');
let cadr=dTbody.rows[5].cells[1].textContent;
//alert(c+' '+rdid+' '+cadr)
if(!rdid || !c){mesage_box('no id or no type of reedem provided!');return;}
if(c=='a'){
if(cadr=='no'){message_box('No cold address provided!');return;}
}
let d={};
d.rd_id=rdid;
d.rd_t=c;
d.cold_adr=cadr;
vax('post','/make_rc_active',d,svd_hot_adr,erl);
dTbody.classList.add('bggreen');
}

function onl(e){alert(miss(e))}

function erl(e){message_box('ajx err : '+e);rem('bggreen')}

function geti(){
vax('get','/mid/Bob',null,onl,erl)
}
function save_cold(el){
let tbody=el.parentElement.parentElement.parentElement;
if(!tbody){message_box('no tbody found');return;}
let rdid=tbody.getAttribute('data-rdid');
let cadr1=el.parentElement.previousElementSibling;
if(!cadr1)return;
let cadr=cadr1.textContent;
//alert(rdid+' '+cadr);
if(!rdid || !cadr){message_box('no id or cold address provided!');return;}
if(cadr=='no'){message_box('no cold address provided!');return;}
let d={};
d.rd_id=rdid;
d.cold_adr=cadr;
vax('post','/saveColdAdr',d,svd_cold_adr,erl)
}

function svd_cold_adr(d){
//if(!d)return;
//if(d.info=='ok') idpay1.cold_adr.value="true";
}
function svd_hot_adr(e){
alert(miss(e))
//if(!e)return;
//if(e.info=='ok'){idpay1.real_adr.value="true";}
}
function showMore(){
let d={};d.show=true;
vax('post','/admin/more_reedem',d,show2,erl)
}
function show2(e){
if(!e.htmlbody){alert('no htmlbody attr found!');return;}
redIn2.innerHTML=e.htmlbody;
}
function delete_redeem(el){
let v=el.parentElement.parentElement.parentElement;
let id=v.getAttribute('data-rdid');
let typ=v.getAttribute('data-type');
if(!id || !typ){message_box('id or type is not provided. Sorry.');return;}
//if(typ=='a'){message_box("It's active. Make it passive and then you can delete it.");return;}
//alert('typ: '+typ+' id: '+id)
let su=v.parentElement;
let d={};
d.rdid=id;
d.typ=typ;
su.classList+=" tododelete";
vax('post','/admin/api/delete_redeem',d,on_rd_del,er_on_rd_del);
}
function on_rd_del(e){
let vel=document.querySelector('.rd-info.tododelete');
if(!vel)return;
vel.remove();
}
function er_on_rd_del(e){
message_box(e);
let veli=document.querySelector('.rd-info.tododelete');
veli.classList.remove('tododelete')
}
</script>
</main>${fg}<footer id="footer">${footer.footer({})}</footer></body></html>`;
}

module.exports={admin_bitaps};
function get_payment_sys(payment){
let s='';
let {name,enabled,test,real_adr,cold_adr,hotadr_quota,grund,cb_part}=payment;
s+=`<div><b>name:</b><br><input type="text" name="name" value="${name}" readonly></div>`;
s+=`<div><b>enabled:</b><b id="enablerMarker">${enabled=="true"?'YES!':'NO!'}</b><br><input type="text" name="enabled" value="${enabled}">`;
s+=`<button value="${enabled}" onclick="bp_enabler(this);return false;">${enabled=="true"?'disable':'enable'}</button></div>`;
s+=`<div><b>test mode:</b><br><input type="text" name="test" value="${test}" readonly></div>`;
s+=`<div><b>hot address quote:</b><br><input type="text" name="hotadr_quota" value="${hotadr_quota}" readonly></div>`;
s+=`<div><b>base url api: </b><br><input type="text" name="grund" value="${grund}" readonly></div>`;
s+=`<div><b>callback:</b><br><input type="text" name="cb_part" value="${cb_part}" readonly></div>`;
return s;
}
/*
"enabled":true,
	"test":false,
	"name":"bitaps",
	"hotadr_quota":60,
	"cb_part":"bitaps/cb"*/