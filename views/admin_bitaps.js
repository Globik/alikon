const file='admin_bitaps.js',fg=`<!-- ${file} -->`;
const head=require('./head.js'),header_menu=require('./header_menu');
const admin_main_menu=require('./admin_main_menu'),footer=require('./footer'),
	  admin_v_bitaps_reedem=require('./admin_v_bitaps_reedem.js');
var warnig=false,haupt_ban=false;
let admin_bitaps=n=>{
var {showmodule:{mainmenu,profiler}}=n;const buser=n.user;
return `<!DOCTYPE html><html lang="en"><head>${head.head({title:"bitaps", csslink:"/css/main2.css",luser:buser})}
<style>
table{border-collapse:collapse;}
.greeny{background:green;}

table,tr,td,caption{border:1px solid black;padding:0.8rem;}


caption{border-bottom:none;}
table th{padding:0.8rem;}
thead{background:#4caf50;color:white;}
.tododelete{background:red;}
		
form[name=formrd]{background:inherit;display:inline;padding:0.2rem;border:2px solid green;border-radius:2px;}
form[name=formrd] input[type=radio]{vertical-align:top;background:red;color:red;}
tfoot{background:silver;}
/*
tbody tr:nth-child(odd) {background:white;padding:0.5em;}
tbody tr:nth-child(even) {background:lightgreen;}
*/
th[colspan="2"] > button{background:inherit;padding:0.8rem;margin-left:3px;font-weight:bold;border:2px solid black;
cursor:pointer;
}
th[colspan="2"]{text-align:left;}

/*table[data-rdid="37"]{margin:100px;}*/
#redIn2{display:flex;width:100%;flex-wrap:wrap;}
#redIn2 > table{margin:10px;}

#idpay1{border:1px solid green;width:15rem;}
@media screen and (max-width:700px){
table{width:100%;}
td{display:block;}
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
<section>
<form id="idpay1" method="post" action="/admin/conf_bitaps_payment" name="npay1">
${n.payment?get_payment_sys(n.payment):'<b>no payment system config file.</b>'}
<div><input type="submit" value="save" name="submit" disabled></div>
</form>
</section>
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

function bp_ptype(el){
el.textContent=el.textContent=="single"?"hot":"single";
idpay1.ptype.value=idpay1.ptype.value=="single"?"hot":"single";
idpay1.submit.disabled=false;
//el.parentElement.parentElement.submit.disabled=false;
}

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
if(!bparol.value){message_box('fill in parol field');return;}
let d={};
d.parol=bparol.value;
vax('post','/api/create_redeem_code',d,onsuc,erl);
}


function onsuc(e){
if(!e.htmlbody){message_box('no htmlbody attr found!');return;}
redIn.innerHTML=e.htmlbody;
}


function check_balance_rc(el){
if(!el.value){message_box('redeem code not provided.');return;}
let enc=el.getAttribute('data-enc')
let d={}
if(enc=='true'){
if(!bparol.value){message_box('fill in parol field!');return;}
d.parol=bparol.value;
}
d.rc=el.value;d.enc=enc;
vax('post','/admin/check_balance_rc',d,on_bal,erl);
el.parentElement.parentElement.classList.add('greeny');//tr

}

function on_bal(e){
rem('greeny');
message_box(e.b.address);
}


function rem(d){
let l=document.querySelector('.'+d);
if(l)l.classList.remove(d);
}

function make_rc_active(el){
let a=el.parentElement.parentElement.parentElement.parentElement;
if(!a){message_box('No table element found!');retrun;}
let b=a.rows[3].cells[1].firstChild;
if(!b){message_box('No form element found! It looks like you have an old browser.');return;}
let c=b.f.value;
let rdid=a.getAttribute('data-rdid');
let cadr=a.rows[4].cells[1].textContent;
//alert(c+' '+rdid+' '+cadr)
if(!rdid || !c){mesage_box('no id or no type of reedem provided!');return;}
if(c=='a'){
if(cadr=='no'){message_box('No cold address provided!');return;}
}
let d={};
d.rd_id=rdid;
d.rd_t=c;
d.cold_adr=cadr;
vax('post','/make_rc_active',d,onl,erl);
a.classList.add('greeny');
}

function onl(e){alert(miss(e))}

function erl(e){message_box(e);rem('greeny')}

function geti(){
vax('get','/mid/Bob',null,onl,erl)
}
function save_cold(el){
let tbody=el.parentElement.parentElement.parentElement.parentElement;
if(!tbody){message_box('no tbody found');return;}
let rdid=tbody.getAttribute('data-rdid');
let cadr1=tbody.rows[4].cells[1];
if(!cadr1){message_box('no cadr1 found.');return;}
let cadr=cadr1.textContent;
//alert(rdid+' '+cadr);
if(!rdid || !cadr){message_box('no id or cold address provided!');return;}
if(cadr=='no'){message_box('no cold address provided!');return;}
let d={};
d.rd_id=rdid;
d.cold_adr=cadr;
vax('post','/admin/api/saveColdAdr',d,svd_cold_adr,erl)
el.parentElement.parentElement.classList.add('greeny');
}

function svd_cold_adr(d){
rem('greeny');
if(d && d.info=='ok')message_box('A new cold address is successful updated!')
}

function showMore(){
let d={};d.show=true;
vax('post','/admin/more_reedem',d,show2,erl)
}
function show2(e){
if(!e.htmlbody){message_box('no htmlbody attr found!');return;}
redIn2.innerHTML=e.htmlbody;
}

function delete_redeem(el){
let v=el.parentElement.parentElement.parentElement.parentElement;
let id=v.getAttribute('data-rdid');
//alert(id)
let typ=v.getAttribute('data-type');
if(!id || !typ){message_box('id or type is not provided. Sorry.');return;}
if(typ=='a'){message_box("It's active. Make it passive and then you can delete it.");return;}
//alert('typ: '+typ+' id: '+id)
let su=v.parentElement;
let d={};
d.rdid=id;
d.typ=typ;
vax('post','/admin/api/delete_redeem',d,on_rd_del,erl);
v.classList.add('greeny');
/*
setTimeout(function(){
on_rd_del({del:"307"})
},4000)
*/
}
function on_rd_del(e){
if(!e.del){message_box("Attribute 'del' not found!");rem("greeny");return;}
let vel=document.querySelector('table[data-rdid="'+e.del+'"]');
if(!vel){message_box("Id "+e.del+" not found.");rem("greeny");return;}
vel.remove();
}
</script>
</main>${fg}<footer id="footer">${footer.footer({})}</footer></body></html>`;
}

module.exports={admin_bitaps};
function get_payment_sys(payment){
let s='';
let {name,enabled,test,real_adr,cold_adr,hotadr_quota,grund,cb_part,ptype}=payment;
s+=`<div><b>name:</b><br><input type="text" name="name" value="${name}" readonly></div>`;
s+=`<div><b>enabled:</b><b id="enablerMarker">${enabled=="true"?'YES!':'NO!'}</b><br><input type="text" name="enabled" value="${enabled}">`;
s+=`<button value="${enabled}" onclick="bp_enabler(this);return false;">${enabled=="true"?'disable':'enable'}</button></div>`;
s+=`<div><b>type:</b><b id="ptypeMarker">${ptype=="hot"?'HOT!':'SINGLE!'}</b><br><input type="text" name="ptype" value="${ptype}" readonly>`;
s+=`<button onclick="bp_ptype(this);return false;">${ptype=='hot'?'single':'hot'}</button></div>`;
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