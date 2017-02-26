//adm_photo_gallery.js
const head=require('./head.js');
const dev_user=process.env.DEV_USER;
const dev_pwd=process.env.DEV_PWD;
const dev_email=process.env.DEV_EMAIL;
const header_menu=require('./header_menu');
const admin_main_menu=require('./admin_main_menu');
const footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;

var adm_photo_gal=n=>{
let {buser,post, showmodule:{mainmenu,profiler}}=n;
return`<!DOCTYPE html><html lang="en">
<head>${head.head({title:"Add photos", cssl:["/css/main2.css","/css/popup.css"]})}</head>
<body>
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}

<main id="pagewrap">
<h4>Add photo gallery</h4>
<h5>Metainfo</h5>
<b>user_email: </b><span id="user_email">${buser ? buser.email : ''}</span><br>
<b>article_id: </b><span id="article_id">${post ? post.id :''}</span><br>
<b>album id: </b><span id="alb_id"></span><br>
<b>album title: </b><span id="alb_title"></span><br>
<hr>
<button onclick="get_albums();">get album list</button><br>
<span id="out"></span>
<ul id="alb_el"></ul>
<hr>
<div id="fotkis"></div>
<hr>
<script>
function get_albums(){
var data={};
data.user_email=user_email.textContent;
var xhr=new XMLHttpRequest();
xhr.open('post','/dashboard/albums_list');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
var docfr=document.createDocumentFragment();
var mata=JSON.parse(this.response);
alert(this.response);
if(alb_el.hasChildNodes()){
while(alb_el.hasChildNodes()){
alb_el.removeChild(alb_el.firstChild);}}
 for(var i=0;i<mata.albums.length;i++){
	 
var li=document.createElement('li');
var doc=mata.albums[i];
li.innerHTML='<button onclick="showFots(this)" data-albid="'+doc.id+'">'+doc.alb_title+'</button>';
docfr.appendChild(li);}
alb_el.appendChild(docfr);
}else{alert(this.response);}
}
xhr.onerror=function(e){alert(e);}
xhr.send(JSON.stringify(data));
}
function showFots(el){
var data={};
data.alb_id=el.getAttribute("data-albid");
var xhr=new XMLHttpRequest();

xhr.open('post','/dashboard/albums_list/images');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
alert(this.response);
var mata=JSON.parse(this.response);
var docfr=document.createDocumentFragment();
if(fotkis.hasChildNodes()){
while(fotkis.hasChildNodes()){
fotkis.removeChild(fotkis.firstChild);
}}
mata.images.forEach(function(el,i){
//var pics=data.fotkis[i];
	//(foldername,fotkis,basedir,who)
	 var div=document.createElement('figure');
	 var basedir="/uploads";
	 div.className='pig';
	 div.setAttribute('data-picname', el);
	 div.setAttribute("data-src", el.src1);
	 //div.onclick=function(){alert(this.getAttribute("data-identif"))}
var str1='<caption>'+[i+1]+'<p class="capitan"></p><input type="checkbox" data-picname='+el+' onchange="ckeckboxVal(this)"></caption>';
var str2='<div class="img-cont"><img src="'+basedir+'/'+el.src1+'"></div>';
var str3='<figcaption><span class="p-descr" contenteditable=true>Description</span></br>';
var str4='<span class="p-title" contenteditable=true>Title</span></br>';
var str5='<span class="srcset" contenteditable=true>'+basedir+'/'+el.src1+'</span></details></br></figcaption>';
	 div.innerHTML=[str1,str2,str3,str4,str5].join('');
	 docfr.appendChild(div);
})
fotkis.appendChild(docfr);
doit();
}else{alert(this.response);}
}
xhr.onerror=function(e){alert(e);}
//alert(JSON.stringify(data));
xhr.send(JSON.stringify(data))
}

function doit(){
var cols_=document.querySelectorAll('.pig');
var dragSrcEl_ = null;
handleDragStart = function(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
	dragSrcEl_ = this;
};
handleDragOver = function(e) {
    if (e.preventDefault) {
      e.preventDefault(); 
    }
e.dataTransfer.dropEffect = 'move';
return false;
  };
handleDrop = function(e) {

    if (e.stopPropagation) {
      e.stopPropagation();
    }
    if (dragSrcEl_ != this) {
      dragSrcEl_.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData('text/html');
    }
return false;
  };
  handleDragEnd = function(e) {
    [].forEach.call(cols_, function (col) {
    });
	out.innerHTML='dragEnd';
  };

 [].forEach.call(cols_, function (col) {
    col.setAttribute('draggable', 'true');  // Enable columns to be draggable.
    col.addEventListener('dragstart', handleDragStart, false);
    //col.addEventListener('dragenter', this.handleDragEnter, false);
    col.addEventListener('dragover', handleDragOver, false);
    //col.addEventListener('dragleave', this.handleDragLeave, false);
    col.addEventListener('drop', handleDrop, false);
    col.addEventListener('dragend', handleDragEnd, false);
  });
}
</script>
</main><footer id="footer">${footer.footer({})}</footer>
</body>
</html>`;
}
module.exports={adm_photo_gal};