const sse=n=>{return `<html><body onload="init_sse();"><h1>sse</h1>
<form name="messager" method="post" action="/send">

<input type="text" name="name" value="Alice"/><br>
<input type="text" name="id" value="1"/><br>
<input type="text" name="type" value="leave"/><br>
<input type="submit" value="send message"/>
</form>
<br><button onclick="stops();">stop sse</button><br>
<output id="out"></output>
<output id="out2"></output>
<h2>Users in videostreaming</h2>
<li data-id="110">us110<span id="online">true</span>
<li data-id="130">us130<span id="online">true</span>
<li data-id="160">us160<span id="online">true</span>
<li data-id="170">us170<span id="online">true</span>
<script>
var formface=document.forms.namedItem("messager");
formface.addEventListener('submit', baba, false);
function baba(ev){
var xhr=new XMLHttpRequest();
xhr.open(ev.target.method, ev.target.action);
xhr.setRequestHeader('Content-Type', 'application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
//alert(this.response);
out.innerHTML=this.response+'<br>';
}else{
alert(this.response);
}
}
xhr.onerror=function(e){console.error('XHR onerror: '+e);}
var data={};
data.id=ev.target.id.value;
data.name=ev.target.name.value;
data.type=ev.target.type.value;
var mid=JSON.stringify(data);
xhr.send(mid);
ev.preventDefault();
}
//['110','130','160','170']
var ct=0;
var s=0;
function init_sse(){
s=new EventSource('/subscribe',{withCredentials:true});
s.onopen=function(e){
out2.innerHTML+='<b>event source is opened</b><br>';
console.warn('event source is opened! ')}
s.onmessage=function(e){
out2.innerHTML+='<b>event data:</b>'+e.data+'<br>';
try{
var mata=JSON.parse(e.data);
}catch(e){return;}
if(mata.type==='leave'){
var l=document.querySelector('[data-id="'+mata.id+'"]');
if(l){
console.log('ok');
l.remove();
}
}

}
s.onerror=function(e){out2.innerHTML+="event source error: "+e+"<br>";}
s.onclose=function(e){console.warn('ON_CLOSE!')}//??
s.addEventListener('fuck',function(e){
out2.innerHTML+="<b>fuck event name came: </b>"+e.data+"<br>";
console.log('fuck event came : '+e.data);
//if(ct>3){s.close();}
console.log(ct);
ct++;
},false)
}
function stops(){
console.warn('stop sse');
if(s !==0){s.close()}
}

</script>
</body></html>`}
module.exports={sse}