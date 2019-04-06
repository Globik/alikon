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
let {post, showmodule:{mainmenu,profiler}}=n;
const buser=n.user;
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
<script>
var msecperminute=1000*60;
var msecperhour=msecperminute*60;
var msecperday=msecperhour*24;
function form_date(el){
el.nextSibling.textContent=el.value;
		var bate=new Date();
		//var date=new Date('3/20/2017 17:54:0');
		//var date=new Date('2017-03-20T18:08')
			if(el.value){
		var date=new Date(el.value);
		var datemsec=date.getTime();
		//alert(bate.getMonth());
		date.setMonth(bate.getMonth());
		date.setDate(bate.getDate());
		date.setYear(bate.getFullYear());
		date.setHours(bate.getHours(), bate.getMinutes(),0,0);
		var interval=datemsec-date.getTime();
		var days=Math.floor(interval/msecperday);
		interval=interval-(days*msecperday);
		
		var hours=Math.floor(interval/msecperhour);
		interval=interval-(hours*msecperhour);
		
		var minutes=Math.floor(interval/msecperminute);
		interval=interval-(minutes*msecperminute);
		var seconds=Math.floor(interval/1000);
		el.nextSibling.nextSibling.textContent=days+' days '+hours+' hours '+minutes+' mins';//, '+seconds+' secs.';
			}else{
alert('fill in normal');
}
}
function  mach(el){
if(el.checked){
el.nextSibling.textContent="true";
el.value="true";
}else{el.nextSibling.textContent="false";
el.value="false";
}
}
</script>
</html>
`;}

module.exports={adm_dsh_banners}
function banner_list(n){
let s='';
n.forEach((el,i)=>{
s+=`<form action=""><div><input type="submit" value="submit" onsubmit="altivieren(this);"/></div>
<b>title: </b><input type="text" name="title" value="${el.title}"/><br>
<b>id: </b><input type="text" name="id" value="${el.id}"/><br>
<b>alt: </b><input type="text" name="alt" value="${el.alt}"/><br>
<b>href: </b><input type="text" name="href" value="${el.href}"/><br>
<b>src: </b><input type="text" name="url" value="${el.src}"/><br>
<b>cust_id: </b>${el.cust_id}<br>
<b>active: </b><input type="checkbox" name="active" value="${el.active}" required onchange="mach(this);"/><span>${el.active}</span><br>
<b>cr_at: </b>${el.cr_at}<br>
<b>start: </b><input type="datetime-local" placeholder="YYYY-MM-DD HH:mm" oninput="form_date(this)" required/> <span>${el.start}</span><span></span><br>
<b>endi: </b><input type="datetime-local" placeholder="YYYY-MM-DD HH:mm" oninput="form_date(this)" required/> <span>${el.endi}</span><span></span><br>
<b>l_mod: </b>${el.l_mod}<br>
<b>type: </b><input type="text" name="type" value="${el.type}"/><br>
<b>price: </b></form>`;	
});
	
		  return s;
}