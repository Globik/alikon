var express=require('express');
var path=require('path');
var app=express();
var WebSocket=require('ws');//websocket 
app.set('port',3000);
//app.use('static',express.static(path.join(__dirname,'./html')));
app.use(express.static('./'));
var server=app.listen(app.get('port'), function(){
var port=server.address().port;
console.log("localhost:", port);
});


var wss=new WebSocket.Server({server: server});
wss.on('connection', function(ws, url){
console.log("websocket connected!")
ws.on('message', function(data){
console.log("on message!");
wss.clients.forEach(function(client){
if(client !==ws && client.readyState===WebSocket.OPEN)client.send(data)	
})
//ws.send(data);

})	
ws.on('close', function(){console.log("Websocket disconnected!")})
ws.on('error', function(error){console.log("Websocket error\n", error);})
})
// http://localhost:3000/offer.html
// http://localhost:3000/answer.html
