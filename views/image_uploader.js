//image_uploader.js
const head=require('./head.js');
const dev_user=process.env.DEV_USER;
const dev_pwd=process.env.DEV_PWD;
const dev_email=process.env.DEV_EMAIL;
const header_menu=require('./header_menu');
const admin_main_menu=require('./admin_main_menu');
const footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;
var image_uploader= n =>{
let {buser,showmodule:{mainmenu,profiler}}=n;
return `<!DOCTYPE html><html lang="en">
<head>${head.head({title:"Image uploader",csslink:"/css/main2.css",/*csshelper:`${login_css.login_css({})}`*/})}</head>
<body>
${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap">
<style>
#multcontainer{
display:flex;
flx-flow: row wrap;
justify-content: space-around;
width:80%;
height:auto;
background:lightblue;
align-content:center;
align-items:center;
}
figure{
box-sizing:border-box;
width:270px;border:1px solid green;/*margin:auto;*/
/*flex-grow:10;*/
order:1;

margin:6px;
flex-shrink:2;
flex-basis:2;
}
span{font-size:0.8em;line-height:0.01em;}


.uricontent{font-size:0.8em;}
.div-pic{margin-left:0;width:auto;border:1px solid brown;box-sizing:border-box;display:block;}
 img{display:block;position:relative;margin:0 auto;}
 #output2{border:1px solid green;position:relative;min-height:160px;}
 #toservak{display:none;}
 #signal{background:blue;}
 #ulur{list-style:none;width:50%;position:relative;}
 .localdb{position:relative;}
 /*#datauri{
 position:relative;
 border:1px solid blue;
 background:red;
 width:100px;height:100px;
left:50%;
 overflow:hidden;
}

#datauri:after,#datauri:before{
position:absolute;
top:50%;right:10%;
margin-right:85px;
z-index:100;
width:0;height:0;
border-top:10px solid #000;
border-top:50px solid hsla(0,0%,20%,0.9);
border-right:50px solid transparent;
border-left:5px solid transparent;
content:"";
pointer-events:none;
font-size:0;
line-height:0;
}
*/
.arrow_box,#datauri {
display:block;
position:relative;
	background: #88b7d5;
	border: 4px solid #c2e1f5;
	width:100px;
	height:100px;
	left:0px;
	top:0px;
	
}
.arrow_box:after,#datauri:after, .arrow_box:before,#datauri:before {
	right: 100%;
	top: 50%;
	border: solid transparent;
	content: '';
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
}

.arrow_box:after,#datauri:after {
	border-color: rgba(136, 183, 213, 0);
	border-right-color: #88b7d5;
	border-width: 30px;
	margin-top: -30px;
}
.arrow_box:before,#datauri:before {
	border-color: rgba(194, 225, 245, 0);
	border-right-color: #c2e1f5;
	border-width: 36px;
	margin-top: -36px;
}
.redChecked{background:red;}
</style>
<!-- <div style="clear:both;">.</div> -->
<div class="daper">
<b>Files uploader via html 5 Canvas</b>

</br><button onclick="createAlbum()">create Album!</button>
</br><b>Multi: </b><span id="multi">4</span>
</br><b>Album info _id :</b><span id="albuminfo"></span>
</br><b>Album-out-info :</b><span id="albumoutinfo"/></span></br>
1536x2048 |1152 | 768 | 384
<label>Thumb Size:</label>
<input id='textsize' type='text' style='width:40px' value='384'/>px<hr/>
<label>To Folder:</label>
<input id='texFolder' type='text' style='width:40px' value='kuri'/>folder<hr/>
<label>koeff compression:</label>
<input id='texCompress' type='text' style='width:40px' value='0.1'/>0.0 - 1.0<hr/>

<hr>
<span id="who">${buser ? `${buser.id}`:''}</span>
</br><span id="signal"></span></br>
<label>Select File to create thumb:</label>
<input type='file' id='input' multiple onchange='thumb(this.files)' accept='image/png,image/jpeg' autofocus><hr/>
</br><button id="toservak" onclick="toServak()">to server</button></br>
<button onclick="clearFoto()">clear</button>
</br>
<div id="resultat"></div>
<span id="output"></span></br>
<div id="multcontainer"></div></hr>
<span id="nev" style="background:green;"></span>
</br>
<div id="output2">
<ul id="ulur"></ul>
 </div></br>
 <ul id="albumlist"></ul>
 <div id="albumlistout"></div>
</br> <button onclick="getAlbumList()">Album's list</button>

</div>
<script>
//if( Promise){alert('Promise native is ok')}else{alert('No promise native');}
//if(FileReader){alert('ok')}
function createAlbum(){
var data={};
data.userId=who.textContent;
data.title=texFolder.value;
data.multi=multi.textContent;
var xhr=new XMLHttpRequest();
    xhr.open('post','/create_album');
	xhr.setRequestHeader('Content-Type','application/json','utf-8');
	xhr.onload=function(e){
	 if(xhr.status==200){
	 //var data=JSON.parse(this.response);
	 albuminfo.textContent=JSON.parse(this.response).album._id;
	 albumoutinfo.innerHTML=this.response;
	 }
	 else{output.innerHTML=this.response+this.status;
	 }}
	 xhr.onerror=function(e){alert(this.response + e)}
alert(JSON.stringify(data));
xhr.send(JSON.stringify(data));

}
//var worker=new Worker('/js/worker.js');
//worker.addEventListener('message',receive);
//function receive(e){
//alert(e.data);
//}
//worker.postMessage('hallo');
//var arra=['Фото0201-k4','Фото0201-k3','Фото0201-k1','Фото0201-k2'];
//var ad=arra.sort();
//alert(ad);
var ab=[1536,1152,768,384];
var bext;
var k=4;
var ui=0;
function thumb(files){
/*
Object.keys(files).forEach(function(file,i){var file=files[i];
readfile(file).then(function(data){if(data){
nail({data:data.result,name:data.name});}
else{alert('etwas');}}).catch(function(err){alert(err);}); });*/
var suk=[]
Object.keys(files).forEach(function(file,i){suk.push(files[i])});
var dak=suk.map(readfile);
Promise.all(dak).then(function(res){
res.forEach(function(it){
//alert(it.result);
nail({data:it.result,name:it.name});
})}).catch(function(err){alert(err)});
}

var readfile=function(file){
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
var docfrag=document.createDocumentFragment();

function nail(e){
var cnv=document.createElement('canvas');
var img=new Image();
img.src=e.data;
var w=img.width, h=img.height;

img.onload=function(){
var compression=document.getElementById('texCompress').value;
//alert(Number(compression));
ab.forEach(function(el,i){
//var tsize=document.getElementById('textsize').value;
tsize=ab[i];
cnv.width=Number(tsize);
cnv.height=Number(tsize)*(h/w);
var c=cnv.getContext('2d');
c.drawImage(img,0,0,cnv.width,cnv.height);
var bi=e.name.lastIndexOf('.');
var basename=e.name.substr(0,bi);
bext=e.name.substr(bi);
var a=cnv.toDataURL('image/jpeg',0.1);
//var a=cnv.toBlob()
alert(a);
toDataUri(a,basename,tsize,ab[i],cnv);});}}
var si=0;
function toDataUri(uri,basename,tsize,perW,cnv){

var link=crel('a');
signal.innerHTML="";
var figura=crel('figure');
figura.setAttribute('data-fotoname',basename);
var caption=crel('caption');
var sutti=[perW,'x',cnv.height];
var inchk='<input type="checkbox" class="inchk" data-fotoname="'+basename+'" onchange="testinchk(this)"/>'
caption.innerHTML+='<span>'+sutti.join('')+'</span>'+inchk;
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
link.setAttribute("data-ext",bext);
//var tex=document.createTextNode(basename);
link.textContent=basename + '-k'+k;
//link.appendChild(tex);
div.appendChild(im);
figura.appendChild(caption);
figura.appendChild(div);
figCaption.appendChild(link)
figura.appendChild(figCaption);
docfrag.appendChild(figura);
//multcontainer.appendChild(figura);
multcontainer.appendChild(docfrag);
if(k==1){k=5;ui++;boo()}
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

/*
var buka=this.getAttribute('data-fotoname');
alert(this.className+' : '+this.getAttribute('data-fotoname'));
var rmvs=document.querySelectorAll('[data-fotoname="'+buka+'"]');
for(var m=0;m<rmvs.length;m++){rmvs[m].remove();}

*/
}
function toServak(){
var formi=new FormData();
var elcnv=document.getElementsByClassName('uricontent');
var xhr=new XMLHttpRequest();
    xhr.open("post","/multipics",true);
xhr.onload=function(e){if(xhr.status==200){resultat.innerHTML=this.response}else{alert(this.status)}}
xhr.onerror=function(e){alert(this.status+this.response+e.status)}
var vadik=[];
var len=elcnv.length;

//var uric=elcnv[i].getAttribute('href');
//var nickname=elcnv[i].getAttribute('download');
//var ext=elcnv[i].getAttribute('data-ext');

formi.append("who",document.getElementById('who').textContent);
formi.append("nochwas",document.getElementById('albuminfo').textContent);
for(var i=len-1;i >= 0;i--){
var uric=elcnv[i].getAttribute('href');
var nickname=elcnv[i].getAttribute('download');

formi.append('file',uriBlob(uric),nickname+'.jpg');
}
xhr.send(formi);
}
function toSak(){
var formi=new FormData();
//var elcnv=getDomArray('.uricontent');
var elcnv=document.getElementsByClassName('uricontent');
var xhr=new XMLHttpRequest();
    xhr.open("post","/multipics",true);
	//xhr.setRequestHeader('Content-Type','multipart/form-data');
	
    xhr.onload=function(e){if(xhr.status==200){
	var docs=JSON.parse(this.response);
	alert(this.response);
	var arra=[];
	var len=docs.picssammler.pics.length;
	for(var i=0;i< /***docs.picssammler.pics.length ***/len;i++){
	var li=document.createElement('li');
	//li.className="localdb";
	//var arra=[];
	//alert(arra);
	arra.push(docs.picssammler.pics[i].src);
	//var ed=arra.sort();
	//alert(ed);
	li.innerHTML=docs.picssammler.pics[i].src;//+' _in folder: '+docs.picssammler.fold;
	document.getElementById('resultat').appendChild(li);
	}
	output.innerHTML=this.response;
	 if(ulur.hasChildNodes()){
while(ulur.hasChildNodes()){
ulur.removeChild(ulur.firstChild);}}
	arra.forEach(function(el,k){
	var li=document.createElement('li');
	li.className="localdb";
	if(k % 4 === 0){
//fig.style.background="red";
li.setAttribute("data-identif","firstfucker");}
	li.setAttribute('data-fold',docs.picssammler.fold);
	//li.setAttribute('data-w')
	li.textContent=arra.sort()[k];
	ulur.appendChild(li);
	});
	//okserv();
	//toLocaldb();
	//alert(this.response);
	}else{alert(this.status);}};
	xhr.onerror=function(e){alert(e.status);}
	var vadik=[];
//formi.append("nochwas",document.getElementById('texFolder').value);
//elcnv.forEach(function(el){
function dfg(){
var len=elcnv.length;
for(var i=len-1;i >= 0;i--){
var uric=elcnv[i].getAttribute('href');
var nickname=elcnv[i].getAttribute('download');
var ext=elcnv[i].getAttribute('data-ext');
vadik.push({uric:uric,nickname:nickname});
	//formi.append('file',uriBlob(uric),nickname+ext);
}
setTimeout(sade,0);
}
dfg();
//);
function sade(){
formi.append("nochwas",document.getElementById('texFolder').value);
for(var k=0;k<vadik.length;k++){
formi.append('file',uriBlob(vadik[k].uric),vadik[k].nickname+'.jpg');
}
	xhr.send(formi);}
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

function okserv(){
var ls=getDomArray('.localdb');
ls.forEach(function(el){
el.onclick=function(e){
//alert('wow');
}
el.onmouseover=function(e){
//alert('touch')
//alert(el.style.position)
var x=e.clientX,y=e.clientY;

//datauri.style.position='relative';
//datauri.style.opacity="1.0";
//datauri.style.left=parseInt(x)-output2.getBoundingClientRect().left+'px';
//datauri.style.top=parseInt(y-250)-output2.getBoundingClientRect().top+'px';
datauri.style.height='100px';
somefetch(el.textContent);
e.preventDefault();
somefetch(el.textContent,x,y);
}
el.ontouchstart=function(e){
var x=e.clientX,y=e.clientY;
datauri.style.opacity="1.0";
//datauri.style.left=parseInt(x)-output2.getBoundingClientRect().left+'px';
//datauri.style.top=parseInt(y-250)-output2.getBoundingClientRect().top+'px';
//datauri.style.height='100px';
somefetch(el.textContent);
e.preventDefault();
somefetch(el.textContent,x,y);
}
el.onmouseout=function(){
//datauri.style.opacity="0.0";
}
});
}

//id texFolder;antw
function somefetch(img,x,y){
fetch(img/*** '/images/upload/kuri/Фото0201-k4.jpg' ***/).then(function(resp){
if(resp.ok){
resp.blob().then(function(mblob){
/*** if(datauri.hasChildNodes()){
while(datauri.hasChildNodes()){
datauri.removeChild(datauri.firstChild);
}} ***/
var oburl=URL.createObjectURL(mblob);
var sik=document.getElementById('mympic');
sik.src=oburl;

//datauri.style.top=
sik.onload=function(){URL.revokeObjectURL(this.src);}
});
}else{alert('network response was not ok');}
}).catch(function(err){alert('there has been a problem with your fetch operation :'+err.message);});
}
function clearFoto(){
 if(multcontainer.hasChildNodes()){
while(multcontainer.hasChildNodes()){
multcontainer.removeChild(multcontainer.firstChild);
}} 
}

function picstodb(){
var hobot=[];
var basak=false;
var step=0;
var foldi=getDomArray('.localdb')[0].getAttribute('data-fold');
var firstfucker=getDomArray('[data-identif="firstfucker"]');
//alert(foldi);
var lokali=getDomArray('.localdb');
var widths=ab.reverse();
var folds={};
folds.folder=foldi;
folds.w1=widths[0];
folds.w2=widths[1];
folds.w3=widths[2];
folds.w4=widths[3];
folds.multi=4;
folds.sentby=who.textContent;
folds.sentat=new Date();
folds.quelle="";
folds.pics=[];
lokali.forEach(function(el,k){
//alert(el.textContent);
hobot.push(el.textContent);
basak=true;
});
if(basak){
firstfucker.forEach(function(el,k){
var w=hobot.slice(step,step+=4);

folds.pics.push({src1:w[0],src2:w[1],src3:w[2],src4:w[3]})
//alert(w.length);
});
var xhr=new XMLHttpRequest();
    xhr.open('post','/multipicstodb');
	xhr.setRequestHeader('Content-Type','application/json','utf-8');
	xhr.onload=function(e){
	 if(xhr.status==200){
	 //var data=JSON.parse(this.response);
	 output.innerHTML=this.response;
	 }
	 else{output.innerHTML=this.response+this.status;
	 }}
alert(JSON.stringify(folds));
xhr.send(JSON.stringify(folds));
}
}
/***
var sabat=[];
function allesinordnung(){
var step=0;
hobot.forEach(function(el,k){
var w=hobot.slice(step,step+=3);
alert(w);
//alert(hobot)
});
***/
/***
var foldis=getDomArray('.localdb')
foldis.forEach(function(el,i){
//var fig=figs[i];
if(i % 4 === 0){
//fig.style.background="red";
el.setAttribute("data-identif","oldfucker");
} 
else{
sabat.push(el.textConent);
el.remove();
}
});
basak=true;
rabota();
//btnPicstar.style.display="inline-block";
//btnOrder.style.display="none";
}***/

function getAlbumList(){
var xhr=new XMLHttpRequest();
xhr.open('get','/getalbumlist');
var docfr=document.createDocumentFragment();
xhr.onload=function(e){
if(xhr.status == 200){
var data=JSON.parse(this.response);
albumlistout.innerHTML=this.response;
if(albumlist.hasChildNodes()){
while(albumlist.hasChildNodes()){
albumlist.removeChild(albumlist.firstChild);}}
for(var i=0;i<data.album.length;i++){
var li=document.createElement('li');
var title=data.album[i].title;
var albumFold=data.folders[i];
var str1='<button class='+(title !== "tmp" ? "z" : "zapret")+' onclick='+(title !== "tmp" ? "showFots2(this)" : null)+' value='+albumFold+'>'+title+'</button>';
	 if(title == 'tmp'){title='x';}
//'<button onclickdata.album[i].title;
//(user*aka user._id*,multi,createdat,_id,[fotkis])
li.innerHTML=str1;
docfr.appendChild(li);
}
albumlist.appendChild(docfr);
}else{alert(this.status)}
}
xhr.onerror=function(e){alert('fu')}
xhr.send();
}
function showFots2(el){

//alert('now show u some folders in this derictory '+el.value);
var data={};
data.foldername=el.value;
data.who=who.textContent;
var xhr=new XMLHttpRequest();
	xhr.open('post','/open_this_fold');
	xhr.setRequestHeader('Content-Type','application/json','utf-8');
	xhr.onload=function(e){
	 if(xhr.status==200){
	// btnPicstar.style.display="inline-block";
	 //btnOrder.style.display="inline-block";
	 var data=JSON.parse(this.response);
	 var fold=el.value;
	 var who=data.who;
	 var basedir=data.basedir;
	 alert(this.response);
	 //out.innerHTML=this.response;
	 /*
	 if(fotkis.hasChildNodes()){
while(fotkis.hasChildNodes()){
fotkis.removeChild(fotkis.firstChild);
}}*/
var len=data.fotkis.length;
var docfrag=document.createDocumentFragment();
	/* for(var i=0;i < len;i+=1){
	 
	 var pics=data.fotkis[i];
	//(foldername,fotkis,basedir,who)
	 var div=document.createElement('figure');
	 //var fold=el.value;
	 //var who=data.who;
	 div.className='pig';
	 div.setAttribute("data-src",'/images/upload/'+who+'/'+fold+'/'+pics+'');
	 //div.onclick=function(){alert(this.getAttribute("data-identif"))}
var str1='<caption>'+[i+1]+'<p class="capitan"></p></caption>';
var str2='<div class="img-cont"><img src="/images/upload/'+who+'/'+fold+'/'+pics+'"></div>';
var str3='<figcaption><span class="p-descr" contenteditable=true>Description</span></br>';
var str4='<span class="p-title" contenteditable=true>Title</span></br>';
var str5='<span class="srcset" contenteditable=true>basedir+who+'/'+fold+'/'+pics+'</span></br></figcaption>';
	 //div.innerHTML='<caption>'+[i+1]+'<p class="capitan"></p></caption>'+
	 //'<div class="img-cont"><img src="/images/upload/'+who+'/'+fold+'/'+pics+'"></div>'+
	  // '<figcaption>'+
	 //'<span class="p-descr" contenteditable=true>Description</span></br>'+
	 //'<span class="p-title" contenteditable=true>Title</span></br>'+
	// '<span class="srcset" contenteditable=true>/images/upload/'+who+'/'+fold+'/'+pics+'</span></br>'+
	 //'</figcaption>';
	 div.innerHTML=[str1,str2,str3,str4,str5].join('');
	 docfrag.appendChild(div);
	 }
	 fotkis.appendChild(docfrag);*/
	 
	 //doit();
}else{alert(this.status)}
	 }
	 xhr.send(JSON.stringify(data));
	 }
	 
function testinchk(el){
//alert('el.');
var buka=el.getAttribute('data-fotoname');
var rmvs=getDomArray('[data-fotoname="'+buka+'"]');
rmvs.forEach(function(l){
//rmvs[m].remove();
l.className="redChecked";
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
module.exports={image_uploader}