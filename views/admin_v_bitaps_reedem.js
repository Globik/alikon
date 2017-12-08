const admin_v_bitaps_reedem=n=>{
return `${n.dbdec?getred(n.dbdec):'<h4>No reedem data.</h4>'}`;
}
module.exports={admin_v_bitaps_reedem}
function getred(n){
let s='';
if(Array.isArray(n)){
n.forEach((el,i)=>{
s+=`<table class="red-info" data-id="${el.rd_id}" data-type="${el.rd_t}">`;
s+='<thead><tr><th>attribute</th><th>value</th><th>control</th></tr></thead>';
s+=`<tr><th>id</th><td>${el.rd_id}</td></tr>`;
s+=`<tr><th>active address</th><td>${el.rd_adr}</td></tr>`;
s+=`<tr><th>reedem code:</th><td>${el.rd_c}</td><td><button onclick="check_balance_rc(this)">balance</button></td></tr>`;
s+=`<tr><th>type</th><td>${el.rd_t}</td><td><button onclick="make_rc_active(this);">make active</button></td></tr>`;
s+=`<tr><th>invoice</th><td>${el.rd_inv}</td></tr>`;
s+=`<tr><th>cold address</th><td contenteditable=true oninput="legin(this);">${el.rd_cold_adr}</td>`;
s+='<td><button onclick="svd_cold_adr(this);">save</button></td></tr>';
s+=`<tr><th>all amount</th><td>${el.rd_b} (BTC)</td></tr>`;
s+=`<tr><th>created at</th><td>${el.rd_at}</td></tr>`;
s+=`<tr><th>updated at</th><td>${el.rd_at}</td></tr>`;
s+='</table>';
})
}
return s;
}