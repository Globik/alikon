//admin_main_menu.js
var admin_main_menu=n=>`<div id="admin_main_menu">
<select id="operamini-menu-selector" dropdown=true onchange="showname1(this.value)">
<option value="">menu</option>
<option value="/">home</option>
<option value="/articles">articles</option>
<option value="/labs">labs</option>
<option value="/dashboard">dashboard</option>
</select><script>
function showname1(el){window.location.href=el;}</script></div>`;
module.exports={admin_main_menu};