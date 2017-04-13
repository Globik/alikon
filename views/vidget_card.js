//vidget_card.js
var vidget_card=n=>{
return `
<h4>Bitcoin address</h4>
${get_card(n)}
<button onclick="save_addr();">save</button><br>
<!-- mqWzsnkXizvhoSmsKVMqKpg231XH6M2tom -->
<output id="adrinfo"></output>`;
}
module.exports={vidget_card};
function get_card(n){
let s='';
	if(n.cards){
	s+=`<div class="cardadr"><input type="text" id="cardaddr" value="${n.cards.addr}" required/></div>`;
	}else{
	s+=`<div class="cardadr"><input type="text" id="cardaddr" value="Add one" required/></div>`;
	}
	return s;
}