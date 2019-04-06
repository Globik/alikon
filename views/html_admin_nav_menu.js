const file='admin_main_menu.js',gf=`<!-- ${file} -->`;
var html_admin_nav_menu=n=>{
	let {abuse_nots}=n;
	return `${gf}<div id="admin_main_menu">
<select id="operamini-menu-selector" dropdown=true onchange="showname1(this.value)">
<option value="">menu</option>
<option value="/">home</option>
<option value="/articles">articles</option>
<option value="/labs">labs</option>
<option value="/dashboard">dashboard</option>
</select>
&nbsp;notes:&nbsp;<span onclick="fetch_abuse_popup();" style="background:yellow;">
${abuse_nots?(abuse_nots.rowCount==0?'':abuse_nots.rowCount):''}</span> 
</div>
<a href="#." class="overlay" id="abuse_popup"></a>
<output id="abuse_id" class="popi">
<div class="wrap-close"><a href="#." onclick="clickclose();" class="close"></a></div>
<span class="msp fel"><small>amin</small></span><span class="msp fel"><small>le pen</small></span><span class="msp fel"><small>duren</small></span>
<div id="html_abuse_popup" class="lopi"><ul id="abuse_ul"></ul></div>
<div class="podsmall"><small class="centstr" onclick="xhr_abuse_list();">else</small></div>
<button onclick="insert_part();">insert part</button>
</output>
<script src="/js/abuse_notes.js"></script>${gf}`;}
module.exports={html_admin_nav_menu};
/*
'2017-08-15 14:37:08.784881'
select*from abuse where status='neu' and at > '2017-08-15 14:37:08.784881';
*/
