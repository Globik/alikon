const sub_title=false, slogan=false, leader=false,tags=false,category=false,rubrik=false;
var article_editor= n =>{
let s="";
var {buser,post}=n;
s+=`<!-- article_editor.js -->
<a href="#" class="overlay" id="popredaktor"></a>
<section class="popup">
<a href="#" class="close" style="top:8px;right:8px;"></a>
<b>editor</b></br><span id="outinfo" style="background:green;"></span></br>
<!-- {_id,title,slogan,sub_title,author,leader,body,tags,category,rubrik,part,description,type,status,
slug,created_on,last_modified,date_url,foto_cover}; to do{checked{by,when},pic} -->
<form name="post" method="post" enctype="multipart/form-data">
${(buser ? `<input type="submit" value="save"></br>` : ``)}
<span><b>title: </b></span></br>
<input type="text" name="title" required placeholder="title" value="" style="width:400px;"></br>


${sub_title ? `<span><b>sub_title: </b></span></br>
<input type="text" name="sub_title" required placeholder="sub_title" 
value="" style="width:400px;" style="width:400px;"></br>` : ''}
${slogan ? `
<b>slogan: </b></br>
<input type="text" name="slogan" required placeholder="slogan" value=""></br>
`:''}
<b>status: </b></br>
<input type="text" name="status" required placeholder="status" value=""></br>
${leader ? `
<b>leader </b></br>
<textarea name="leader" style="width:400px;height:200px;" required placeholder="leader" value=""></textarea></br>
}`:''}
<b>author: </b></br>
<input type="text" name="author" required placeholder="author" value=""></br>
<b>created_on: </b></br>
<input type="text" name="created_on" required placeholder="created_on" value=""></br>
<b>date_url: </b></br>
<input type="text" name="date_url" required placeholder="date_url" value=""></br>
<b>last_modified: </b></br>
<input type="text" name="last_modified" required placeholder="last_modified" value=""></br>
<b>description: </b></br>
<textarea name="description" title="Social networks" placeholder="description" value="" style="width:400px;height:60px;"></textarea></br>
<b>body :</b></br>
<textarea name="body" style="width:400px;height:200px;" required placeholder="body"></textarea></br>
${tags ? `
<b>tags: </b></br>
<input type="text" name="tags" value="" placeholder="tags"></br>
`:''}
${category ? `
<b>category: </b></br>
<input type="text" name="category" value="" required placeholder="category"></br>
`:''}
${rubrik ? `
<b>rubrik: </b></br>
<input type="text" name="rubrik" value="" required placeholder="rubrik"></br>
`:''}
<b>type:</b><br>
<input type="text" name="type" value="" required placeholder="type"></br>

<b>part: </b><br>
<input type="number" name="part" value="" placeholder="part"></br>

<b>foto_cover: </b><br>
<input type="text" name="foto_cover" value="" placeholder="foto_cover"></br>

<b>id: </b></br>
<input type="text" name="id" value="" required placeholder="id"></br>
${(buser ? `<input type="submit" value="save"></br>` : `<b>u'r not an admin</b></br>`)}
</form>
<output id="demo"></output>
</section>
<script>
var y;
function remove_post(el){

var x;
if(confirm("Delete this post? Press a button!")==true){
x="About deleting the post "+el.getAttribute('data-id');
alert(el.getAttribute('data-id'));
//alert(el.parentNode.parentNode.parentNode.innerHTML)
var xhr=new XMLHttpRequest();
//remove_an_article/:dataid
    xhr.open('get','/remove_an_article/'+el.getAttribute('data-id'));
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
${slogan ? 'd.slogan.value=data.slogan;':''}
${sub_title ? 'd.sub_title.value=data.sub_title;':''}
${leader? 'd.leader.value=data.leader;':''}
d.author.value=data.author; 
d.created_on.value=data.created_on;
d.date_url.value=data.date_url;  
d.last_modified.value=data.last_modified;
d.description.value=data.description;
d.body.value=data.body;
${tags ? 'd.tags.value=data.tags;':''}
${rubrik ? 'd.category.value=data.category;':''}
d.type.value=data.type;

d.foto_cover=data.foto_cover;
d.status.value=data.status;
${rubrik ? 'd.rubrik.value=data.rubrik;':''} 
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
</style>`;
}