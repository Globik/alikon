//haupt_page.js
const head=require('./head'),
    header_menu=require('./header_menu'),
	admin_main_menu=require('./admin_main_menu'),
    footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;

const haupt_page= n=>{
const {lusers,showmodule:{mainmenu,profiler}}=n;
	//console.log('BUSER: ',buser);
const buser=n.user;
	//console.log('N>USER: ',n.user)
const roomers=n.roomers;
return `<!DOCTYPE html><html lang="en"><!-- haupt_pages.js -->
<head>${head.head({title:"home", meta:`${get_meta()}`,csslink:"/css/main2.css",luser:buser})}</head>
<body>${(warnig ? `<div id="warnig">Warnig</div>`:'')}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : '')}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu(n)}`:'')}
<main id="pagewrap"> 
${n.m ? n.m.msg : ''}<br><br>

<h1>Сайт в разработке!</h1>
	${(buser ? buser.name : "Guest<br>")}
	${(buser ? `<a href="/logout">logout</a>` :`<a href="/login">login</a>`)}
<br>Or you can log in with <a href="/auth/facebook">facebook</a> or <a href="/auth/vkontakte">vk</a>

<!-- <div>Some div with user's personals fades ${douser(buser)}</div> -->
<!-- reklama -->
<!-- <div id="rontar">
${n.banner[0].src}
</div> -->
<!-- <button onclick="set_banner();">set banner</button> -->
<script>${clearCache()}</script>

<img src="/kl/pic.png"/>
eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee

<!-- end reklama -->
<!-- <output id="out4"></output>
<output id="out5"></output> -->
<!-- <aside>${showModule(n)}</aside> -->





<hr>
<h4>Users: </h4>
${users_list(lusers)}
<hr>
<h4>Roomers:</h4>
<div id="roomContainer">
${roomers && roomers.length >0 ? roomers_list(roomers) : '<-- <b id="noroomer">No rooms at the moment</b> -->'}
</div>
<hr>
<h1>Buy Tokens for Bitcoins!</h1>
<h6>In a test mode</h6>
<a href='/tipping/purchase_tokens'>Purchase tokens</a>
<output id="wso"></output>
<br><br>
<a href="/demo/videostream">test videostream</a><br><br>
<a href="/demo/webrtc">test webrtc</a><br><br>
<script>
//alert(localStorage.abuse);
var s=new EventSource('/log_rooms');
s.onopen=function(e){console.log('event source is opened! ')}
s.onmessage=function(e){
console.log('event data:',e.data);
var mata=JSON.parse(e.data);
}
s.onerror=function(e){console.error("event source error: ");}
s.addEventListener('remove_room',remove_room,false);
s.addEventListener('add_room',add_room,false);
s.addEventListener('room_view',room_view,false);

function remove_room(e){
console.log('on remove_room : '+e.data);
var mata=JSON.parse(e.data);
var l=document.querySelector('[data-divroomid="'+mata.room_name+'"]');
if(l){l.remove()}
}

function add_room(e){
let m=JSON.parse(e.data);
console.warn('on_add room');
let div=document.createElement('div');
div.setAttribute("data-divroomid", m.room_name);
var bsrc;
if(m.src){
bsrc='<img src="'+m.src+'"/>';
}else{
bsrc='no image at the moment';
}
div.innerHTML='<a href="/webrtc/'+m.room_name+'">'+m.room_name+'</a><br><br>'+
'<b>img src: </b>'+bsrc+'<br><br>'+
'<b>status: </b><span class="rstatus" data-rstatus="'+m.room_name+'">'+m.status+'</span><br><br>'+
'<b>viewers: </b><span class="rviewers" data-rviewers="'+m.room_name+'">'+m.view+'</span><br><br>';
roomContainer.appendChild(div);
}
function room_view(e){
let d=JSON.parse(e.data);
console.warn('on room_view: ',d);
let m=document.querySelector('[data-rviewers="'+d.room_name+'"]');
if(m){m.textContent=d.peers;}
}
</script>
<button onclick="gof();">gof</button>
<script>
function gof(){
let data={}
var xhr=new XMLHttpRequest();
xhr.open('post','/api/gof');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
console.warn('xhr from server: ',this.response);
}else{
console.error('xhr from server: ',this.response);
}}
xhr.onerror=function(e){alert(e)};
data.me='du';
console.log(JSON.stringify(data));
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
s2=`<ul><li><b>name: </b>${buser.name}</li>
${(buser.email ? `<li><b>email: </b>${buser.email}</li>` : `<li>No Mail</li>`)}
<li><b>items: </b>${buser.items}</li>
<li><b>w_items: </b>${buser.w_items}</li></ul>`;}
return s2;}

function users_list(n){
let s='';
if(Array.isArray(n)){
 s+='<ul>';
 n.forEach((el,i)=>{
s+=`<li><a href="/webrtc/${el.name}">${el.name}</a>`;
});
	s+='</ul>';
   }
return s;
}

function roomers_list(n){
let s='';
if(Array.isArray(n)){
 s+='<ul>';
 n.forEach((el,i)=>{
s+=`<hr><div data-divroomid="${el.name}">
<a href="/webrtc/${el.name}">${el.name}</a><br><br>
<b>img src: </b>${el.src ? `<img src="${el.src}"/>`:'no image'}<br><br>
<b>status: </b><span class="rstatus" data-rstatus="${el.name}">${el.status}</span><br><br>
<b>viewers: </b><span class="rviewers" data-rviewers="${el.name}">${el.view}</span><br><br>
</div><hr>`;
});
	s+='</ul>';
   }
return s;
}

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
function get_meta(){
let s='';
	s+=`
<meta property="og:locale" content="ru_RU"/>
<meta property="og:type" content="website" />
<meta property="og:title" content="Sex Videochat Alikon - тысячи моделей готовы пообщаться с тобой в любое время дня и ночи прямо из своих спален!"/>
<meta property="og:description" content="Эротический видеочат для взрослых. Тысячи моделей готовы пообщаться с тобой в любое время дня и ночи прямо из своих спален!"/>
<meta property="og:image" content="http://alikon.herokuapp.com/images/bona.png"/>
<meta property="og:url" content="http://alikon.herokuapp.com"/>
<meta property="og:site_name" content="Alikon"/>
<meta itemprop="name" content="Sex Videochat Alikon"/>
<meta itemprop="description" content="Эротический видеочат для взрослых - тысячи моделей готовы пообщаться с тобой в любое время дня и ночи прямо из своих спален!"/>
<meta itemprop="image" content="http://alikon.herokuapp.com/images/bona.png"/>
`;
	return s;
}