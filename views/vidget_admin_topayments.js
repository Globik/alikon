//vidget_admin_topayments.js
const vidget_admin_topayments=n=>{
return `<h4>To payments</h4>
${n.data ? get_datei(n.data) : 'no data'}
<hr><button onclick="get_next();">next</button>
`;
}
module.exports={vidget_admin_topayments}

function get_datei(n){
let s='';
n.forEach((el, i)=>{
s+=`<section><table> <tbody>
<tr><th>tokens</th><th>usd</th><th>bitcoin<th>%</tr>
<tr><td class="intok">${el.amt_tok}</td><td><span class="usd"></span></td><td><span class="sumbc"></span><td class="inproz">${el.proz}</tr>
</tbody></table>
<span id="dtime">${el.at}</span><br>
<span>${el.status}</span><br>
<span>${el.us_id}</span><br>
<span>${el.addr}</span><br>
</section>`;
});
	return s;
}