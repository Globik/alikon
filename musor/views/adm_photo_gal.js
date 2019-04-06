const sp='adm_photo_gal.js';
const head=require('./head.js');
const dev_user=process.env.DEV_USER;
const dev_pwd=process.env.DEV_PWD;
const dev_email=process.env.DEV_EMAIL;
const header_menu=require('./header_menu');
const admin_main_menu=require('./admin_main_menu');
const article_editor=require('./article_editor.js');
const footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;

const adm_photo_gal=n=>{
let {post, showmodule:{mainmenu,profiler}}=n;
const buser=n.user;
return`<!DOCTYPE html><html lang="en">
<head>${head.head({title:"Add photos", cssl:["/css/main2.css","/css/popup.css","/css/loader.css"]})}</head>
<body>
<!-- adm_photo_gal -->
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<style>
ul{list-style:none;}
.redChecked{background:red;}
.orangeUnchecked{background:orange;}
#article_fotkis{
background: lightblue;
display:flex;
flex-wrap:wrap;
}
#fotkis{
ackground:lightgreen;
display:flex;
flex-wrap:wrap;
}

.pig,.img_post{
display:inline-block;
width:auto;height:auto;
position:relative;margin:0;
}


</style>
<main id="pagewrap">
<h4>Add photo gallery</h4>
<h5>Metainfo</h5>
<b>user_email: </b><span id="user_email">${buser ? buser.email : ''}</span><br>
<b>article_id: </b><span id="article_id">${post ? post.id :''}</span><br>
<b>article title: </b><span id="article_title">${post.title}</span><br>
<b>album id: </b><span id="alb_id"></span><br>
<b>album title: </b><span id="alb_title"></span><br>
<hr>
<!-- <button onclick="get_albums();">get album list</button><br> -->

<section class="panel">
<a href="#popup-img-to-article" title="album lists" onclick="get_albums();">+</a> |
<a onclick="redaktorHref(this)"  data-id="${post.id}" href="#popredaktor">redact article</a>
</section>
<span id="out"></span>
<!-- <ul id="alb_el"></ul> -->

<!-- <button id="rmv_unch" style="display:none;" onclick="remove_unchecked()">remove_unchecked</button> -->
<hr>
<button onclick="pics_to_article(this);">add pics to the article</button>
<div id="fountainG">
	<div id="fountainG_1" class="fountainG"></div>
	<div id="fountainG_2" class="fountainG"></div>
	<div id="fountainG_3" class="fountainG"></div>
	<div id="fountainG_4" class="fountainG"></div>
	<div id="fountainG_5" class="fountainG"></div>
	<div id="fountainG_6" class="fountainG"></div>
	<div id="fountainG_7" class="fountainG"></div>
	<div id="fountainG_8" class="fountainG"></div>
</div>

<div id="article_fotkis">${post && post.images && post.images.length ? list_post_imgs(post.images) : "No images yet. Add photos from album."}</div>

<!-- <button id="to_art_imgs" onclick="add_to_art_imgs();">add pics to post sector</button> -->
<!-- <div id="fotkis"></div> -->

<button onclick="pics_to_article(this);">add pics to the article</button><span> ku ku</span>

<a href="#" class="overlay" id="popup-img-to-article"></a>
<section class="popup">
<a class="close" href="#" style="top:8px;right:8px;"></a>
<button id="to_art_imgs" style="display:none;" onclick="add_to_art_imgs();">add pics to post sector</button>
<ul id="alb_el"></ul>
<div id="fotkis"></div>

</section>
${article_editor.article_editor({buser})}

<a href="#" class="overlay" id="resultativ"></a>
<section class="popup">
<a class="close" style="top:8px;right:8px;" href="#"></a>
<h4>Result:</h4>
<output id="output"></output>
</section>
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

//alert(this.response);
if(alb_el.hasChildNodes()){
while(alb_el.hasChildNodes()){
alb_el.removeChild(alb_el.firstChild);}}
 for(var i=0;i<mata.albums.length;i++){
	 
var li=document.createElement('li');
var doc=mata.albums[i];
li.innerHTML='<button onclick="showFots(this)" data-albid="'+doc.id+'" data-albtitle="'+doc.alb_title+'">'+doc.alb_title+'</button>';
docfr.appendChild(li);}
alb_el.appendChild(docfr);
}else{alert(this.response);}
}
xhr.onerror=function(e){alert(e);}
xhr.send(JSON.stringify(data));
}
function showFots(el){
alb_id.textContent=el.getAttribute("data-albid");
alb_title.textContent=el.getAttribute("data-albtitle");
var data={};
data.alb_id=el.getAttribute("data-albid");
var xhr=new XMLHttpRequest();

xhr.open('post','/dashboard/albums_list/images');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
//alert(this.response);

var mata=JSON.parse(this.response);
var docfr=document.createDocumentFragment();
if(fotkis.hasChildNodes()){
while(fotkis.hasChildNodes()){
fotkis.removeChild(fotkis.firstChild);
}}
if(mata.images !==null){
mata.images.forEach(function(el,i){
//var pics=data.fotkis[i];
	//(foldername,fotkis,basedir,who)
	 var div=document.createElement('figure');
	 var basedir="/uploads";
	 div.className='pig schweine';
	 div.setAttribute('data-picname', el.id);
	
var str1='<caption>'+[i+1]+'<p class="capitan"></p><input type="checkbox" data-picname='+el.id+' data-me="me" onchange="ckeckboxVal(this)"></caption>';
var str2='<div class="img-cont"><img src="'+basedir+'/'+el.src1+'"></div>';
var str3='<figcaption data-picnami="'+el.id+'" data-src1="'+el.src1+'" data-src2="'+el.src2+'" data-src3="'+el.src3+'" data-src4="'+el.src4+'">';
var str6='<textarea style="width:98%;" class="p-descr" placeholder="description">'+(el.dsc==null ? '': el.dsc)+'</textarea></br>';

var str4='<span class="p-title" contenteditable=true>Title</span><br>';
var palt='<textarea class="p-alt" placeholder="alt" style="width:98%;"></textarea><br>';
var pquelle='<span class="p-quelle" contenteditable=true>quelle</span>';
var str5='</figcaption>';
div.innerHTML=[str1,str2,str3,str6,str4,palt,pquelle,str5].join('');
docfr.appendChild(div);
})

}
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
if (dragSrcEl_ != this && dragSrcEl_ !=null) {
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
function ckeckboxVal2(el){
el.parentNode.remove();
}
doit();
function ckeckboxVal(el){
//alert(el.checked);
to_art_imgs.style.display="block";
var buka=el.getAttribute('data-picname');

var rmvs=getDomArray('#fotkis [data-picname="'+buka+'"]');
rmvs.forEach(function(l,i){
  if(el.checked){
el.parentNode.className="redChecked";
go_orange();
}
else{
l.className="orangeUnchecked";
//rmv_unch.style.display="block";
}
});
}

function go_orange(){
var ori=getDomArray('.pig.schweine');
ori.forEach(function(el,i){
el.className="orangeUnchecked";
});
//rmv_unch.style.display="block";
}


function remove_unchecked(){
//alert('ok')
var rmvs=getDomArray('.orangeUnchecked');
rmvs.forEach(function(el,i){
rmvs[i].remove();
});
//rmv_unch.style.display="none";
}



function add_to_art_imgs(){
var ed=getDomArray('.redChecked');
remove_unchecked();
ed.forEach(function(el,i){
article_fotkis.appendChild(ed[i].cloneNode(true));
})
window.location.href="#";
boit();
}

function boit(){
var bed=getDomArray('.redChecked');
bed.forEach(function(el,i){
bed[i].className="pig";
})
doit();

if(fotkis.hasChildNodes()){
while(fotkis.hasChildNodes()){
fotkis.removeChild(fotkis.firstChild);
}}
}

function pics_to_article(){
var kasak=true;
if(fotkis.hasChildNodes()){
while(fotkis.hasChildNodes()){
fotkis.removeChild(fotkis.firstChild);
}}
var pTitle=getDomArray('.p-title');

var pSrc1=getDomArray('[data-src1]');


var pDescr=getDomArray('.p-descr');
var pAlt=getDomArray('.p-alt');
var pQuelle=getDomArray('.p-quelle');

//if(kasak == true){}

	var data={};
	data.images=[];
	data.article_id=article_id.textContent;
	if(article_id.textContent !==undefined){
	
	pTitle.forEach(function(el,k){
if(kasak==true){

	data.images.push({
    title:pTitle[k].innerHTML,
    content: pDescr[k].value,
    alt: pAlt[k].value,
    quelle:pQuelle[k].textContent,
    id:pSrc1[k].dataset.picnami,
    src1: pSrc1[k].dataset.src1,
	src2: pSrc1[k].dataset.src2,
    src3: pSrc1[k].dataset.src3,  
    src4: pSrc1[k].dataset.src4});
}else{
	data.images.push({title:pTitle[k].innerHTML,content:pDescr[k].innerHTML,src:pSrc[k].textContent});
	}
	//alert(imgText[k].value);
	});
	//alert(JSON.stringify(data));
	
	var xhr=new XMLHttpRequest();
	xhr.open('post','/dashboard/pics_to_post');
	xhr.setRequestHeader('Content-Type','application/json','utf-8');
	xhr.onload=function(e){
	if(xhr.status==200){
fountainG.style.display="none";
var d=JSON.parse(this.response);
out.innerHTML=this.response;

window.location.href="#resultativ";
output.innerHTML='<span>Photos saved. Go to <a href="/articles/'+d.result.art_id+'/'+d.result.slug+'" target="_blank">article</a>';

 }
	 else{
fountainG.style.display="none";
out.innerHTML=this.response;
	 }}
xhr.onerror=function(e){alert(e);fountainG.style.display="none";};
	
fountainG.style.display="block";
//setTimeout(function(){
     xhr.send(JSON.stringify(data));
//},5000)
	
	 } 
	 else{alert('datid not fullfilled');}
	 }
	 



function getDomArray(selector){
var elcol=document.querySelectorAll(selector);
var elar=Array.prototype.slice.apply(elcol);
return elar;
}
</script>
</main><footer id="footer">${footer.footer({})}</footer>
</body>
</html>`;
}
module.exports={adm_photo_gal};

function list_post_imgs(n){
let s='';
//console.log('n: ',n);
n.forEach((el,i)=>{
s+=`<figure class="pig">
<caption>${[i+1]}<p class="capitan"></p><input type="checkbox" data-picname="${el.id}" onchange="ckeckboxVal2(this)"/></caption>
<div class="img-cont"><img src="/uploads/${el.src1}"></div>
<figcaption data-picnami="${el.id}" data-src1="${el.src1}" data-src2="${el.src2}" data-src3="${el.src3}" data-src4="${el.src4}">
<textarea class="p-descr" style="width:98%;" placeholder="description">${el.content}</textarea><br>
<span class="p-title" contenteditable=true>${el.title}</span><br>
<textarea class="p-alt" placeholder="alt" style="width:98%;">${el.alt}</textarea><br>
<span class="p-quelle" contenteditable=true>${el.quelle}</span>
</figcaption>
</figure>`;
})
return s;
}