//vidget_tokens.js
const dolpertok=0.05;
const vidget_tokens=n=>{
return `
<b>Token balance:</b> <span id="tokens">${n.buser ? n.buser.items: '0'}</span> 
<h5>Transfer tokens</h5>
Transfer ${n.buser.items} tokens to bitcoins($${dolpertok} per token)<br>
<span id="usd">${n.buser.items*dolpertok}</span>$<br>
<span id="bcusd"></span><br>
<button onclick="convert();">convert to BC</button><br>
<span id="factinfo"></span><br>
`;
}
module.exports={vidget_tokens};