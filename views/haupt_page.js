//haupt_page.js
var head=require('./head'),
    header_menu=require('./header_menu'),
	admin_main_menu=require('./admin_main_menu'),
    footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;

var haupt_page= n=>{
	var {buser,showmodule:{mainmenu,profiler}}=n;
return `<!DOCTYPE html><html lang="en"><!-- haupt_pages.js -->
<head>${head.head({title:"Haupt Page",csslink:"/css/main2.css"})}</head>
<body>${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${(buser ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap">
	${(buser ? buser.username : "Guest<br>")}
	${(buser ? `<a href="/logout">logout</a>` :`<a href="/login">login</a>`)}

<div>Some div with user's personals fades ${douser(buser)}</div>
<aside>${showModule(n)}</aside>
Font-family:<br>
<span>Arial: </span><span style="font-family:Arial;">Hello World!</span><br>
<span>Arial Black: </span><span style="font-family:Arial Black ;">Hello World!</span><br>
<span>Calibri: </span><span style="font-family: Calibri;">Hello World!</span><br>
<span>Cambria: </span><span style="font-family:Cambria ;">Hello World!</span><br>
<span>Candara: </span><span style="font-family:Candara ;">Hello World!</span><br>
<span>Comic Sans MS: </span><span style="font-family: Comic Sans MS ;">Hello World!</span><br>
<span>Consolas: </span><span style="font-family: Consolas;">Hello World!</span><br>
<span>Corbel: </span><span style="font-family:Corbel ;">Hello World!</span><br>
<span>Courier New: </span><span style="font-family: Courier New;">Hello World!</span><br>
<span>Gabriola: </span><span style="font-family: Gabriola ;">Hello World!</span><br>
<span>Gautami: </span><span style="font-family:Gautami ;">Hello World!</span><br>
<span>Impact: </span><span style="font-family:Impact ;">Hello World!</span><br>
<span>Latha: </span><span style="font-family:Latha ;">Hello World!</span><br>
<span>MV Boli: </span><span style="font-family:MV Boli ;">Hello World!</span><br>
<span>Nyala :</span><span style="font-family:Nyala ;">Hello World!</span><br>
<span>Palatino Linotype :</span><span style="font-family: ;">Hello World!</span><br>
<span>script :</span><span style="font-family:Script ;">Hello World!</span><br>
<span>Segoe Print :</span><span style="font-family:Segoe Print ;">Hello World!</span><br>
<span>Symbol :</span><span style="font-family:Symbol ;">Hello World!</span><br>
<span>Tahoma :</span><span style="font-family:Tahoma ;">Hello World!</span><br>
<span>Times New Roman :</span><span style="font-family:Times New Roman ;">Hello World!</span><br>
<span>Trebuchet MS :</span><span style="font-family:Trebuchet MS ;">Hello World!</span><br>
<span>Tunga :</span><span style="font-family:Tunga ;">Hello World!</span><br>
<span>Verdana :</span><span style="font-family:Verana ;">Hello World!</span><br>
<span>Webdings :</span><span style="font-family:Webdings ;">Hello World!</span><br>
<span>Westminster :</span><span style="font-family:Westminster ;">Hello World!</span><br>
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
s2=`<ul><li>${buser.username}</li><li>${buser._id}</li>
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