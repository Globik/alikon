//image_uploader.js
const head=require('./head.js');
const dev_user=process.env.DEV_USER;
const dev_pwd=process.env.DEV_PWD;
const dev_email=process.env.DEV_EMAIL;
const header_menu=require('./header_menu');
const admin_main_menu=require('./admin_main_menu');
const footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;
var albums= n =>{
let {buser, albums, showmodule:{mainmenu,profiler}}=n;
return `<!DOCTYPE html><html lang="en">
<head>${head.head({title:"Photo Albums",cssl:["/css/main2.css"],/*csshelper:`${login_css.login_css({})}`*/})}</head>
<body>
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap">

<div class="daper">
<b>Photo Albums</b>
<hr>
<h3>Albums: </h3>
${albums !==null ? `<ul>${list_albums(albums)}</ul>`:'<b>No albums</b>'}
<hr>
<label>Album's name:</label>
<input id='texFolder' type='text' style='width:40px' value='mama'/>folder
<br><button onclick="createAlbum()">create Album!</button>
<br><b>Multi: </b><span id="multi">4</span>

<br><b>Result :</b><span id="album_response"/></span><hr>

<b>User id: </b><span id="user_id">${buser ? `${buser.id}`:'no id'}</span><br>
<b>User email: </b><span id="user_email">${buser ? `${buser.email}`:'no email'}</span><br>
<br><span id="signal"></span><br>

<div id="resultat"></div>
<span id="output"></span></br>
<span id="nev" style="background:green;"></span>
<br>
<div id="output2">
<ul id="ulur"></ul>
 </div><br>
</div>
<script>
function createAlbum(){
var data={};
data.userId=user_id.textContent;
data.userEmail=user_email.textContent;
data.title=texFolder.value;
data.multi=multi.textContent;
var xhr=new XMLHttpRequest();
xhr.open('post','/create_album');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
var mata=JSON.parse(this.response);
	 //album_id.textContent=mata.album.id;
     //album_name.textContent=mata.album.title;
album_response.innerHTML=this.response;
}else{
album_response.innerHTML=this.response+this.status;
}}
xhr.onerror=function(e){alert(this.response + e)}
alert(JSON.stringify(data));
xhr.send(JSON.stringify(data));
}

function getDomArray(selector){
var elcol=document.querySelectorAll(selector);
var elar=Array.prototype.slice.apply(elcol);
return elar;
}
function crel(s){return document.createElement(s);}
</script>
</main><footer id="footer">${footer.footer({})}</footer></body></html>`;
}
module.exports={albums};
function list_albums(n){
let s='';
n.forEach((el, i)=>{
s+=`<li><a href="/dashboard/albums/${el.id}/${el.alb_title}">${el.alb_title}</a></li>`;
})
return s;}