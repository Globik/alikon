const moment=require('moment');
const admin_v_bitaps_reedem=n=>{
return `${n.dbdec?getred(n.dbdec,n.unencrypted):'<h4>No reedem data.</h4>'}`;
}
module.exports={admin_v_bitaps_reedem}
function getred(n,enc){
let s='';
if(Array.isArray(n)){
n.forEach((el,i)=>{
s+=`<section class="rdinfo" data-rdid="${el.rd_id}" data-type="${el.rd_t}">`;
s+=`<caption class="drow">Redeem info. Crypted: ${enc}</caption>`;

s+='<div class="drow"><button onclick="make_rc_active(this);">make active</button>';
s+='<button data-p="cold" onclick="save_cold(this);">save cold address</button>';
s+=`<button value="${el.rd_c}" data-enc="${enc}"  onclick="check_balance_rc(this);">balance</button>`;
s+='<button onclick="delete_redeem(this);">delete</button></div>'

s+=`<div class="drow"><div class="dcell">active address</div><div class="dcell">${el.rd_adr}</div></div>`;
s+=`<div class="drow"><div class="dcell">redeem code:</div><div class="dcell">${enc?el.rd_c.substring(0,10):el.rd_c}</div></div>`;
s+=`<div class="drow"><div class="dcell">type</div><div class="dcell">${moon(el.rd_t)}</div></div>`;
s+=`<div class="drow"><div class="dcell">cold address</div><div class="dcell" data-p="cold" contenteditable=true><span>${el.rd_cold_adr}</span></div></div>`;
s+=`<div class="drow"><div class="dcell">all amount</div><div class="dcell">${el.rd_b} (BTC)</div></div>`;
s+=`<div class="drow"><div class="dcell">created at</div><div class="dcell">${moment(el.rd_at).format('MMM Do YYYY, h:mm:ss')}</div></div>`;
s+=`<div class="drow"><div class="dcell">updated at</div><div class="dcell">${moment(el.rd_lm).format('MMM Do YYYY, h:mm:ss')}</div></div>`;
s+='</section>';
})
}
return s;
}
function moon(el){
let s='<form name="formrd">';
	s+=`<label>active<input class="suka" type="radio" name="f" value="a"${el=='a'?' checked':''}></label>`;
	s+=`<label>passive</label><input class="suka" type="radio" name="f" value="p"${el=='p'?' checked':''}></form>`;
	return s;
}