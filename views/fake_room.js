const fake_room=function(n){
return `<html><head><meta charset="utf-8"><title>websocket</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="shortcut icon" type="image/ico" href="/images/w4.png"> 
</head><body>
<a href="/">home</a>
<h3>websocket</h3>
<b>username: </b><span id="username">${n.model?n.model.name:'no_name'}</span><br>
<input type="text" id="txt" placeholder="your message"/><button onclick="send();">send</button><br>
<b>output:</b><br>
<output id="out"></output>
<script>
var ws=null;
var usname=username.textConent;
var loc1=location.hostname+':'+location.port;
var loc2='frozen-atoll-47887.herokuapp.com';
var loc3=loc1 || loc2;
var new_uri;
if(window.location.protocol==="https:"){
new_uri='wss:';
}else{
new_uri='ws:';
}
function get_socket(){
if(!window.WebSocket)return;
if(ws){console.log("ws already opened");retrun;}
ws=new WebSocket(new_uri+'//'+loc3+'/'+usname);
ws.onerror=function(e){out.innerHTML+="<b>socket error: </b>"+e+"<br>";}
ws.onopen=function(){out.innerHTML+="<b>websocket opened!</b><br>";}
ws.onclose=function(){out.innerHTML+="<b>websocket closed!</b><br>";}
ws.onmessage=on_message;
}
get_socket();
function on_message(evt){
try{
var msg=JSON.parse(evt.data);
out.innerHTML+=evt.data+"<br>";;
}catch(e){console.warn("error json parse");return;}
if(msg.type=="msg"){

}else{console.warn("unknown type");}
}
function send(){
if(!txt.value)return;
let d={};
d.type="msg";
d.msg=txt.value;
wsend(d);
}
function wsend(d){
if(!ws)return;
let m;
try{
m=JSON.stringify(d);
ws.send(m);
}catch(e){console.warn("err json stringify");}
}
</script>
</body></html>`;	
}
module.exports={fake_room};
