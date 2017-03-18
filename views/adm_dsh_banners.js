//adm_dsh_banners.js

const head=require('./head.js');
const dev_user=process.env.DEV_USER;
const dev_pwd=process.env.DEV_PWD;
const dev_email=process.env.DEV_EMAIL;
const header_menu=require('./header_menu');
const admin_main_menu=require('./admin_main_menu');
//const article_editor=require('./article_editor.js');
const footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;

var adm_dsh_banners=n=>{
let {buser,post, showmodule:{mainmenu,profiler}}=n;
return`<!DOCTYPE html><html lang="en">
<head>${head.head({title:"Banners", cssl:["/css/main2.css","/css/popup.css","/css/loader.css"]})}</head>
<body>
<!-- adm_photo_gal -->
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap">
<h3>banners</h3>
${n.banners !==null ? banner_list(n.banners) : '<b>no banners yet</b>'}
</main><footer id="footer">${footer.footer({})}</footer>
</body>
</html>
`;}

module.exports={adm_dsh_banners}
function banner_list(n){
let s='';
n.forEach((el,i)=>{
s+=`<ul><div><button value="${el.id}" onclick="altivieren();">aktivieren</button></div><li><b>title: </b>${el.title}
<li><b>id: </b>${el.id}<li><b>alt: </b>${el.alt}<li><b>href: </b>${el.href}<li><b>src: </b>${el.src}
<li><b>cust_id: </b>${el.cust_id}<li><b>active: </b>${el.active}
<li><b>cr_at: </b>${el.cr_at}
<li><b>start: </b><span>${el.start}</span><input type="datetime-local"/>
<li><b>endi: </b>${el.endi}
<li><b>l_mod: </b>${el.l_mod}
<li><b>type: </b>${el.type}
<li><b>price: </b></ul>`;	
});
	
		  return s;
}