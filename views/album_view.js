const head=require('./head.js');
const dev_user=process.env.DEV_USER;
const dev_pwd=process.env.DEV_PWD;
const dev_email=process.env.DEV_EMAIL;
const header_menu=require('./header_menu');
const admin_main_menu=require('./admin_main_menu');
const footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;

var album_view=n=>{
let {buser, photos, showmodule:{mainmenu,profiler}}=n;
return`<!DOCTYPE html><html lang="en">
<head>${head.head({title:"Image uploader",csslink:"/css/main2.css",/*csshelper:`${login_css.login_css({})}`*/})}</head>
<body>
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap">
${photos !==null ? `${list_photos(photos)}`:'<b>no photos</b>'}
</main><footer id="footer">${footer.footer({})}</footer></body></html>`;
}
module.exports={album_view}

function list_photos(n){
let s='<ul>';
n.forEach((el,i)=>{
s+=`<li>${el.title}<li><img src="/uploads/${el.src1}">`
})
s+='</ul>';
return s;
}