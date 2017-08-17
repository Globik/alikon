//admin_main_menu.js
var admin_main_menu=n=>`<div id="admin_main_menu">
<select id="operamini-menu-selector" dropdown=true onchange="showname1(this.value)">
<option value="">menu</option>
<option value="/">home</option>
<option value="/articles">articles</option>
<option value="/labs">labs</option>
<option value="/dashboard">dashboard</option>
</select>
&nbsp;notes:&nbsp;<span onclick="fetch_abuse_popup();">${n.abuse_nots ? n.abuse_nots.rowCount:''}</span></div>
<a href="#" class="overlay" id="link_abuse_popup"></a>
<output id="abuse_popup" class="popi">
<a href="#" class="close" style="text-decoration:none;"><span class="before" style="">X</span></a><div style="clear:both;"></div>
<div id="html_abuse_popup"></div><small onclick="xhr_abuse_list();">else</small>
</output>
<script>
var bflag=0;
function showname1(el){window.location.href=el;}
function fetch_abuse_popup(){
window.location.href="#link_abuse_popup";
get_abuse_list();
}
function get_abuse_list(){
var xhr=new XMLHttpRequest();
xhr.open('post','/api/get_abuse_list')
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
let b=JSON.parse(this.response);
html_abuse_popup.innerHTML+=b.content;
console.log(this.response);}else{alert(this.response);}
}
xhr.onerror=function(e){console.error(e);}
let d={};
d.list='list';
if(bflag==0)xhr.send(JSON.stringify(d));
}
function xhr_abuse_list(){
bflag=0;
get_abuse_list();
}
link_abuse_popup.onclick=function(){bflag=1;}
</script>`;
module.exports={admin_main_menu};