//admin_bitaps.js
const head=require('./head.js');
const header_menu=require('./header_menu');
const admin_main_menu=require('./admin_main_menu');
const footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;


let admin_bitaps=n=>{
var {showmodule:{mainmenu,profiler}}=n;const buser=n.user;
return `<!DOCTYPE html><html lang="en"><head>${head.head({title:"bitaps", csslink:"/css/main2.css"})}</head><body>
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap">
hallo ${buser.name}<br>
<button onclick="duck();">duck</button><br>
<output id="mout"></output>
<output id="mout2"></output>
<h4>prior</h4>
<input type="text" id="prior" data-name="bitaps" value=""/><br>
<button onclick="do_fucking();">do fucking</button><br>
<script>
var gobject;
function duck(){
let d={};
let xhr=new XMLHttpRequest();
xhr.open('post','/api/payment_system');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
//mout.textContent=this.response;

try{let v=JSON.parse(this.response);
let g=JSON.stringify(v.m.pays);
mout.textContent=g;
gobject=v.m.pays;
//vi(v.m.pays);
//console.log(v.m.pays)
do_proc(v);}catch(e){mout.textContent=e;return;}
}else{
mout.textContent=this.response;
}}
xhr.onerror=function(e){console.log(this.response + e)}
d.fn="payment_system";
xhr.send(JSON.stringify(d));
}
function do_proc(d){
//d..pays
//alert(d.m.pays[0].name)
prior.value=d.m.pays[0].prior;
}
function vi(t){
mout.textContent='[';
if(Array.isArray(t)){
t.forEach(function(el,i){
mout.textContent+=su(el)
})
mout.textContent+=']';
}else{alert('not array')}
}
function su(n){
let s='{';
for(var k in n){
s+=k+': '+n[k]+', ';
}
s+='},';
return s
}
function do_fucking(){
//alert(prior.value);
gobject.forEach(function(el,i){
if(el.name=="bitaps"){
console.log(i)
gobject[i].prior=prior.value;
}
})
dobisch();
}
function dobisch(){
let a=JSON.stringify(gobject);
mout2.textContent=a;
}
</script>


</main><footer id="footer">${footer.footer({})}</footer></body></html>`;
}

module.exports={admin_bitaps};