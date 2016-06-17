var article_editor= n =>{
let s="";
var {buser}=n;
s+=`<!-- article_editor.js -->
${getEditorStyle({})}
<a href="#x" class="overlay" id="popredaktor"></a>
<div class="popup" id="poredactor">
<b>editor</b></br><span id="outinfo" style="background:green;"></span></br>
<!-- {_id,title,slogan,sub_title,author,leader,body,tags,category,rubrik,part,description,type,status,
slug,created_on,last_modified,date_url,foto_cover}; to do{checked{by,when},pic} -->
<form name="post" method="post" enctype="multipart/form-data">
${(buser ? `<input type="submit" value="save"></br>` : ``)}
<span><b>title: </b></span></br>
<input type="text" name="title" required placeholder="title" value="" style="width:400px;"></br>

<span><b>sub_title: </b></span></br>
<input type="text" name="sub_title" required placeholder="sub_title" value="" style="width:400px;" style="width:400px;"></br>

<b>slogan: </b></br>
<input type="text" name="slogan" required placeholder="slogan" value=""></br>
<b>status: </b></br>
<input type="text" name="status" required placeholder="status" value=""></br>

<b>leader </b></br>
<textarea name="leader" style="width:400px;height:200px;" required placeholder="leader" value=""></textarea></br>
<b>author: </b></br>
<input type="text" name="author" required placeholder="author" value=""></br>
<b>created_on: </b></br>
<input type="text" name="created_on" required placeholder="created_on" value=""></br>
<b>date_url: </b></br>
<input type="text" name="date_url" required placeholder="date_url" value=""></br>
<b>last_modified: </b></br>
<input type="text" name="last_modified" required placeholder="last_modified" value=""></br>
<b>description: </b></br>
<textarea name="description" title="Social networks" required placeholder="description" value="" required style="width:400px;height:60px;"></textarea></br>
<b>body :</b></br>
<textarea name="body" style="width:400px;height:200px;" required placeholder="body"></textarea></br>
<b>tags: </b></br>
<input type="text" name="tags" value="" placeholder="tags"></br>
<b>category: </b></br>
<input type="text" name="category" value="" required placeholder="category"></br>
<b>rubrik: </b></br>
<input type="text" name="rubrik" value="" required placeholder="rubrik"></br>

<b>type:</b><br>
<input type="text" name="type" value="" required placeholder="type"></br>

<b>slug:</b><br>
<input type="text" name="slug" value="" required placeholder="slug"></br>
<b>part: </b><br>
<input type="number" name="part" value="" placeholder="part"></br>

<b>foto_cover: </b><br>
<input type="text" name="foto_cover" value="" placeholder="foto_cover"></br>

<b>id: </b></br>
<input type="text" name="id" value="" required placeholder="id"></br>
${(buser ? `<input type="submit" value="save"></br>` : `<b>u'r not an admin</b></br>`)}
</form>
<output id="demo"></output>
</div>
<script>
var y;
function removePost(el){
var x;
if(confirm("Delete this post? Press a button!")==true){
x="About deleting the post "+el.getAttribute('data-id');
//alert(el.getAttribute('data-id'));
//alert(el.parentNode.parentNode.parentNode.innerHTML)
var xhr=new XMLHttpRequest();
    xhr.open('GET','/deletePost/'+el.getAttribute('data-id'));
	xhr.onload=function(e){
  if(this.status == 200){
  x=this.responseText;
  //alert(this.responseText);
  el.parentNode.parentNode.parentNode.remove();
  }}
  xhr.onerror=function(e){alert("fuck" +e.status);}
  xhr.send();
  
}
else{x="You pressed Cancel!";}
demo.innerHTML=x;
}
outinfo.innerHTML='';

function redaktorHref(el){
//alert('ok');
//alert(el.getAttribute('data-id'));
outinfo.innerHTML='connecting database...';
var x=el.getAttribute('data-id');
y=x;
var xhr=new XMLHttpRequest();
    xhr.open('GET','/get_an_article/'+x);
	xhr.onload=function(e){
  if(this.status == 200){
/*{_id,title,slogan,sub_title,author,leader,body,tags,category,rubrik,part,description,type,status,
slug,created_on,last_modified,date_url,foto_cover}; to do{checked{by,when},pic} */
  outinfo.innerHTML='';
  var data=JSON.parse(this.responseText).post;
  //alert('data '+this.responseText+' : '+data.post);
  var d=document.forms.namedItem("post");
  d.title.value=data.title;
  d.slogan.value=data.slogan;
  d.sub_title.value=data.sub_title;
  d.leader.value=data.leader;
  d.author.value=data.author; 
  d.created_on.value=data.created_on;
d.date_url.value=data.date_url;  
  d.last_modified.value=data.last_modified;
  d.description.value=data.description;
  d.body.value=data.body;
  d.tags.value=data.tags;
  d.category.value=data.category;
  d.type.value=data.type;
 d.slug.value=data.slug;
 d.foto_cover=data.foto_cover;
 d.status.value=data.status;
  d.rubrik.value=data.rubrik; 
  d.part.value=data.part;
  d.id.value=x;
  }}
xhr.onerror=function(e){alert("fuck" +e.status);
outinfo.innerHTML=e.status +' : '+JSON.parse(this.responseText).err;}
xhr.send();
}
/***
function savePost(el){
//alert('about saving the post '+y);
demo.innerHTML='about saving the post '+y;
var xhr=new XMLHttpRequest();
    xhr.open('GET','/saveRedactPost/');
	xhr.onload=function(e){
  if(this.status == 200){}
  xhr.onerror=function(e){alert("fuck" +e.status);
  xhr.send();
}
***/

var formface=document.forms.namedItem("post");
formface.addEventListener('submit',function(ev){
var data=new FormData(document.forms.namedItem("post"));
var xhr=new XMLHttpRequest();
    xhr.open("post","/save_an_edited_post",true);
	xhr.onload=function(e){
	 if(xhr.status==200){
	 //var data=JSON.parse(this.response);
	 demo.innerHTML=this.response;
	 }
	 else{demo.innerHTML=this.response;
	 }}
	 //alert(data);
	 xhr.send(data);
	 ev.preventDefault();},false);
</script>
<!-- eof article_editor.js -->`;
return s;
}
module.exports={article_editor};
function getEditorStyle(n){
	return `<style>
	.popup h3{font: .81/150% Arial;color:lightgray;}
.panel {
    background-color: /*#444*/red;
    height: 34px;
    padding: 10px;
border-radius:10px;
border:2px solid #194;
}
.panel a#login_pop, .panel a#join_pop {
    border: 2px solid #aaa;
    color: #fff;
    display: block;
    float: right;
    margin-right: 10px;
    padding: 5px 10px;
    text-decoration: none;
    text-shadow: 1px 1px #000;
border-radius: 10px;
}
a#login_pop:hover, a#join_pop:hover {
    border-color: #eee;
}
.overlay {
    background-color: rgba(0, 0, 0, 0.6);
    bottom: 0;
    cursor: default;
    left: 0;
    opacity: 0;
    position: fixed;
    right: 0;
    top: 0;
    visibility: hidden;
    z-index: 1;
    transition: opacity .5s;
}
.popup::-webkit-scrollbar{width:5px;}
/*.popup::-webkit-scrollbar:hover{width:5px;background-color:blue;}*/
.popup::-webkit-scrollbar-track{
box-shadow: inset 0 0 6px rgba(255,255,240,0.3);
border-radius:2px;
}

