const file='admin_bitaps.js',fg=`<!-- ${file} -->`,head=require('./head.js'),header_menu=require('./header_menu'),
 admin_main_menu=require('./admin_main_menu'),footer=require('./footer'),admin_v_bitaps_reedem=require('./admin_v_bitaps_reedem.js'),
{js_help}=require('../libs/helper.js');var warnig=false,haupt_ban=false;
let admin_bitaps=n=>{
var {showmodule:{mainmenu,profiler}}=n;const buser=n.user;
return `<!DOCTYPE html><html lang="en"><head>${head.head({title:"bitaps", csslink:"/css/main2.css",
cssl:["/css/adm_bitaps.css"],luser:buser})}
</head><body>
${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${haupt_ban?'<div id="haupt-banner"><div id="real-ban">Banner</div></div>':''}
${buser && buser.role=='superadmin'?admin_main_menu.admin_main_menu(n):''}
${fg}
<main id="pagewrap">
Hallo <b>${buser.name}</b><br>
<h1>Bitaps payment configuration.</h1>
<section>
<b>Personal wallet btc address:</b>&nbsp;${n.cwa?n.cwa:''}
</section>
<section class="sparol">
<b>parol:</b><br>
<input id="bparol" type="password" value="mumia" required>&nbsp;<button onclick="show_parol(this);">show</button></section>

<form id="idpay1" method="post" action="/admin/conf_bitaps_payment" name="npay1">
${n.payment?get_payment_sys(n.payment):'<b>No payment system config file.</b>'}
</form>
<section><button id="newfucker">Reload system</button></section>
<div>
${n.error?`<h4>Error:</h4>${n.error}`:''}
</div>
${n.curd?`<h4>Current id of redeem data: ${n.curd.rd_id}</h4>`:'<h4>no redeem data.</h4>'}
<br>${admin_v_bitaps_reedem.admin_v_bitaps_reedem(n)}<br>
<hr><button onclick="get_new_reedem_code();">get new redeem_code</button><br>
<section id="redIn"></section>
<hr>
<br><b>There are <span id="rddmount">${n.dmount?n.dmount:'0'}</span> redeem data.</b>&nbsp;<button onclick="showMore();">show me that!</button><br>
<section id="redIn2"></section>
${js_help(["/js/admin_bitaps.js"])}
</main>${fg}<footer id="footer">${footer.footer({})}</footer></body></html>`;
}
module.exports={admin_bitaps};
function get_payment_sys(payment){
let s='';
let {name,enabled,test,real_adr,cold_adr,hotadr_quota,grund,cb_part,ptype}=payment;
s+=`<div><b>type:</b>&nbsp;<b id="ptypeMarker">${ptype=="hot"?'HOT!':'SINGLE!'}</b><br><input type="text" name="ptype" value="${ptype}" readonly>&nbsp;`;
s+=`<button onclick="bp_ptype(this);return false;">${ptype=='hot'?'single':'hot'}</button></div>`;
s+=`<div><b>name:</b><br><input type="text" name="name" value="${name}" readonly></div>`;
s+=`<div><b>test mode:</b><br><input type="text" name="test" value="${test}" readonly></div>`;
s+=`<div><b>enabled:</b>&nbsp;<b id="enablerMarker">${enabled=="true"?'YES!':'NO!'}</b><br><input type="text" name="enabled" value="${enabled}">`;
s+=`&nbsp;<button value="${enabled}" onclick="bp_enabler(this);return false;">${enabled=="true"?'disable':'enable'}</button></div>`;
s+=`<div><b>hot address quote:</b><br><input type="text" name="hotadr_quota" value="${hotadr_quota}" readonly></div>`;
s+=`<div><b>base url api: </b><br><input type="text" name="grund" value="${grund}" readonly></div>`;
s+=`<div><b>callback:</b><br><input type="text" name="cb_part" value="${cb_part}" readonly>`;
s+='&nbsp;<input type="submit" value="save" name="submit" disabled></div></div>';
return s;
}