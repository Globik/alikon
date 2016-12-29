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
<head>${head.head({title:"Haupt Page",csslink:"/css/main2.css"})}</head>
<body>${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap">
	${(buser ? buser.name : "Guest<br>")}
	${(buser ? `<a href="/logout">logout</a>` :`<a href="/login">login</a>`)}

<div>Some div with user's personals fades ${douser(buser)}</div>
<aside>${showModule(n)}</aside>

<span>Wingdings :</span><span style="font-family:Wingdings ;">Hello World!</span><br><hr>
<div><output id="out4"></output></div>
<output id="out5"></output>
<!-- <iframe src="/articles" width="1000" height="400"></iframe> -->
<button onclick="gethtml()">gethtml</button><br>
<output id="htmloutput"></output>
<script>
function gethtml(){
	
	var data={};
var xhr=new XMLHttpRequest();
	xhr.open('post','/get_html');
	// xhr.setRequestHeader('Content-Type','application/json','utf-8');
	xhr.onload=function(e){
	if(xhr.status==200){
		//alert(this.response);
	console.log(this.response);
	var mg=JSON.parse(this.response);
	htmloutput.innerHTML=mg.fi;
	}
	else{
		//alert(this.response);
		console.log(this.response);
		}}
		xhr.onerror=function(e){alert('error'+e);}
   data.ququ="ququ";
	xhr.send(JSON.stringify(data));
}
</script>
${doscript()}

<form id="sendform" name="smsg" action="">
            <input type="text" id="message" name="msg" value="Apple">
			<input id="send" type="submit">
        </form>
<script>${clearCache()}</script>
</main><footer id="footer">${footer.footer({})}</footer></body></html>`;}

module.exports={haupt_page};

function showModule(n){var s1='';
if(n.showmodule.showmodule){s1=`<div style="background:lightgreen">Advertizing Block. Activity: ${n.showmodule.showmodule}...</div>`;}
return s1;
}
function douser(buser){
var s2='';
if(buser){
s2=`<ul><li>${buser.name}</li><li>${buser.id}</li>
${(buser.email ? `<li>${buser.email}</li>` : `<li>No Mail</li>`)}</ul>`;}
return s2;}
function doscript(){
return `<script src='/js/prob.js'></script>`;
	}
	
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
	
	
	return s;}