//article_view.js
'use strict';

var head=require('./head.js');   
var header_menu=require('./header_menu.js');
var admin_main_menu=require('./admin_main_menu.js');
//var articles_block=require('./articles_block.js');
//var paginator=rel('./paginator.js');
var footer=require('./footer.js');
const moment=require('moment');
var linki="/css/main2.css";

let article_view= n=>{
let {buser,showmodule:{mainmenu,profiler}}=n;
let str='';
str+= `<!DOCTYPE html>
<html lang="en">
<!-- article_view.js -->
<head>${head.head({title:"Blog",csslink:linki})}</head>
<body>
<!-- warnig must be -->
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(buser ? `${admin_main_menu.admin_main_menu({})}`:``)}
<!-- banner -->
<div class="codops-header" style="z-index:0;">${getHeadLine(n)}
<div class="codrops-demos">
<a class="current-demo" href="">fb</a><a href="">vk</a><a href="">g+</a>
</div>	  
</div>
<main id="pagewrap" style="padding:0;">
<div id="content">
${getArticleBody(n)}
</div>
<aside id="sidebar">
<section class="widget">
<h4 class="widgettitle">attariku</h4>
<img src='/images/emblema-a.svg' width="100%" height="100%"/>
</section>
</aside>
<div style="clear:both;"></div>
</main><footer id="footer">${footer.footer({})}</footer></body></html>`;
return str;}
module.exports={article_view};
 
function getHeadLine(n){
let {title="Postname", sub_title="shorti"}=n.post || {};  
return `${title} <span>${sub_title}</span>`;
}
function getArticleBody(n){  
let {author="Bob",title="Postname",sub_title="sub_title",created_on="10.3.1999",
leader="lead absatz",body="maincontent",last_modified="22,2,2005",tags=[""], 
category="category",id,rubrik="rubrik",status="1",part="1",gesamt_seen,date_url,fucker=''}=n.post || {};
//var as=new Date(parseInt(_id.toString().substring(0,8),16)*1000);
//var gab=moment(as).format('YYYY-MM-DD');  
return `<article class="post">     
<h1 class="post-title" data-id=${id} data-mattr="title" ${n.buser ? 'contenteditable="true"' :''}>${title}</h1>
<p><small>${moment(last_modified).format('MMMM D, YYYY')}  by ${author}</small></p>
<p><i>${leader}</i></p>
<div data-mattr="body" data-id=${id} ${n.buser ? 'contenteditable="true"':''}>${body}</div>
${n.post && n.post.images.length ? sumatorFoto(n):''} 
<section>
<li>Last time edited: ${moment(last_modified).format('MMM D, YYYY')}</li>
<li>Tags: ${tags}</li>
<li>Category : ${category}</li>
<li>Rubrik: ${rubrik}</li>
<li>Visibility: ${status}</li>   
<li>Serial: ${part}</li>  
<li>gesamt_seen: ${gesamt_seen}</li>
<li>date_url: <span id="dateurl">${moment(date_url).format('YYYY-MM-DD')}</span></li>
<li>fucker : ${fucker}</li>
<li>${created_on}</li>
${fucker?"<b>yes</b>":"<b>no</b>"} 
${n.buser ? '<button onclick="go_edit()">save</button>':''}
</section>
</article>
<script>${getImgErr()}</script>
${n.buser ? `<script>${redact_editable()}</script>` : ''}`;
}
function sumatorFoto(n){let s='';
for(var {src,src1,src2,src3,title,content} of n.post.images){
if( n.post.images[0].src1){
s+=`<p>${title}</p> 
<figure style="background:rgba(0,0,244,0.1);width:100%;margin-left:0;">
<picture>
<source media="(min-width: 1366px)" srcset="${src3}">
<source media="(min-width: 808px)" srcset="${src2}">
<source media="(min-width: 600px)" srcset="${src1}">
<source media="(max-width: 320px)" srcset="${src}">
<img src="${src1}" title="${title}" alt="${title}" sizes="100vw" srcset="${src} 384w,${src1} 768w,${src2} 1152w,${src3} 1536w"/>
</picture>
<figcaption><p>${content}</p></figcaption></figure>`;
}else{
if(src){s+=`<p>${title}<img src="${src}" title="${title}" data-art-id="${n.post._id}" onerror="digku(this)"/></p>`;}
}
}
return s; 
}
function getImgErr(){
	let s='';
	s+=`var count=0;function digku(el){console.log('error',el.src,window.location.href);
	console.log(el.getAttribute('data-art-id'))
	var data={};
	data._id=el.getAttribute('data-art-id');
	data.loc_href=window.location.href;
	data.fail_src=el.src;
	var xhr=new XMLHttpRequest();
	xhr.open('post','/photo_failure');
	 xhr.setRequestHeader('Content-Type','application/json','utf-8');
	xhr.onload=function(e){
	if(xhr.status==200){alert(this.response);console.log(this.response);count++;}else{console.log(this.response)}}
    xhr.send(JSON.stringify(data));
	}`;
	return s;}
function redact_editable(){
let s='';
s+=`
var editis=document.querySelectorAll('[contenteditable="true"]');
var mata={};
function go_edit(){
for(var i=0;i<editis.length;i++){
//alert(editis[i].innerHTML);
//alert(editis[i].getAttribute('data-mattr'));
mata[editis[i].getAttribute('data-mattr')]=editis[i].innerHTML;
}
mata.id=editis[0].getAttribute('data-id');
var matajs=JSON.stringify(mata);
var xhr=new XMLHttpRequest();
xhr.open('post','/save_editable_article');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(){
if(xhr.status==200){alert(this.response);
var ab=JSON.parse(this.response);
window.location.href="/articles/"+dateurl.textContent+"/"+ab.moody;
}else{alert(this.response);}
}
xhr.onerror=function(e){console.log(e);}
xhr.send(matajs);
}
`;
return s;}