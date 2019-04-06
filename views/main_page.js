const file='haupt_page.js',endf=`<!-- ${file} -->`;
const html_head=require('./html_head'),html_nav_menu=require('./html_nav_menu'),
	 html_admin_nav_menu=require('./html_admin_nav_menu'),html_footer=require('./html_footer');
var warnig=false,haupt_ban=false;

const main_page=n=>{
const {lusers,showmodule:{mainmenu,profiler}}=n;
const buser=n.user,roomers=n.roomers;
//const mainmenu=n.mainmenu;
//const pr
return `<!DOCTYPE html><html lang="en">
<head>${html_head.html_head({title:"home", meta:get_meta(),csslink:"/css/main2.css",luser:buser})}</head>
<body>${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${html_nav_menu.html_nav_menu({buser:buser,mainmenu:mainmenu,profiler:profiler})}</nav>
${haupt_ban ?'<div id="haupt-banner"><div id="real-ban">Banner</div></div>':''}
${buser && buser.brole=='superadmin'?html_admin_nav_menu.html_admin_nav_menu(n):''}
${endf}
<main id="pagewrap"> 
${n.m?n.m.msg:''}<br><br>
<h1>Сайт в разработке! Under construction!</h1>
${buser?buser.bname:'Guest<br>'}
${buser?'<a href="/logout">logout</a>':'<a href="/login">login</a>'}
<script>${clearCache()}</script>
<hr>
<h4>Users: </h4>
${users_list(lusers)}
<a href="/webrtc/${buser?buser.bname:'no_name'}">${buser?buser.bname:'no name'}</a>
<hr>
<h4>Roomers:</h4>
<div id="roomContainer">
${roomers && roomers.length >0 ? roomers_list(roomers) : '<-- <b id="noroomer">No rooms at the moment</b> -->'}
</div>
</main>
${endf}
<footer id="footer">${html_footer.html_footer({})}</footer></body></html>`;}

module.exports={main_page};

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
	s+=``;
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
