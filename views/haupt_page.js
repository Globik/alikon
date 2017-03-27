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
<head>${head.head({title:"Haupt Page", csslink:"/css/main2.css",js:["https://bitpay.com/bitpay.js"]})}</head>
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
<h2>bitpay part</h2>
<button onclick="payt()">pay</button>
<script>
function payt(){
//alert('fuck');
var data={};
data.price=1;
data.currency='USD';
var xhr=new XMLHttpRequest();
xhr.open('post','/create_invoice');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
//alert(this.response);
var mata=JSON.parse(this.response);
bitpay.enableTestMode();
bitpay.showInvoice(mata.id);
}else{
alert(this.response);
}}
xhr.onerror=function(e){alert(this.response + e)}
//alert(JSON.stringify(data));
xhr.send(JSON.stringify(data));

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
s2=`<ul><li>${buser.name}</li>
${(buser.email ? `<li>${buser.email}</li>` : `<li>No Mail</li>`)}</ul>`;}
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