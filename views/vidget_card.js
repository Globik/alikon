//vidget_card.js
var vidget_card=n=>{
return `
<style>
.cardadr{border:1px solid green;}
</style>
<h4>Bitcoin address</h4>
<br><a href="#" onclick="edit_addr();">edit</a>
<br>${get_card(n)}
<button onclick="save_addr();">save</button><br>
mqWzsnkXizvhoSmsKVMqKpg231XH6M2tom<br>
<output id="adrinfo"></output>
<script>
function edit_addr(){
cardaddr.setAttribute('contenteditable',true);
}
function save_addr(){
var data={};
data.addr=cardaddr.textContent;
data.useremail=useremail.textContent;
var xhr=new XMLHttpRequest();
xhr.open('post','/api/set_bitcoin_address');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
var mata=JSON.parse(this.response);
cardaddr.setAttribute('contenteditable',false);
adrinfo.innerHTML=this.response;
}else{
adrinfo.innerHTML=this.response;
}
}
xhr.onerror=function(e){adrinfo.innerHTML=this.response;}
xhr.send(JSON.stringify(data));
}
</script>
`;

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