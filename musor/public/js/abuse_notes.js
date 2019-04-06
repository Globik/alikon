var bflag=0;
var scrflag=0;
var sigara=0;
var ul=gid('abuse_ul');
var body=document.querySelector('body');
var html_abuse_popup=gid('html_abuse_popup');
function showname1(el){window.location.href=el;}
function fetch_abuse_popup(){
window.location.href="#abuse_popup";
get_abuse_list();
body.className="ondialog";
}
function get_abuse_list(b){
var xhr=new XMLHttpRequest();
xhr.open('post','/api/get_abuse_list')
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
var b=JSON.parse(this.response);
if(b.abuse_list.length==0)scrflag=1;
form_abuse_list(b)
console.log(this.response);}else{alert(this.response);}
}
xhr.onerror=function(e){console.error(e);}
var d={};
d.list='list';
if(b)d.nieder=b;
if(bflag==0)xhr.send(JSON.stringify(d));
}
function xhr_abuse_list(){
if(scrflag==1){console.error('!! END!!!');return;}
var b=ul.lastChild.getAttribute('data-at');
if(!b)return;
bflag=0;
get_abuse_list(b);
}

function form_abuse_list(n){
var frag=document.createDocumentFragment();
n.abuse_list.forEach(function(el,i){
var li=document.createElement('li');
li.className="abuseli";
li.setAttribute('data-aid',el.abus_id);
li.setAttribute('data-at',el.ab_at);
(el.cmt?li.title=el.cmt:'');
var cd='&nbsp;<span class="msp">'+el.ab_cnt+'</span>';
li.innerHTML='<a class="fe" href="/webrtc/'+el.name+'" target="_blank">'+el.name+'</a>&nbsp;'+'<span class="msp">'+el.ab_slc+'</span>'+cd;
frag.appendChild(li)
});
ul.appendChild(frag);
}
abuse_popup.onclick=function(e){do_flag_click_close();}

function clickclose(e){do_flag_click_close();}
function do_flag_click_close(){
bflag=1;body.className="";in_rem_hash();
}
var vid=0;

function fake(){
var frag=document.createDocumentFragment();
var li=document.createElement('li');
li.className="abuseli";
li.setAttribute('data-vid',vid);
li.innerHTML='<a class="fe" href="/webrtc/el.name" target="_blank">el.name</a>&nbsp;<span class="msp">el.slc '+vid+'</span>';
frag.appendChild(li)
ul.appendChild(frag);
vid++;
}
html_abuse_popup.onscroll=function(e){
//console.log('onscroll');
//console.log('scrollHeight: ',e.target.scrollHeight);
//console.log('scrollTop: ',e.target.scrollTop);
//console.log('clientHeight: ',e.target.clientHeight);
//console.warn('offsetHeight: ',e.target.offsetHeight);
if(e.target.scrollHeight-e.target.clientHeight==e.target.scrollTop){
console.error('yes');
if(sigara==0){
var di=ul.lastChild.getAttribute('data-vid')
xhr_abuse_list();
//sigara=1;
//alert(vid);
}

}
}
function insert_part(){
var frag=document.createDocumentFragment();
var li=document.createElement('li');
li.className="abuseli";
li.setAttribute('data-vid',vid);
li.innerHTML='<a class="fe" href="/webrtc/el.name" target="_blank">el.name</a>&nbsp;<span class="msp">el.slc  eventsource'+vid+'</span>';
frag.appendChild(li)
if(ul.hasChildNodes()){
console.log('has childnodes()');
ul.insertBefore(frag,ul.firstChild)
}else{
ul.appendChild(frag);
}
}
function gid(id){return document.getElementById(id);}