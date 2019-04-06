function get_one_abuse(){
window.location.href="#one_abuse";
}
function ban_model(){
var d={};
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
var d={};
	d.bn_us_id=modelId;
	d.bn_us_by=yourId;
	d.bn_slc=el.getAttribute('data-ab_slc');
	d.bn_cmt=el.getAttribute('data-ab_cmt');
	d.bn_status='yes';
	d.is_banned=is_banned();
ban_user_xhr(d);
}
function socket_to_ban_user(){
var outi={};
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
var bi=JSON.parse(this.response);
	
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
var bi=JSON.parse(this.response);
console.warn('xhr from server: ',this.response);
}else{
alert(this.response);
}}
xhr.onerror=function(e){console.error(e)};
var d={};
d.abus_id=modelId;
var a=JSON.stringify(d);
alert(a);
xhr.send(a);
}
function ban_out(el){
if(!is_banned()){alert('This user is already ban out!');return;}
var d={}
//model_id,bn_status='no',bstatus='end',ban_id
d.model_id=modelId;
d.bn_status='no';
d.bstatus='end';
d.ban_id=el.getAttribute('data-ban_id');
if(!d.ban_id)return;
var a=JSON.stringify(d);
alert(a);
var xhr=new XMLHttpRequest();
xhr.open('post','/api/ban_out_user');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
var bi=JSON.parse(this.response);
alert(this.response);
gid('is_banned').value="no";
vidW.classList.remove('banned');
var outi={};
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
function hol_stoper(){
window.location.href="#stoper";
}
var pipka=false;
var smart_stop_ev=cr_event('smartStop');//new Event('smartStop');
var dirty_stop_ev=cr_event('dirtyStop');//new Event('dirtyStop');
if(is_langsam_stop()){pipka=true;}

smartStopBtn.onclick=function(e){

if(e.target.dataset.zus=='false'){
shell(e,'Do you wish enable smart stoping all video streams on this site?',smart_stop_ev);
}else{
shell(e,'Do you wish disable a smart stoping process?',smart_stop_ev);
}
}

dirtyStopBtn.onclick=function(e){
if(smartStopBtn.dataset.zus !=='null'){
if(!pipka){shell(e,'Dirty stop all video streams on this site right now?',dirty_stop_ev);}else{
shell(e,'Reallowed all videostream processes?',dirty_stop_ev);
}
}else{
shell(e,'Wish you restart video streaming processes?',dirty_stop_ev);
}
}
smartStopBtn.addEventListener('smartStop',smart_stop_streams,false);
dirtyStopBtn.addEventListener('dirtyStop',emergency_stop_streams,false);
function smart_stop_streams(el){
if(el.target.dataset.zus=='false'){
el.target.setAttribute('data-zus', true);
}else{el.target.setAttribute('data-zus',false)}
var xhr=new XMLHttpRequest();
xhr.open('post','/api/langsam_stop');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
console.log(this.response);
var m=JSON.parse(this.response);
gid('langsam_stop').value=m.stopi;
el.target.setAttribute('data-zus',m.stopi);
if(m.stopi){
galert('OK. Smart stoping streams enabled!');
sendJson({type:"note",msg:"Smart stoping streams occured. Sorry.",from_nick:"admin"});
el.target.textContent='cancel smart';
}else{
galert('OK. Smart stoping streams disabled!');
if(pipka){
dirtyStopBtn.textContent="dirty stop";
pipka=false;
}
sendJson({type:"note",msg:"Stream are allowed now 2, hurra!!!",from_nick:"admin"});
el.target.textContent='smart stop';
}
}else{
alert(this.response);
}}
xhr.onerror=function(e){console.error(e)};
var d={};
if(el.target.dataset.zus=="true"){
d.stop=true;
}else{
d.stop=false;
}
xhr.send(JSON.stringify(d));
};

function emergency_stop_streams(e){
if(!pipka){	
sendJson({type:"emergency_stop",msg:"stop all streaming",from_nick:"admin"});
sendJson({type:"note",msg:"Emergency papa stop all streams. Sorry.",from_nick:"admin"});
e.target.textContent='enable';
if(!is_langsam_stop()){
smartStopBtn.setAttribute('data-zus','false');
smartStopBtn.dispatchEvent(smart_stop_ev);
}
pipka=true;
}else{
smartStopBtn.setAttribute('data-zus','true');
smartStopBtn.dispatchEvent(smart_stop_ev); 
}
}