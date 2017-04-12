//vidget_card.js
var vidget_card=n=>{
return `
<h4>Bitcoin address</h4>
<br><a href="#" onclick="edit_addr();">edit</a>
<br>${get_card(n)}
<button onclick="save_addr();">save</button><br>
<!-- mqWzsnkXizvhoSmsKVMqKpg231XH6M2tom -->
<output id="adrinfo"></output>`;
}
module.exports={vidget_card};
function get_card(n){
let s='';
	if(n.cards){
	s+=`<div class="cardadr"><span id="cardaddr" contenteditable=false>${n.cards.addr}</span></div>`;
	}else{
	s+=`<div class="cardadr"><span id="cardaddr" contenteditable=false>Add one</span></div>`;
	}
	return s;
}