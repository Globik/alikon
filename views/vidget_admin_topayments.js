//vidget_admin_topayments.js
const vidget_admin_topayments=n=>{
return `<h4>To payments</h4>
${n.data && n.data.length !==0 ? get_datei(n.data) : 'no data'}
<hr><button onclick="get_next();">next</button>
`;
}
module.exports={vidget_admin_topayments}

function get_datei(n){
let s='';
n.forEach((el, i)=>{
s+=`<section class="psector"><table><tbody>
<tr><th>tokens</th><td class="intok">${el.amt_tok}</td></tr>

<tr><th>usd</th><td><span class="usd"></span></td></tr>
<tr><th>bitcoin</th><td><span class="sumbc"></span></td></tr>
<tr><th>%</th><td class="inproz">${el.proz}</td></tr>
<tr>
<th>Created: </th><td><span class="dtime">${el.at}</span></td>
</tr>
<tr>
<th>Status: </th><td><span class="bcstatus">${el.status}</span></td>
</tr>
<tr><th>user id: </th><td><span class="us_id">${el.us_id}</span></td></tr>
<tr><th>Bitcoin address: </th><td><span class="bcaddr">${el.addr}</span></td></tr></tbody></table><br>
<button onclick="send_payment();">send pay</button><span id="connect"></span>
</section>`;
});
	return s;
}