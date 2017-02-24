const head=require('./head.js');
const dev_user=process.env.DEV_USER;
const dev_pwd=process.env.DEV_PWD;
const dev_email=process.env.DEV_EMAIL;
const header_menu=require('./header_menu');
const admin_main_menu=require('./admin_main_menu');
const footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;

var album_view=n=>{
let {buser, photos, showmodule:{mainmenu,profiler}}=n;
return`<!DOCTYPE html><html lang="en">
<head>${head.head({title:"Image uploader",csslink:"/css/main2.css",csslink2:"/css/popup.css"/*csshelper:`${login_css.login_css({})}`*/})}</head>
<body>
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap">
<section class="panel"><a href="#popup-img-upload" title="download photos">+</a></section>

<b>User id: </b><span id="user_id">${buser ? buser.id :  ''}</span><br>
<b>User email: </b><span id="user_email">${buser ? buser.email : ''}</span>
<hr>
<br><b>Multi: </b><span id="multi">4</span>
<br><b>Album id :</b><span id="album_id">${n.alb_id ? n.alb_id : ''}</span>
<br><b>Album name :</b><span id="album_name">${photos ? photos[0].alb_title : ''}</span>
<br><b>alb_ids: </b><span id="alb_ids">${n.alb_id ? n.alb_id : ''}</span>
<hr>
${photos !==null ? `${list_photos(photos)}`:'<b>no photos</b>'}

<a href="#" class="overlay" id="popup-img-upload"></a>
<div class="popup">
<a href="" class="close"></a>
<h3>Multi image uploader</h3>

<label title="Hard coded">Photo sizes: </label>1536 |1152 | 768 | 384<br><br>

<label>Compression:</label>
<input id='texCompress' type='number'  value='0.5' min="0.0" max="1" step="0.1"/>
<hr><br>
<label>Select File to create thumb:</label>
<input type='file' id='input' multiple onchange='thumb(this.files)' accept='image/png,image/jpeg' autofocus required>
&nbsp;<button id="toservak" onclick="toServak()">upload</button>&nbsp;
<button onclick="clearFoto()">clear</button>

<section id="multcontainer" style=""></section>
<br>
<div id="resultat"></div>
<ul id="ulur"></ul>
 </div>

<script>
//if( Promise){alert('Promise native is ok')}else{alert('No promise native');}
//if(FileReader){alert('ok')}
var ab=[1536,1152,768,384];
var bext;
var k=4;
var ui=0;
var si=0;
function thumb(files){
var suk=[]
Object.keys(files).forEach(function(file,i){suk.push(files[i])});
var dak=suk.map(readfile);
Promise.all(dak).then(function(res){
res.forEach(function(it){
//alert(it.result);
nail({data:it.result,name:it.name});
})}).catch(function(err){alert(err)});
}
	
function readfile(file){
return new Promise(function(resolv,rej){
var reader=new FileReader();
reader.onload=function(e){resolv({result:e.target.result,name:file.name});
console.log('filename :'+file.name)};
reader.onerror=function(e){rej(e.target.error.code);
console.log(new Error(e.target.error.code).stack);
};
reader.readAsDataURL(file);
});
}
	
function nail(e){
var cnv=crel('canvas');
var img=new Image();
img.src=e.data;
var w=img.width, h=img.height;

img.onload=function(){
var compression=document.getElementById('texCompress').value;

ab.forEach(function(el,i){
tsize=ab[i];
cnv.width=Number(tsize);
cnv.height=Number(tsize)*(h/w);
var c=cnv.getContext('2d');
c.drawImage(img,0,0,cnv.width,cnv.height);
var bi=e.name.lastIndexOf('.');
var basename=e.name.substr(0,bi);
bext=e.name.substr(bi);
	//alert(Number(compression));
var a=cnv.toDataURL('image/jpeg',Number(compression));
//alert(a);
if(navigator.userAgent.indexOf("Firefox") !=-1){ console.log(a);}

toDataUri(a, basename, tsize, ab[i],cnv);});

}
}


function toDataUri(uri,basename,tsize,perW,cnv){
var docfrag=document.createDocumentFragment();
var link=crel('a');
//signal.innerHTML="";
var figura=crel('figure');
figura.setAttribute('data-fotoname',basename);
figura.className="fluiditems";
var caption=crel('caption');
var sutti=[perW,'x',cnv.height];
var delComp='<div class="del-comp" style="" data-fotoname="'+basename+'" onclick="removeComponent(this)" title="remove">X</div>';
caption.innerHTML+='<div class="capt-size" style="">'+sutti.join('')+'</div>'+delComp;
var div=crel('div');
div.className="div-pic";
var im=crel('img');
var figCaption=crel('figcaption');
im.src=uri;
im.className="fotobag";
im.width=tsize/6;
link.className="uricontent";
link.href=uri;
link.download=basename+'-k'+k;
link.title="Download";
link.setAttribute("data-ext",bext);

link.textContent=basename + '-k'+k;
div.appendChild(im);
figura.appendChild(caption);
figura.appendChild(div);
figCaption.appendChild(link)
figura.appendChild(figCaption);
docfrag.appendChild(figura);
multcontainer.appendChild(docfrag);
if(k==1){k=5;
		 //ui++;
		 boo()}
k-=1;
si++;
}
function boo(){
toservak.style.display="inline";
var docs=getDomArray('.fotobag');
docs.forEach(function(el){
el.addEventListener('click',sagsize,false);});
}
	
function sagsize(el){
var st=el.target;
alert('this.naturalWidth'+' : '+st.naturalWidth);
}
	
function toServak(){
var formi=new FormData();
var elcnv=document.getElementsByClassName('uricontent');
	//alert(elcnv);
var xhr=new XMLHttpRequest();
xhr.open("post","/multipics",true);
xhr.onload=function(e){if(xhr.status==200){resultat.innerHTML=this.response}else{alert(this.response)}}
xhr.onerror=function(e){alert(this.status+this.response+e.status)}
var vadik=[];
var len=elcnv.length;
//alert('len: '+len);
//alert(user_id.textContent);
formi.append("user_id",user_id.textContent);
//alert(alb_ids.textContent);
formi.append('useremail', user_email.textContent);
formi.append("album_id",document.getElementById('album_id').textContent);
formi.append("album_title",[album_name.textContent]);
formi.append("album_ids",[alb_ids.textContent]);
for(var i=len-1;i >= 0;i--){
var uric=elcnv[i].getAttribute('href');
	//alert(uric);
var nickname=elcnv[i].getAttribute('download');
formi.append('file',uriBlob(uric),nickname+'.jpg');
}
//if(len !==0){
//alert('formi '+formi);
xhr.send(formi);
//}
}
	
function uriBlob(uri){
var bytestring;
if(uri.split(',')[0].indexOf('base64') >= 0)
bytestring=atob(uri.split(',')[1]);
else
bytestring=unescape(uri.split(',')[1]);
var mimestring=uri.split(',')[0].split(':')[1].split(';')[0];
var ia=new Uint8Array(bytestring.length);
for(var i=0;i<bytestring.length;i++){
ia[i]=bytestring.charCodeAt(i);
}
return new Blob([ia],{type:mimestring});
}
	
function clearFoto(){
 if(multcontainer.hasChildNodes()){
while(multcontainer.hasChildNodes()){
multcontainer.removeChild(multcontainer.firstChild);
}} 
}

function removeComponent(el){
//alert('el.');
var buka=el.getAttribute('data-fotoname');
var rmvs=getDomArray('[data-fotoname="'+buka+'"]');
	//alert(rmvs);
rmvs.forEach(function(el,l){
rmvs[l].remove();
//l.className="redChecked";
});
}	
	
function getDomArray(selector){
var elcol=document.querySelectorAll(selector);
var elar=Array.prototype.slice.apply(elcol);
return elar;
}
function crel(s){return document.createElement(s);}
</script>
</main><footer id="footer">${footer.footer({})}</footer></body></html>`;
}
module.exports={album_view}

function list_photos(n){
let s='<ul>';
n.forEach((el,i)=>{
s+=`<li>${el.title}<li><img src="/uploads/${el.src1}">`
})
s+='</ul>';
return s;
}