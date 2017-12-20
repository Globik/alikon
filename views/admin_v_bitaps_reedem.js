const moment=require('moment');
const admin_v_bitaps_reedem=n=>{
return `${n.dbdec?getred(n.dbdec,n.unencrypted):'<h4>No reedem data.</h4>'}`;
}
module.exports={admin_v_bitaps_reedem}
function getred(n,enc){
let s='';
if(Array.isArray(n)){
n.forEach((el,i)=>{
s+=`<table data-rdid="${el.rd_id}" data-type="${el.rd_t}">`;
s+=`<caption>Redeem info. Crypted: ${enc}</caption>`;
//s+='<thead><tr><th>attribute</th><th>value</th></tr></thead>';
s+='<tfoot><tr><th colspan="2"><button onclick="make_rc_active(this);">make active</button>';
s+='<button data-p="cold" onclick="save_cold(this);">save cold address</button>';
s+=`<button value="${el.rd_c}" data-enc="${enc}"  onclick="check_balance_rc(this);">balance</button>`;
s+='<button onclick="delete_redeem(this);">delete</button></th></tr></tfoot>'
s+='<tbody id="mid">';
s+=`<tr><th>active address</th><td>${el.rd_adr}</td></tr>`;
s+=`<tr><th>redeem code:</th><td>${enc?el.rd_c.substring(0,10):el.rd_c}</td></tr>`;
s+=`<tr><th>type</th><td>${moon(el.rd_t)}</td></tr>`;
s+=`<tr><th>cold address</th><td data-p="cold" contenteditable=true>${el.rd_cold_adr}</td>`;
s+=`<tr><th>all amount</th><td>${el.rd_b} (BTC)</td></tr>`;
s+=`<tr><th>created at</th><td>${moment(el.rd_at).format('MMM Do YYYY, h:mm:ss')}</td></tr>`;
s+=`<tr><th>updated at</th><td>${moment(el.rd_lm).format('MMM Do YYYY, h:mm:ss')}</td></tr>`;
s+='</tbody></table>';
})
}
return s;
}
function moon(el){
let s='<form name="formrd">';
	s+=`<label>active</label><input type="radio" name="f" value="a"${el=='a'?' checked':''}>`;
	s+=`<label>passive</label><input type="radio" name="f" value="p"${el=='p'?' checked':''}></form>`;
	return s;
}