const admin_v_bitaps_reedem=n=>{
return `${n.dbdec?getred(n.dbdec,n.unencrypted):'<h4>No reedem data.</h4>'}`;
}
module.exports={admin_v_bitaps_reedem}
function getred(n,enc){
let s='';
if(Array.isArray(n)){
n.forEach((el,i)=>{
s+=`<table class="rd-info"><caption>Reedem info. Crypted: ${enc}</caption>`;
s+='<thead><tr><th>attribute</th><th>value</th><th>control</th></tr></thead>';
s+=`<tbody data-rdid="${el.rd_id}" data-type="${el.rd_t}">`;
s+=`<tr><th>id</th><td>${el.rd_id}</td><td><button onclick="delete_redeem(this);">delete</button></td></tr>`;
s+=`<tr><th>active address</th><td>${el.rd_adr}</td></tr>`;
s+=`<tr><th>reedem code:</th><td>${enc?el.rd_c.substring(0,10):el.rd_c}</td><td>`;
s+=`<button value="${el.rd_c}" data-enc="${enc}" onclick="check_balance_rc(this)">balance</button></td></tr>`;
s+=`<tr><th>type</th><td>${moon(el.rd_t)}</td><td><button onclick="make_rc_active(this);">make active</button></td></tr>`;
s+=`<tr><th>invoice</th><td>${el.rd_inv}</td></tr>`;
s+=`<tr><th>cold address</th><td contenteditable=true oninput="legin(this);">${el.rd_cold_adr}</td>`;
s+='<td><button onclick="save_cold(this);">save</button></td></tr>';
s+=`<tr><th>all amount</th><td>${el.rd_b} (BTC)</td></tr>`;
s+=`<tr><th>created at</th><td>${el.rd_at}</td></tr>`;
s+=`<tr><th>updated at</th><td>${el.rd_at}</td></tr>`;
s+='</tbody><tfoot><tr><td>end</td></tr></tfoot></table>';
})
}
return s;
}
function moon(el){
let s='<form name="formrdtype">';
	s+=`<label>active</label><input type="radio" name="f" value="a"${el=='a'?' checked':''}>`;
	s+=`<label>passive</label><input type="radio" name="f" value="p"${el=='p'?' checked':''}></form>`;
	return s;
}