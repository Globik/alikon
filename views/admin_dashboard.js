//admin_dashboard.js
const head=require('./head.js');
const header_menu=require('./header_menu');
const admin_main_menu=require('./admin_main_menu');
const footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;


let admin_dashboard=n=>{
var {showmodule:{mainmenu,profiler}}=n;const buser=n.user;
return `<!DOCTYPE html><html lang="en"><head>${head.head({title:"Dashboard", csslink:"/css/main2.css"})}</head><body>
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap">
hallo ${buser.name}<br>
<li><a href="/dashboard/articles">Articles Manager</a>
<li><a href="/dashboard/albums">Photos</a>

<li><a href="/dashboard/mongodb">Mongodb</a>
<li><a href="/dashboard/banners">banners</a>
<li><a href="/dashboard/cabinet_admin">cabinet admin(payments)</a>

</main><footer id="footer">${footer.footer({})}</footer></body></html>`;
}

module.exports={admin_dashboard};