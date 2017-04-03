//busers.js
var head=require('./head'),
    header_menu=require('./header_menu'),
	admin_main_menu=require('./admin_main_menu'),
    footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;

var busers = n=>{
var {buser,model,showmodule:{mainmenu,profiler}}=n;
	//console.log('BUSER: ',buser);
return `<!DOCTYPE html><html lang="en"><!-- haupt_pages.js -->
<head>${head.head({title:"User", csslink:"/css/main2.css"})}</head>
<body>${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap"> 
<style>
.modrtc{width:30%;display:inline-block;background:green;}
</style>
<div class="modrtc">
<h4>Model</h4>
<b>As </b> <span id="modelName">${model.name}</span><br>
<b>Email:</b> <span id="modelEmail">${model.email}</span><br>
<b>Tokens: </b> <span id="modelTokens">${model.items}</span><br>
</div>
<div class="modrtc">
<h4>You</h4>
<b>As</b> <span id="youName">${buser ? buser.name:'a Guest'}</span><br>
<b>Email: </b><span id="yourEmail">${buser ? buser.email:"no"}</span><br>
<b>Tokens: </b><span id="yourTokens">${buser?buser.items:''}</span><br>
</div><br>
<div>
<button onclick="get_one();">one token</button> give 1 token<br>
<button onclick="get_room();">privat</button> 40 tokens/min<br>

</div>
<hr><output id="out"></output>
<script>
function get_one(){
if(youName.textContent!=modelName.textContent){
if(yourTokens.textContent>=1){
var data={};
data.from=yourEmail.textContent;
data.to=modelEmail.textContent;
data.amount=1;
data.type=1;
var xhr=new XMLHttpRequest();
xhr.open('post','/api/set_transfer');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
var mata=JSON.parse(this.response);
modelTokens.textContent=Number(modelTokens.textContent)+mata.info.amount;
//modelTokens.textContent+=mata.info.amount;
yourTokens.textContent-=mata.info.amount;
out.innerHTML=this.response;
}else{
out.innerHTML=this.response;
}}
xhr.onerror=function(e){out.innerHTML=this.response + ' '+ e}
out.innerHTML=JSON.stringify(data);
xhr.send(JSON.stringify(data));
}else{out.innerHTML='not enough tokens!';}
}
}
</script>
</main><footer id="footer">${footer.footer({})}</footer>
</body>
</html>`;
}
module.exports={busers};