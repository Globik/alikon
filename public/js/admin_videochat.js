function get_one_abuse(){
window.location.href="#one_abuse";
}
function ban_model(){
let d={};
	d.bn_us_id=modelId;
	d.bn_us_by=yourId;
	d.bn_slc=complainiSelector.value;
	d.bn_cmt=txarComplain.value;
	d.bn_status='yes';
	d.is_banned=is_banned();
ban_user_xhr(d);
}
function ban_model2(el){
//banned_users(bn_us_id,bn_us_by,bn_status,bn_cmt,bn_slc)
let d={};
	d.bn_us_id=modelId;
	d.bn_us_by=yourId;
	d.bn_slc=el.getAttribute('data-ab_slc');
	d.bn_cmt=el.getAttribute('data-ab_cmt');
	d.bn_status='yes';
	d.is_banned=is_banned();
ban_user_xhr(d);
}
function socket_to_ban_user(){
let outi={};
outi.msg='You banned from broadcasting.';
outi.from_nick='moderator';
outi.type="message";
outi.admin_type="stop_broadcast";
outi.target=modelName;
sendJson(outi)
sendJson({type:"message",msg:modelName+" is banned.",roomname:modelName,from_nick:/*myusername*/"moderator",sub_admin_type:"us_ban"})
gid('is_banned').value="yes";
}

function ban_user_xhr(d){
if(is_banned()){alert('Already is banned!');return;}
var xhr=new XMLHttpRequest();
xhr.open('post','/api/set_ban_user_two');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
console.warn('xhr from server: ',this.response);
let bi=JSON.parse(this.response);
	
if(bi.bstatus==2){
alert(bi.info+' '+bi.result.ban_id);
banId.setAttribute('data-ban_id',bi.result.ban_id);
socket_to_ban_user();
}
}else{
alert(this.response);
}}
xhr.onerror=function(e){console.error(e)};
xhr.send(JSON.stringify(d));
//socket_to_ban_user();
}

function not_ban(){
var xhr=new XMLHttpRequest();
xhr.open('post','/api/skip_ban_user');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
let bi=JSON.parse(this.response);
console.warn('xhr from server: ',this.response);
}else{
alert(this.response);
}}
xhr.onerror=function(e){console.error(e)};
let d={};
d.abus_id=modelId;
let a=JSON.stringify(d);
alert(a);
xhr.send(a);
}
function ban_out(el){
if(!is_banned()){alert('This user is already ban out!');return;}
let d={}
//model_id,bn_status='no',bstatus='end',ban_id
d.model_id=modelId;
d.bn_status='no';
d.bstatus='end';
d.ban_id=el.getAttribute('data-ban_id');
if(!d.ban_id)return;
let a=JSON.stringify(d);
alert(a);
var xhr=new XMLHttpRequest();
xhr.open('post','/api/ban_out_user');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
let bi=JSON.parse(this.response);
alert(this.response);
gid('is_banned').value="no";
vidW.classList.remove('banned');
let outi={};
outi.msg='You just banned out';
outi.from_nick='moderator';
outi.type="message";
outi.admin_type="you_ban_out";
outi.target=modelName;
sendJson(outi)
//sendJson({type:"message",msg:modelName+" is just banned out.",roomname:modelName,from_nick:/*myusername*/"moderator",sub_admin_type:"us_ban_out"})
}else{
alert(this.response);
}}
xhr.onerror=function(e){console.error(e)};
xhr.send(a);
}	
if(is_langsam_stop()){gid('enable_langsam_stop').checked=true;stop_out.textContent="disable stop";}else{
gid('enable_langsam_stop').checked=false;
stop_out.textContent="enable stop";
}
gid('enable_langsam_stop').onchange=function(e){
if(e.target.checked){stop_out.textContent="disable stop";}else{stop_out.textContent="enable stop";}
}
function langsam_stop_it(){
var xhr=new XMLHttpRequest();
xhr.open('post','/api/langsam_stop');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
alert(this.response);
	let m=JSON.parse(this.response);
	gid('langsam_stop').value=m.stopi;
	gid('enable_langsam_stop').checked=m.stopi;
	if(m.stopi){stop_out.textContent='disable stop';}else{stop_out.textContent='enable stop';}
}else{
alert(this.response);
}}
xhr.onerror=function(e){console.error(e)};
let d={};
if(gid('enable_langsam_stop').checked){
d.stop=true;
}else{
d.stop=false;
}
xhr.send(JSON.stringify(d));
	 };
	
function emergency_stop_it(){
sendJson({type:"emergency_stop",msg:"stop all streaming",from_nick:"admin"});
gid('enable_langsam_stop').checked=true;
stop_out.textContent='disable stop';
langsam_stop_it();
}
	
	gid('message_box').onclick=function(e){
	console.log(99)
	setTimeout(function(){gh();},0);
	}
	
	function gh(){
		//alert(window.location.hash);
	//var wewa=
		//window.location.hash.replace(/#.*/,'suka');
		if(history)history.pushState('',null,window.location.pathname);
		//return false;
		//window.location.hash="#";
		//window.location=wewa;
	}