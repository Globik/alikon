//admin_dashboard.js
const html_head=require('./html_head.js'); // head.js 
const html_nav_menu=require('./html_nav_menu.js');// header_menu.js
const html_admin_nav_menu=require('./html_admin_nav_menu.js');// admin_main_menu.js
const html_footer = require('./html_footer.js');// footer.js
var warnig=false;	  
var haupt_ban=false;


let admin_dashboard=n=>{
var {showmodule:{mainmenu,profiler}}=n;const buser=n.user;
return `<!DOCTYPE html><html lang="en"><head>${html_head.html_head({title:"Dashboard", csslink:"/css/main2.css"})}</head><body>
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${html_nav_menu.html_nav_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.brole=='superadmin') ? `${html_admin_nav_menu.html_admin_nav_menu({})}`:``)}
<main id="pagewrap">
hallo ${buser.bname}<br>
<li><a href="/dashboard/articles">Articles Manager</a>
<li><a href="/dashboard/albums">Photos</a>

<li><a href="/dashboard/mongodb">Mongodb</a>
<li><a href="/dashboard/banners">banners</a>
<li><a href="/dashboard/cabinet_admin">cabinet admin(payments)</a>
<li><a href="/dashboard/admin_bitaps">bitaps api</a>

</main><footer id="footer">${html_footer.html_footer({})}</footer></body></html>`;
}

module.exports={admin_dashboard};