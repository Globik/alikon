//admin_main_menu.js
var admin_main_menu=n=>`<div id="admin_main_menu">
<select id="operamini-menu-selector" dropdown=true onchange="showname1(this.value)">
<option value="">menu</option>
<option value="/">home</option>
<option value="/articles">articles</option>
<option value="/labs">labs</option>
<option value="/dashboard">dashboard</option>
</select>
&nbsp;notes:&nbsp;<span onclick="fetch_abuse_popup();" style="background:yellow;">${n.abuse_nots ? n.abuse_nots.rowCount:''}</span></div>
<a href="#" class="overlay" id="link_abuse_popup"></a>
<output id="abuse_popup" class="popi">
<a href="#" class="close" style="text-decoration:none;"><span class="before" onclick="clickclose();" style="">X</span></a>
<div style="clear:both;"></div>
<span class="msp fel"><small>amin</small></span><span class="msp fel"><small>le pen</small></span><span class="msp fel"><small>duren</small></span>
<div id="html_abuse_popup" class="lopi"><ul id="abuse_ul"></ul></div>
<div class="podsmall"><small class="centstr" onclick="xhr_abuse_list();">else</small></div>
<button onclick="insert_part();">insert part</button>
</output>
<script>
var bflag=0;
var scrflag=0;
var sigara=0;
var ul=gid('abuse_ul');
var body=document.querySelector('body');
var html_abuse_popup=gid('html_abuse_popup');
function showname1(el){window.location.href=el;}
function fetch_abuse_popup(){
window.location.href="#link_abuse_popup";
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
let b=JSON.parse(this.response);
if(b.abuse_list.length==0)scrflag=1;
form_abuse_list(b)
console.log(this.response);}else{alert(this.response);}
}
xhr.onerror=function(e){console.error(e);}
let d={};
d.list='list';
if(b)d.nieder=b;
if(bflag==0)xhr.send(JSON.stringify(d));
}
function xhr_abuse_list(){
//alert(3);
if(scrflag==1){console.error('!! END!!!');return;}
let b=ul.lastChild.getAttribute('data-at');
if(!b)return;
//alert(b);
bflag=0;
get_abuse_list(b);

//bflag=0;
//sigara=0;
//fake();
}

function form_abuse_list(n){

var frag=document.createDocumentFragment();
n.abuse_list.forEach(function(el,i){
let li=document.createElement('li');
li.className="abuseli";
li.setAttribute('data-aid',el.id);
li.setAttribute('data-abnick',el.by_nick);
li.setAttribute('data-at',el.at);
(el.cmnt?li.title=el.cmnt:'');
li.innerHTML='<a class="fe" href="/webrtc/'+el.name+'" target="_blank">'+el.name+'</a>&nbsp;'+'<span class="msp">'+el.slc+' | '+el.id+'</span>';
frag.appendChild(li)
});
ul.appendChild(frag);
}
link_abuse_popup.onclick=function(){bflag=1;body.className="";}

function clickclose(){bflag=1;body.className="";}
var vid=0;
function fake(){
var frag=document.createDocumentFragment();

let li=document.createElement('li');
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
let di=ul.lastChild.getAttribute('data-vid')
xhr_abuse_list();
//sigara=1;
//alert(vid);
}

}
}
function insert_part(){
var frag=document.createDocumentFragment();
let li=document.createElement('li');
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
</script>`;
module.exports={admin_main_menu};
/*
'2017-08-15 14:37:08.784881'
select*from abuse where status='neu' and at > '2017-08-15 14:37:08.784881';
*/
