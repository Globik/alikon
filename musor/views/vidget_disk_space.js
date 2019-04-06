/* vidget_disk_space.js */
'use strict';
var gib=1024*1024*1024,mib=1024*1024;
let vidget_disk_space=n =>{
	
let s='';
if(n.pip && n.dbtotalsize){
	let {dbtotalsize}=n;
	let {total, free}=n.pip;
	var used=total-free;
s+=html`${getStyle(n)}
<div class="meter"><meter max="${total}" value="${used}" title="${total/gib}GB ${total/mib}MB">
<div id="fb-meter"><span>.</span></div></meter>
<section class="moo" style="">
<ul>
<li>on disk: <div class="scor">${(total/gib).toFixed(0)}GB</div>
<li>used: <div class="scor">${(used*100/total).toFixed(0)}%</div>
<li>free: <div class="scor">${(free*100/total).toFixed(0)}%</div>
<li>database: <div class="scor">${(dbtotalsize*100/used).toFixed(2)}%</div>
</ul>
</section></div>
<div class="meter">nnHH</div>`;
}
return s;}

module.exports={vidget_disk_space};

function getStyle(n){
var {dbtotalsize}=n;
var {total,free}=n.pip;
var used_space=total-free;
var color_stop=dbtotalsize*100/used_space;
return html`<style>
meter{width:100%;}
#fb-meter{background:blue;width:100%;display:block;position:relative;
background-image: -ms-linear-gradient(left, blue 0%, blue ${color_stop}%,red ${color_stop}%,
red ${color_stop+color_stop}%,#f9f9f9 ${color_stop+color_stop}%,#f9f9f9 100%);
background-size:100% 100%;
border:1px solid blue;
border-radius:4px;
height:40px;
}
.meter{
padding: 0.8rem;
border:10px solid transparent;
overflow-x:hidden;

height: 100%;

/*min-width:212px;*/
min-width: calc(212px - 8vw);
width:50%;
background:rgba(255,200,0,0.4);
}

meter::-webkit-meter-optimum-value{
background:red;
background-image: linear-gradient(90deg, blue 0%, blue ${color_stop}%,green ${color_stop}%,green ${color_stop + color_stop}%); 
background-size: 100% 100%;
} 
.moo{
	width:100%;
	flex:0 50%;
	background:lightblue;
	
	}
.scor{background:lightgreen;float:right;}
</style>`;
}
function html(s,...v){
var res='';for(let i=0;i<v.length;i++){res+=s[i];res+=v[i];} res+=s[s.length-1];return res.replace(/\n/g,'');}










