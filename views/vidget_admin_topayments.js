//vidget_admin_topayments.js
const vidget_admin_topayments=n=>{
return `<h4>To payments</h4>
<button onclick="set_bcs();">set BC</button>

${n.data && n.data.length !==0 ? get_datei(n.data) : 'no data'}
<hr><button onclick="get_next();">next</button>
`;
}
module.exports={vidget_admin_topayments}

function get_datei(n){
let s='';
n.forEach((el, i)=>{
s+=`<section class="psector"><table><tbody>
<tr><th>tokens</th><td><span class="intok">${el.amt_tok}</span></td></tr>

<tr><th>usd</th><td><span class="usd"></span></td></tr>
<tr><th>bitcoin</th><td><span class="sumbc"></span></td></tr>
<tr><th>%</th><td><span class="inproz">${el.proz}</span></td></tr>
<tr>
<th>Created: </th><td><span class="dtime">${el.at}</span></td>
</tr>
<tr>
<th>Status: </th><td><span class="bcstatus">${el.status}</span></td>
</tr>
<tr><th>user id: </th><td><span class="us_id">${el.us_id}</span></td></tr>
<tr><th>Bitcoin address: </th><td><span class="bcaddr">${el.addr}</span></td></tr></tbody></table>
<button class="btn" data-amttok="${el.amt_tok}" data-usd="" data-sumbc="" data-proz="${el.proz}" data-dtime="${el.at}" 
data-status="${el.status}" data-usid="${el.us_id}" data-addr="${el.addr}" onclick="send_payment(this);">send pay</button>
<span id="connect"></span><br>
</section>`;
});
	return s;
}