/* admin_dashboard_mongodb.js */
var deb=false;
var admin_main_menu=require('./admin_main_menu.js');
var admin_dashboard_head=require('./admin_dashboard_head.js');
var rodval=require('./podval.js');
//var {css_admin}=require('../libs/css_admin_filter.js');
let admin_dashboard_mongodb= n =>{
let s='';
const GB=1024*1024*1024;
const MB=1024*1024;
var {filter_script,showmodule:{css_admin,script, podval}}=n;

s+=`<!DOCTYPE html>
<!-- admin_dashboard_mongodb.js -->
<html lang="en">
<head>
${admin_dashboard_head.admin_dashboard_head({title:"Admin DB",
css_admin: filter_script(css_admin,'admin_dashboard_mongodb'),
script: filter_script(script,"admin_dashboard_mongodb")})}
${getdiskstyle(n)}
</head>
<body>
<main>
${n.buser ? admin_main_menu.admin_main_menu({}):""}
<nav>navigation</nav>
<h1>Mongodb Manager</h1>
<section>
<div id="caption"><h4>Diskspace: </h4></div><output id="output_diskspace"></output>
<ul>
${(n.error ? `<li>error: <b>${n.error}</b>` : '')}
<li>totalSize: <b id="db-total" data-dbtotal="${n.dbs.totalSize}">${n.dbs.totalSize/MB}MB</b>
</ul>
<h4>Databases: </h4>
<button onclick="getDisk();">disk space</button>
<output>${enumDbs(n)}</output>
<button onclick="getCollectionsStats();">collection statistics</button>
	${getDiskSpace(n)}
	</section><footer>footer</footer>
</main>
</body>
${rodval.podval({podva:filter_script(podval,"admin_dashboard_mongodb")})}
</html>`;
return s;
}
module.exports={admin_dashboard_mongodb};

function enumDbs(n){
const ser=1024*1024;
let s="";
if(n.dbs && n.dbs.databases){
s+="<ul>";
for(var {name,empty,sizeOnDisk} of n.dbs.databases){
s+=`<li>name: <b>${name}</b><li>sizeOnDisk: <div class="score"><b>${sizeOnDisk/ser} mB</b></div>
<li>empty: <b>${empty}</b>`;
}
s+="</ul>";
}
return s;
}
function getdiskstyle(n){
	var s='';
	s+=`<style>
	#output_diskspace{
	display:flex;
	flex-wrap:wrap;
	position:relative;
	margin: 0 auto;
	padding:0;
	width:99%;  
	min-height:200px;height:auto;
	background:#f9f9f9;
	}
	ul{list-style-type:none;padding:0;margin:0;width:100%;}
ul li{padding:0.6em;}
	</style>`;
	return s;
}
function getDiskSpace(n){
	let s='';
	s+=`<script>
	var dbtotalsize=document.getElementById("db-total");
	var datadbtotal=dbtotalsize.getAttribute("data-dbtotal");
	function getDisk(){
		var data={};
var xhr=new XMLHttpRequest();
	xhr.open('post','/get_diskspace');
	xhr.setRequestHeader('Content-Type','application/json','utf-8');
	xhr.onload=function(e){
	if(xhr.status==200){
	console.log(this.response);
	var mg=JSON.parse(this.response);
	output_diskspace.innerHTML=mg.htmlbody;
	}
	else{
		alert(this.response);
		console.log(this.response);
		}}
		xhr.onerror=function(e){alert('error'+e);}
   data.dbtotalsize=datadbtotal;
	xhr.send(JSON.stringify(data));
}
function getCollectionsStats(){

var xhr=new XMLHttpRequest();
	xhr.open('get','/mongodb/get_db_collections_stats');
	//xhr.setRequestHeader('Content-Type','application/json','utf-8');
	xhr.onload=function(e){
	if(xhr.status==200){
	alert(this.response);
	//console.log(this.response);
	//var mg=JSON.parse(this.response);
	//output_diskspace.innerHTML=mg.htmlbody;
	}
	else{
		alert(this.response);
		console.log(this.response);
		}}
		xhr.onerror=function(e){alert('error'+e);}
	xhr.send();
}
	
	</script>`;
	return s;
}
function html(s,...v){
var res='';
for(let i=0;i<v.length;i++){
res+=s[i];
res+=v[i];
}
res+=s[s.length-1];
return res.replace(/\n/g,'');
}

function ml(s,...v){
	if(deb){
var res='';
for(let i=0;i<v.length;i++){
res+=s[i];
res+=v[i];
console.log('Values: ', i)
}
res+=s[s.length-1];
return res;
	}else{return s[v];}
}