//header_menu.js
var sign_up=false;
const html_nav_menu=n=>{
return `<!-- header_menu.js -->
${getMenu(n)} 

<label id="lb-menu-all" class="lb-menu-all" onclick="dowas1();">
 <div class="spinner diagonal part-1"></div>
 <div class="spinner horizontal"></div>
 <div class="spinner diagonal part-2"></div>
</label>
${getProfileMenu(n)}
<!--
<ul id="miniMenu" class="">
<li><div id="enc" class="znak-svg">pic</div><a href="/">home-1</a></li>
<li><div class="znak-svg">pic</div><a href="/articles">articles</a>
<li><div class="znak-svg">pic</div><a href="/labs">labs</a>
${(n.buser ? `<li><div class="znak-svg">pic</div><a href="/home/profile">profile</a>`:``)}
${(n.buser ? `<li><div class="znak-svg">pic</div><a href="/logout" id="login_pop">log out</a>`:`<li><div class="znak-svg">pic</div><a href="/login">log in</a></li>`)}
${(sign_up ? `<li><div class="znak-svg">pic</div><a href="#join_form" id="join_pop">sign up</a>` :``)}
</ul>
-->
<a href="#." class="overlay" id="message_box"></a>
<output id="out_box" class="popi">
<div class="wrap-close"><a href="#." class="close"></a></div>
<div id="inbox"></div>
</output>
<dialog  id="dialogConfirm">
<div id="inbox3"></div>
<form method="dialog" style="display:none;">
<button id="dialogCancelbtn" type="reset" onclick="dialogConfirm.close();">cancel</button>
<button type="submit" value="true">yes</button><button type="submit" value="false">no</button>
</form>
</dialog>
<output class="alert" id="alert_id">
<div id="inbox2"></div>
</output>
<script>
var duri=gid("duri"),elmini=gid("operamini-menu-selector"),minmen=gid('miniMenu'),
lb=gid('lb-menu-all'),dsel=document.querySelectorAll('label .spinner');
var mainP=gid('enc');
var gr=true;
function dowas1(){
if(gr){
minmen.style.display="block";
minmen.style.zIndex="2";
//lb.classList.add('active');
gad(dsel,'active');
gr=false;
}else{
minmen.style.display="none";
minmen.style.zIndex="0";
//lb.classList.remove('active');
sumor(dsel,'active');
gr=true;}
}
document.body.onload=shalter;

function shalter(){
gid('pagewrap').onclick=clickshalter;
gid('pagewrap').ontouch=clickshalter;
var dlg=gid('dialogConfirm');
if(flexsupport==false){if(dlg) dlg.style.display="none";}
function clickshalter(e){
	minmen.style.display="none";
	//lb.classList.remove("active");
	sumor(dsel,'active');
//console.log('clicked!');
gr=true;
}}
var isOperaMini = (navigator.userAgent.indexOf('Opera Mini')>-1);
if(isOperaMini){
duri.style.display="none";
elmini.style.display="block";}
function sumor(el,clas){
for(var i=0;i<el.length;i++){
el[i].classList.remove(clas);
}
}
function gad(el,clas){
for(var i=0;i<el.length;i++){
el[i].classList.add(clas);
}
}
function gid(i){return document.getElementById(i);}
</script><!-- end of header_menu.js -->`;}
module.exports={html_nav_menu};

function getMenu(n){
let {mainmenu}=n,s='<ul id="menu">';
for(let {name,path} of mainmenu){s+=`<li><a href="${path}"><div class="mnav">${name}</div></a>`;}
s+='</ul>';
return s;
}

function getProfileMenu(n){
let {buser,mainmenu,profiler}=n,{loginname,loginpath,logoutname,logoutpath,profilername,profilerpath,signupname,signupshow}=profiler;
let s='<ul id="miniMenu" class="">';
for(var {name,path} of mainmenu){s+=`<li><div class="znak-svg">pic</div><a href="${path}"><div class="muka"><span>${name}</span></div></a>`;}
s+=`${(buser ? `<li><div class="znak-svg">pic</div><a href="${profilerpath}"><div class="muka"><span>${profilername}</span></div></a>`:'')}
${buser ? `<li><div class="znak-svg">pic</div><a href="${logoutpath}" id="login_pop"><div class="muka"><span>${logoutname}</span></div></a>`:`<li>
<div class="znak-svg">pic</div><a href="${loginpath}"><div class="muka"><span>${loginname}</span></div></a></li>`}${signupshow?fuckme(n):''}`;
s+="</ul>";return s;}
function fuckme(n){
let s='';
if(n.buser){s+=''}else{
s+=`<li><div class="znak-svg">pic</div><a href="/signup"><div class="muka"><span>sign up</span></div></a>`;
}
return s;}
