//cabinet.js
var head=require('./head'),
    header_menu=require('./header_menu'),
	admin_main_menu=require('./admin_main_menu'),
    footer=require('./footer'),
	vidget_card=require('./vidget_card.js');
var warnig=false;	  
var haupt_ban=false;

var cabinet = n=>{
var {buser,model,showmodule:{mainmenu,profiler}}=n;
	//console.log('BUSER: ',buser);
return `<!DOCTYPE html><html lang="en"><!-- busers.js -->
<head>${head.head({title:"Cabinet", csslink:"/css/main2.css"})}</head>
<body>${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap"> 
<style>
.divnav{backgound:blue;}
.litab{list-style:none;margin:0;font-size: 1.6vw;font-weight:bold;letter-spacing:1px;}
.litab .f{display:inline-block;padding:0.2rem;margin:0.2rem;background:blue;border:2px solid white;}
.f.pli{background:red;color:red;}
.litab .f:first-child{margin-left:0;padding-left:0;}
.litab .f a{color:white;cursor:pointer;text-decoration:none;}
#cardaddr{width:50%;}
#loader{
			position: absolute;
			display: none;
			left: 50%;
			top: 50%;
			z-index: 1;
			width: 150px;
			height:150px;
			margin:-75px 0 0 -75px;
			border:16px solid #f3f3f3;
			border-radius:50%;
			border-top:16px solid #3498db;
			animation: spin 2s linear infinite;
		}
		@keyframes spin{
			0% {transform: rotate(0deg);}
			100%{transform: rotate(360deg);}
		}
		.animate-bottom{
			position: relative;
			animation-name: animatebottom;
			animation-duration: 1s;
		}
		@keyframes animatebottom{
			from{bottom:-10rem;opacity:0;}
			to{bottom:0;opacity:1}
		}
</style>
<span id="useremail">${buser ? buser.email:''}</span><br>currency <span id="cur"></span>
<div class="divnav">
<ul class="litab">
<li class="f"><a onclick="">profile</a>
<li class="f"><a onclick="get_tokens(this);">balance</a>
<li class="f"><a>payments</a>
<li class="f pli"><a onclick="get_bcaddress(this);">bitcoin address</a>
</ul>
</div>
<div id="loader"></div>
<div id="ajxcontent">
${vidget_card.vidget_card(n)}
</div>
<span id="out"></span>
<script>
function get_tokens(el){
addcl(el);
var data={};
data.useremail=useremail.textContent;
xhr('/api/get_tokens', data);
}

function get_bcaddress(el){
addcl(el);
var data={};
data.useremail=useremail.textContent;
xhr('/api/get_bcaddress', data);
}

function xhr(url, data){
loader.style.display="block";
var xhr=new XMLHttpRequest();
xhr.open('post',url);
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
loader.style.display="none";
if(xhr.status==200){
var mata=JSON.parse(this.response);
ajxcontent.innerHTML=mata.content;
}else{
out.innerHTML=this.response;
}
}
xhr.onerror=function(e){loader.style.display="none";out.innerHTML=this.response;}
xhr.send(JSON.stringify(data));
}
/* VIDGET_TOKEN.JS */

function convert(){
if(check_balance()){
var data={};
data.useremail=useremail.textContent;
data.amt_tok=tokens.textContent;
var xhr=new XMLHttpRequest();
xhr.open('post','/api/set_convert');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
var mata=JSON.parse(this.response);
out.innerHTML=this.response;
}else{
out.innerHTML=this.response;
}
}
xhr.onerror=function(e){out.innerHTML=this.response;}
xhr.send(JSON.stringify(data));
//alert(JSON.stringify(data));
}else{alert("Not enough tokens.\\n Minimum 1000 tokens required.");}
}

function check_balance(){
if(Number(tokens.textContent) >=1000){return true;}
return false;
}

/* VIDGET_CARD.JS */

function save_addr(){
var data={};
data.addr=cardaddr.value;
data.useremail=useremail.textContent;
var xhr=new XMLHttpRequest();
xhr.open('post','/api/set_bitcoin_address');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
var mata=JSON.parse(this.response);
adrinfo.innerHTML=this.response;
}else{
adrinfo.innerHTML=this.response;
}
}
xhr.onerror=function(e){adrinfo.innerHTML=this.response;}
xhr.send(JSON.stringify(data));
}

function furency(){
var xhr=new XMLHttpRequest();
xhr.open('GET',/*'https://bitaps.com/api/ticker/average'*/'https://bitpay.com/rates/usd');
xhr.onload=function(e){
if(xhr.status==200){alert(this.response)}else{alert(this.response)}
}
xhr.onerror=function(e){alert(this.response);}
xhr.send();
}
//furency();

function addcl(n){
var es=document.querySelector(".f.pli");
es.classList.remove("pli");
n.parentNode.classList.add("pli");
}
</script>
</main><footer id="footer">${footer.footer({})}</footer>
</body>
</html>`;
}
module.exports={cabinet};