.popup::-webkit-scrollbar-thumb{
border-radius:2px;

background:rgba(0,0,0,0.8);
box-shadow:inset 0 0 6px rgba(255,255,224,0.9);
}
.popup::-webkit-srcrollbar-thumb:hover{
visisbility:visible;
background-color:rgba(20,20,20,0.6);}
.popup::-webkit-scrollbar-thumb:active{
background:rgba(255,0,0,0.4);
}

.overlay:target {
    visibility: visible;
    opacity: 1;
}

.popup {
scrollbar-arrow-color:gray;
color:gray;
    background-color: rgba(0,0,0,.2);
    border: 3px solid rgba(255,255,255,0.4);
    display: inline-block;
	left: 50%;
    top: 50%;
	width:90%;
    opacity: 0;
    padding: 15px;
position: fixed;
    text-align: justify;
   height:/*300px*/90%;
    overflow-y:scroll;
min-height:50px;
    visibility: hidden;
z-index: 30;
-o-transform: translate(-50%,-50%);
-ms-transform: translate(-50%,-50%);
-moz-transform: translate(-50%,-50%);
-webkit-transform: translate(-50%,-50%);
transform: translate(-50%, -50%);
border-radius: 10px;
	/*box-shadow: 0 1px 1px 2px rgba(0, 0, 0, 0.4) inset;*/
    transition: opacity .5s, top .5s;
}
.overlay:target+.popup {
	opacity: 1;
    visibility: visible;
	}
.close {
    background-color: rgba(0, 0, 0, 0.8);
    height: 30px;
    line-height: 30px;
    position: absolute;
    right: 0;
    text-align: center;
    text-decoration: none;
    top: -15px;
    width: 30px;
 border-radius: 15px;
}
.close:before {
    color: rgba(255, 255, 255, 0.9);
    content: "X";
    font-size: 24px;
    text-shadow: 0 -1px rgba(0, 0, 0, 0.9);
}
.close:hover {
    background-color: rgba(64, 128, 128, 0.8);
}
.popup p, .popup div {
    margin-bottom: 10px;
}
.popup label {
    display: inline-block;
    text-align: left;
    width: 120px;
}
.popup input[type="text"], .popup input[type="password"] {
    border: 1px solid;
    border-color: #999 #ccc #ccc;
    margin: 0;
    padding: 2px;
border-radius: 2px;
}
.popup input[type="text"]:hover, .popup input[type="password"]:hover {
    border-color: #555 #888 red #888;
}
/*@media screen and (max-width: 1024px) {
.popup{width:50%;}

}*/

@media screen and (max-width: 650px) {
.popup{color:red;left:50%;top:50%;width:91%;height:70vmin;}
overlay:target+.popup{left:0;}
}
/*
@media screen and (max-width: 360px) {
.popup{width:82%;left:calc(100% - 100%);}
textarea{width:96%;}
.popup input[type="text"]{width:90%;}
.overlay:target+.popup {color:green;top:20%;}
}*/
</style>`;
}