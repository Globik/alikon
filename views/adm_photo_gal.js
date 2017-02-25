//adm_photo_gallery.js
const head=require('./head.js');
const dev_user=process.env.DEV_USER;
const dev_pwd=process.env.DEV_PWD;
const dev_email=process.env.DEV_EMAIL;
const header_menu=require('./header_menu');
const admin_main_menu=require('./admin_main_menu');
const footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;

var adm_photo_gal=n=>{
let {buser,post, showmodule:{mainmenu,profiler}}=n;
return`<!DOCTYPE html><html lang="en">
<head>${head.head({title:"Add photos", cssl:["/css/main2.css","/css/popup.css"]})}</head>
<body>
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}

<main id="pagewrap">
<h4>Add photo gallery</h4>
<h5>Metainfo</h5>
<b>user_email: </b><span id="user_email">${buser ? buser.email : ''}</span><br>
<b>article_id: </b><span id="article_id">${post ? post.id :''}</span><br>
<b>album id: </b><span id="alb_id"></span><br>
<b>album title: </b><span id="alb_title"></span><br>
<hr>
<button onclick="get_albums();">get album list</button>
<script>
function get_albums(){
var data={};
data.user_email=user_email.textContent;
var xhr=new XMLHttpRequest();
xhr.open('post','/dashboard/albums_list');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
var mata=JSON.parse(this.response);
alert(this.response);
}else{alert(this.response);}
}
xhr.onerror=function(e){alert(e);}
xhr.send(JSON.stringify(data));
}
</script>
</main><footer id="footer">${footer.footer({})}</footer>
</body>
</html>`;
}
module.exports={adm_photo_gal};