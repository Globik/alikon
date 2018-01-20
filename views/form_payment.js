//form_payment.js
const devi=require('../libs/devi.js');
const form_payment =n=>{
return `<form id="payment2"  name="payment2" method="post" action="/tipping/get_invoice" enctype="multipart/form-data">
<input type="hidden" id="busid" name="buyerId" value="${n.buser?n.buser.id:''}"/>
<input type="hidden" id="isDevel" name="is_develop" value="${devi()}"/>
${n.packs?get_packs(n.packs):'<b>no packs</b>'}
<div class="inp"><input id="bitsend" name="submit" type="submit" value="go to pay"></div>
</form></section>`;
}
module.exports={form_payment};
function get_packs(packs){
let s='',b=" checked",c='';
if (packs.packs){
if(Array.isArray(packs.packs)){
packs.packs.forEach(function(el,i){
if(i==0){c=b}else{c=''}
s+=`<div class="inp"><input type="radio" name="items2" value="${el.price}" data-t_pack="${el.p}" 
onchange="set_price2(this);"${c}/> ${el.p} tokens for ${el.price} BTC</div>`;
})}}return s;}