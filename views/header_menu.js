//header_menu.js
var sign_up=false;
var header_menu=n=>{
	return `<!-- header_menu.js -->
	<!-- <ul id="menu"> 
	<li><a href="/">home</a>
    <li><a href="/articles">articles</a>
    <li><a href="/labs">labs</a>
    </ul> -->
${getMenu(n)} 
<label style="position:absolute;right:3.2em;top:0.1em;background:yellow;">log in or sign up</label>
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
${(n.buser ? `<li><div class="znak-svg">pic</div><a href="/profile">profile</a>`:``)}
${(n.buser ? `<li><div class="znak-svg">pic</div><a href="/logout" id="login_pop">log out</a>`:`<li><div class="znak-svg">pic</div><a href="/login">log in</a></li>`)}
${(sign_up ? `<li><div class="znak-svg">pic</div><a href="#join_form" id="join_pop">sign up</a>` :``)}
</ul>
-->
<script>
var duri=gbid("duri"),elmini=gbid("operamini-menu-selector"),minmen=gbid('miniMenu'),
lb=gbid('lb-menu-all'),dsel=document.querySelectorAll('label .spinner');
var mainP=gbid('enc');
var gr=true;
function dowas1(){
if(gr){minmen.className="touch-mini-menu";
minmen.style.display="block";
minmen.style.zIndex="2";
lb.classList.add('active');
sumor(dsel,'active');
gr=false;}
else{minmen.className="";minmen.style.display="none";minmen.style.zIndex="0";
lb.classList.remove('active');
sumor(dsel,'active');
gr=true;}
}
document.body.onload=shalter;
	function shalter(){
document.querySelector('#pagewrap').onclick=clickshalter;
function clickshalter(){
	minmen.className="";
	minmen.style.display="none";
	lb.classList.remove("active");
	sumor(dsel,'active');
	gr=true;
}}
var isOperaMini = (navigator.userAgent.indexOf('Opera Mini')>-1);
if(isOperaMini){
duri.style.display="none";
elmini.style.display="block";}
function gbid(id){return document.getElementById(id)}
function sumor(el,clas){
for(var i=0;i<el.length;i++){if(el[i].classList.contains(clas)==false){
el[i].classList.add(clas);}else{el[i].classList.remove(clas);}
}}</script><!-- end of header_menu.js -->`;}
module.exports={header_menu};
function getMenu(n){
	var sr="";
	var {mainmenu}=n;
	//var mainmenu=n.mainmenu;
	//console.log('mainmenu:',mainmenu);
	sr+=`<ul id="menu">`;
	for(var {name,path} of mainmenu){sr+=`<li><a href="${path}">${name}</a>`;}
	sr+=`</ul>`;
	return sr;
}
function getProfileMenu(n){
	var {buser,mainmenu,profiler}=n;
	var {loginname,loginpath,logoutname,logoutpath,profilername,profilerpath,signupname,signupshow}=profiler;
	var su="";
	su+=`<ul id="miniMenu" class="">`;
for(var {name,path} of mainmenu){su+=`<li><div class="znak-svg">pic</div><a href="${path}">${name}</a>`;}
su+=`${(buser ? `<li><div class="znak-svg">pic</div><a href="${profilerpath}">${profilername}</a>`:``)}
${buser ? `<li><div class="znak-svg">pic</div><a href="${logoutpath}" id="login_pop">${logoutname}</a>`:`<li><div class="znak-svg">pic</div><a href="${loginpath}">${loginname}</a></li>`}
${signupshow ? `${fuckme(n)}`:''}`;
	su+="</ul>";return su;}

function fuckme(n){
	let s=``;
	console.log('BUSERRRRRR: ',n.buser);
	if(n.buser){s+=``;}else{
s+=`<li><div class="znak-svg">pic</div>
<a href="/signup">sign up</a>`;
	}
	return s;
}















