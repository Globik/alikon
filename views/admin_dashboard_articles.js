//admin_dashboard_articles.js
'use strict';

var admin_main_menu=require('./admin_main_menu.js');

let admin_dashboard_articles=n=>{return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Articles Manager</title>
</head><body>
${(n.buser ? `${admin_main_menu.admin_main_menu({})}`:``)}
<br><h3>Welcome to the Articles Manager</h3>
<div class="articles-count">
<% if(l.posts){%><b>Total articles : </b><%= l.posts.length %><%}%>
<h3>Articles Manager</h3>
<% if(l.posts){l.posts.forEach(function(p){%>
<span data-id="<%= p._id %>" onclick="insertDataIda(this);" ><%= p.postname %></span>
<%})}%></div>
<div>
<p><h4>Article</h4></p>
<form name="article_create" method="post" enctype="multipart/form-data">
<label><b>title:</b></label><br>
<input type="text" name="title" required placeholder="title" value="How to install some thing" style="width:400px;"></br>
<label><b>slogan:</b></label><br>
<input type="text" name="slogan" required placeholder="slogan" value="slogan" style="width:400px;"><br>
<label><b>sub_title:</b></label><br>
<input style="width:400px;" type="text" name="sub_title" required placeholder="sub_title" value="Get that thing for two minutes"><br>
<label><b>author:</b></label><br>
<input type="text" name="author" required placeholder="author" value="${n.buser.username}"><br>
<label><b>leader:</b></label><br>
<textarea name="leader" required placeholder="leader" value="" style="width:400px;height:60px;">Lead Absatz how to bla bla bla</textarea><br>
<label><b>Main content(body):</b></label><br>
<textarea name="body" style="width:400px;height:200px;" required placeholder="body" 
>Main content here. Bla bla bla.<b>body1</b> &lt;b&gt;body-2&lt;/b&gt;</textarea><br>
<label><b>tags:</b></label><br>
<input type="text" name="tags" value="js,css"><br>
<label><b>category:</b></label><br>
<input type="text" name="category" value="webdesign" required placeholder="category"><br>
<label><b>rubrik:</b></label><br>
<input type="text" name="rubrik" value="css3" required placeholder="rubrik"></br>
<label><b>part:</b></label><br>
<input type="text" name="part" value="1" placeholder="part"></br>
<label><b>description</b></label><br>
<textarea style="width:400px;height:200px;" name="description">Some short description of an article for social networks.</textarea><br>
<input type="text" name="type" value="article"/><br>
<input type="text" name="status" value="active"/><br>
<input type="submit" value="save"><br>
</form><output id="out"></output></div>${getjs()}
</body></html>`;
}

module.exports={admin_dashboard_articles};
function getjs(){
return `<script>
var formface=document.forms.namedItem("article_create");
formface.addEventListener('submit',function(ev){
var data=new FormData(document.forms.namedItem("article_create"));
var xhr=new XMLHttpRequest();
    xhr.open("post","/dashboard/article_create",true);
	xhr.onload=function(e){
	 if(xhr.status==200){
	 //var data=JSON.parse(this.response);
	 out.innerHTML=this.response;
	 }
	 else{out.innerHTML=this.response;
	 }}
xhr.onerror=function(e){out.textConent="Some error occured";}
	 xhr.send(data);
	 ev.preventDefault();},false);</script>`;
}