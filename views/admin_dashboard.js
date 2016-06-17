//admin_dashboard.js
'use strict';
//let rel=require('../libs/hotreload.js');
var admin_main_menu=require('./admin_main_menu.js');

let admin_dashboard=n=>{
return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>Dashboard</title></head><body>
${(n.buser ? `${admin_main_menu.admin_main_menu({})}`:``)}
hallo {n.buser.username}<br>
<li><a href="/dashboard/articles">Articles Manager</a>
<li><a href="/dashboard/mongodb">Mongodb</a>
</body></html>`;
}

module.exports={admin_dashboard};