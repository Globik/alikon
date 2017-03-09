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
<head>${head.head({title:"Haupt Page", csslink:"/css/main2.css"})}</head>
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
<div id="rontar_adplace_13418"></div>
<script type="text/javascript">
 
    (function (w, d, n) {
        var ri = { rontar_site_id: 4689, rontar_adplace_id: 13418, rontar_place_id: 'rontar_adplace_13418', adCode_rootUrl: 'http://adcode.rontar.com/' };
        w[n] = w[n] || [];
        w[n].push(
            ri
        );
        var a = document.createElement('script');
        a.type = 'text/javascript';
        a.async = true;
        a.src = 'http://adcode.rontar.com/rontar2_async.js?rnd=' + Math.round(Math.random() * 100000);
        var b = document.getElementById('rontar_adplace_' + ri.rontar_adplace_id);
        b.parentNode.insertBefore(a, b);
    })(window, document, 'rontar_ads');
</script>



<!-- end reklama -->
<output id="out4"></output>
<output id="out5"></output>
<aside>${showModule(n)}</aside>
<!-- <iframe src="/articles" width="1000" height="400"></iframe> -->




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
	var formface=document.forms.namedItem("smsg");
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
	`;
	
	
	return '';}