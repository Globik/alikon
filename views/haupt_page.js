//haupt_page.js
var head=require('./head'),
    header_menu=require('./header_menu'),
	admin_main_menu=require('./admin_main_menu'),
    footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;

var haupt_page= n=>{
	var {buser,showmodule:{mainmenu,profiler}}=n;
	//console.log('BUSER: ',buser);
return `<!DOCTYPE html><html lang="en"><!-- haupt_pages.js -->
<head>${head.head({title:"Haupt Page", csslink:"/css/main2.css",js:["https://bitpay.com/bitpay.min.js"]})}</head>
<body>${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap"> 

	${(buser ? buser.name : "Guest<br>")}
	${(buser ? `<a href="/logout">logout</a>` :`<a href="/login">login</a>`)} | <a href="/signup">sign up</a>
<br>Or you can login with <a href="/auth/facebook">facebook</a><br><br>
Vkontakte: <a href="/auth/vkontakte">vk</a>

<div>Some div with user's personals fades ${douser(buser)}</div>
<!-- reklama -->
<div id="rontar">
${n.banner[0].src}
</div>
<button onclick="set_banner();">set banner</button>
<script>${clearCache()}</script>



<!-- end reklama -->
<output id="out4"></output>
<output id="out5"></output>
<aside>${showModule(n)}</aside>
<!-- <iframe src="/articles" width="1000" height="400"></iframe> -->

<!-- <h2>bitpay part</h2>
<p>Invoice status:<span id="bitpaystatus"></span><br></p>
<button onclick="payt()">pay</button>
-->
<style>
.sect{background:lightgreen;padding:10px;margin:0;}
		.sect h1{padding:20px;margin:10px;}
			#payment h4{padding:12px;margin:12px;}
			.inp{padding:10px;margin:10px;}
.warn_pay{padding:20px;}
</style>
<section class="sect">
		<h1>Get Tokens - test mode</h1>
<output id="payoutinfo"></output>
		<form id="payment"  name="payment" method="post" enctype="multipart/form-data">
			<h4>The more tokens you buy, the less they cost!</h4>
			<input id="payEmail" type="hidden" name="buyerEmail" value="${buser ? buser.email : ''}"/>
            <input type="hidden" name="buyerName" value="${buser ? buser.name : ''}"/>
            <input type="hidden" name="price" value=""/>
            <input type="hidden" name="currency" value="USD"/>
			<div class="inp"><input type="radio" name="items" value="100" data-price="1" onchange="set_price(this);"/> 100 tokens for $1</div>
			<div class="inp"><input type="radio" name="items" value="200" data-price="20" onchange="set_price(this);"/> 200 tokens for $20</div>
			<div class="inp"><input type="radio" name="items" value="500" data-price="50" onchange="set_price(this);"/> 500 tokens for $50</div>
			<h4>Payment options:</h4>
			<div class="inp"><input type="radio" name="bitc" value="bitcoin" checked/> Bitcoin</div>
		<div class="inp"><input type="submit" value="go to pay"></div>
		</form>
		</section>
<script>
var messy=null;
var forma=document.forms.namedItem("payment");
function set_price(el){
//alert(el.getAttribute('data-price'))
forma.price.value=el.getAttribute('data-price');
}
forma.addEventListener('submit',function(ev){
if(payEmail.value){
payoutinfo.innerHTML="Connecting to server...";
var data=new FormData(document.forms.namedItem("payment"));

var xhr=new XMLHttpRequest();
xhr.open("post","/create_invoice",true);
xhr.onload=function(e){
if(xhr.status==200){
payoutinfo.innerHTML="Connecting to payment server...";
//console.log(this.response);

show_invoice(e);
}
else{
payoutinfo.innerHTML=this.response;
}}
xhr.onerror=function(e){payoutinfo.innerHTML=e;}
xhr.send(data);
//ev.preventDefault();
}else{
payoutinfo.innerHTML='<p class="warn_pay">You must first to <a href="/login">log in</a> or <a href="/signup">sign up</a>.</p>';
}
ev.preventDefault();
},false);


function show_invoice(e){
var mata=JSON.parse(e.target.response);
console.log('mata: ',mata.id);
bitpay.enableTestMode();
bitpay.showInvoice(mata.id);
//messy=mata.messy;
//dummy_process();
}


window.addEventListener('message', function(event){
//bitpaystatus.innerHTML=event.data.status;
if(event.data.status==="paid"){
//alert("Paid!!!");
console.log('paid');
${process.env.DEVELOPMENT==="yes" ? 'dummy_process();' : ""}
}
},false);
function dummy_process(){
var xhr=new XMLHttpRequest();
xhr.open('post','/api/dummy_set_bitpay');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
console.log(this.response);
}else{
console.log(this.response);
}}
xhr.onerror=function(e){console.log(this.response + e)}

xhr.send(JSON.stringify(messy));
}
</script>

</main>
<footer id="footer">${footer.footer({})}</footer></body></html>`;}

module.exports={haupt_page};

function showModule(n){var s1='';
if(n.showmodule.showmodule){s1=`<div style="background:lightgreen">Advertizing Block. Activity: ${n.showmodule.showmodule}...</div>`;}
return s1;
}
function douser(buser){
var s2='';
if(buser){
s2=`<ul><li><b>name: </b>${buser.name}</li>
${(buser.email ? `<li><b>email: </b>${buser.email}</li>` : `<li>No Mail</li>`)}
<li><b>items: </b>${buser.items}</li>
<li><b>w_items: </b>${buser.w_items}</li></ul>`;}
return s2;}

	function clearCache(){
		let s=``;
	s+=` 
	/* var formface=document.forms.namedItem("smsg");
	formface.addEventListener('submit',sendDirekt,false);
	function sendDirekt(e){
	e.preventDefault();
	var data={};
	data.cachestatus=formface.msg.value;
	var xhr=new XMLHttpRequest();
	xhr.open('post','/module_cache');
	 xhr.setRequestHeader('Content-Type','application/json','utf-8');
	xhr.onload=function(e){
	if(xhr.status==200){alert(this.response);console.log(this.response);}
	else{console.log(this.response)}}
   
	var daq=JSON.stringify(data);
	alert('daq: '+daq);
	xhr.send(daq);}
*/
function set_banner(){
var data={};
data.start='16 seconds';
var xhr=new XMLHttpRequest();
xhr.open('post','/api/set_banner');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
alert(this.response);
}else{
alert(this.response);
}}
xhr.onerror=function(e){alert(this.response + e)}
//alert(JSON.stringify(data));
xhr.send(JSON.stringify(data));
}
	`;
	
	
	return s;}