var head=require('./head'),
    header_menu=require('./header_menu'),
	admin_main_menu=require('./admin_main_menu'),
    footer=require('./footer');
const moment=require('moment');
var warnig=false;	  
var haupt_ban=false;

var cabinet_admin = n=>{
var {buser,model,showmodule:{mainmenu,profiler}}=n;
	//console.log('BUSER: ',buser);
return `<!DOCTYPE html><html lang="en"><!-- busers.js -->
<head>${head.head({title:"Payments", csslink:"/css/main2.css"})}</head>
<body>${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap"> 
<style>
.psector{border:1px solid green;}
tbody th, tbody td{border:1px solid lightgreen;}
#connect{background:green;}
</style>
<h2>administrative</h2>
<button onclick="set_bcs();">set BC</button>
<br>
<b>1 BC: </b><span id="bc">1182.05</span> USD
<a onclick="get_to_payments();">To payments</a>

<div id="ajxcontent"></div>
<br><span id="out"></span>
</main><footer id="footer">${footer.footer({})}</footer>
<script>
/*
if(typeof(Storage) !=="undefined"){
localStorage.setItem("bitcoin",bc.textContent);
//.getItem("bitcoin").removeItem("bitcoin")
}else{}
*/

function get_to_payments(){
var xhr=new XMLHttpRequest();
xhr.open('get','/dashboard/get_to_payments_list');
xhr.onload=function(e){
if(xhr.status==200){
var mata=JSON.parse(this.response);
ajxcontent.innerHTML=mata.content;
}else{out.innerHTML=this.response;}}
xhr.onerror=function(e){out.innerHTML=this.response;}
xhr.send();
}

function bcout(n,k){
if(bc.textContent){
var mn=((n*0.1*k)/Number(bc.textContent)).toFixed(6);
return mn;
}
return null;
}

function todollar(n,k){
var d=(n*0.1*k).toFixed(2);
return d;
}

function set_bcs(){

var intoki=document.querySelectorAll('.intok');
var inprozi=document.querySelectorAll('.inproz');
var sumbci=document.querySelectorAll('.sumbc');
var usdi=document.querySelectorAll('.usd');
var btns=document.querySelectorAll('.btn');
intoki.forEach(function(el,i){
usdi[i].textContent=todollar(Number(intoki[i].textContent),Number(inprozi[i].textContent));
sumbci[i].textContent=bcout(Number(intoki[i].textContent),Number(inprozi[i].textContent));
btns[i].setAttribute('data-usd', todollar(Number(intoki[i].textContent),Number(inprozi[i].textContent)));
btns[i].setAttribute('data-sumbc', bcout(Number(intoki[i].textContent),Number(inprozi[i].textContent)));
})
}

function get_next(){
connect.innerHTML="Connecting to db...";
var resu;
var dtimi=document.querySelectorAll(".dtime");
//var res=dtimi[dtimi.length-1].getAttribute("datetime");
var res=dtimi[dtimi.length-1];
if(res){resu=res.textContent;}else{resu=null;}
var data={};
//if(res){
data.next=resu;
//}
var xhr=new XMLHttpRequest();
xhr.open('post','/dashboard/cabinet_admin/page');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
connect.innerHTML="";
if(xhr.status==200){
//out.innerHTML=this.response;
var mata=JSON.parse(this.response);
ajxcontent.innerHTML=mata.content;
}else{out.innerHTML=this.response;}}
xhr.onerror=function(e){out.innerHTML=this.response;connect.innerHTML="";}
//alert(JSON.stringify(data));
if(resu==null){
get_to_payments()
}else{
xhr.send(JSON.stringify(data));
}
}

function send_payment(el){
//data-amttok="{el.amt_tok}" data-usd="" data-sumbc="" data-proz="{el.proz} data-dtime="{el.at}" 
//data-status="{el.status}" data-usid="{el.us_id}" data-addr="{el.addr}" 
el.setAttribute('data-status','complete');
//var amttok=el.getAttribute('data-amttok'),
    var usd=el.getAttribute('data-usd'),
    sumbc=el.getAttribute('data-sumbc');
   // proz=el.getAttribute('data-proz'),
    //dtime=el.getAttribute('data-dtime'),
    //status=el.getAttribute('data-status'),
    //us_id=el.getAttribute('data-usid'),
    //addr=el.getAttribute('data-addr');
if(usd && sumbc){
//alert('ok');
var data={};
for(var i in el.dataset){
data[i]=el.dataset[i];
}
var xhr=new XMLHttpRequest();
xhr.open('post','/dashboard/cabinet_admin/set_payment');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
out.innerHTML=this.response;
}else{alert(this.response)}
}
xhr.onerror=function(e){alert(this.response)}
alert(JSON.stringify(data));
xhr.send(JSON.stringify(data));
}else{alert('fill in bitcoin  course!');}
}
</script>
</body>
</html>`;
}
module.exports={cabinet_admin};
function get_datei(m){
let s='';
	//if(Array.isArray(m)){
m.forEach((el, i)=>{
s+=`<section>${el.us_id} | <span class="intok">${el.amt_tok}</span> | <span class="inproz">${el.proz}</span> |
${moment(el.at).format('YYYY-MM-DD HH:mm')} |
${el.status} | ${el.addr} |<b>time</b><time class="dtime" datetime="${el.at}">${el.at}</time>
<br><b>USD: </b><span class="usd"></span>
<br><b>BC: </b><span class="sumbc"></span>
</section><br>`;
});
//}else{s+=`${m.data.us_id} | ${m.amt_tok}`;}
	
	return s;
}