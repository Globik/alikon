const roomer=n=>{return `<html><body><a href="/">home</a><br><h1>roomer</h1>
<form name="roomcreator" method="post" action="/create_room">
<input type="text" name="roomid" value="10"/>
<input type="text" name="username" value="Alice"/>
<input type="text" name="email" value="ag@ya.ru"/>
<input type="submit" value="create room"/>
</form>
<output id="out"></output>
<script>
var formface=document.forms.namedItem("roomcreator");
formface.addEventListener('submit', baba, false);
function baba(ev){
var xhr=new XMLHttpRequest();
xhr.open(ev.target.method, ev.target.action);
xhr.setRequestHeader('Content-Type', 'application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
//alert(this.response);
out.innerHTML+=this.response+'<br>';
}else{
alert(this.response);
}
}

xhr.onerror=function(e){console.error('XHR onerror: '+e);}
var data={};
data.roomid=formface.roomid.value;
data.email=formface.email.value;
data.username=formface.username.value;
var mid=JSON.stringify(data);
xhr.send(mid);
ev.preventDefault();
}
</script>
</body></html>`}
module.exports={roomer}