const MY_PORT=8000;
const MY_HOSTNAME="my_app_local.ru";

//const cert='/home/a0281868/domains/tetatetme.ru/tetatetme.crt';
//const key='/home/a0281868/domains/tetatetme.ru/private.key';
const key="/home/globik/kore.io_websocket/janus/cert/key.pem";
const cert="/home/globik/kore.io_websocket/janus/cert/server.pem";
const express=require('express');



const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

const app = express();
const ssl_ops={
cert: fs.readFileSync(cert), 
key: fs.readFileSync(key)
}
 
const server = https.createServer(ssl_ops, app).listen(MY_PORT,MY_HOSTNAME,function(){
console.log("Listen : https://",MY_HOSTNAME,":", MY_PORT);	
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const wss = new WebSocket.Server({server: server });

/*
wss.on('connection', function open(ws) {
    console.log('Законектился один пользователь');
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
 
    ws.send('Это пришло SDP с сервера');
  
    ws.on('close', function close() {
        console.log('Пользователь отключился');
    })
});*/


// Переменные и массивы для работы с ними ниже ?? 
var offerSdp = [];
var offerId = [];
var answerSdp = [];
var answerId = [];

function broadcast_to_all_not_me(ws, data){
wss.clients.forEach(function(client){
if(client !==ws && client.readyState===WebSocket.OPEN)client.send(data)	
})
}
function broadcast_to_all(data){
wss.clients.forEach(function(client){
if(client.readyState===WebSocket.OPEN)client.send(data)	
})
}

function send_target( data,target){

console.log("size: ", wss.clients.size);
for(let i of wss.clients){
if(i.nick==target){
console.log(i.nick,"=",target);
if(i.readyState===WebSocket.OPEN)i.send(data)	
break;
}
}
}

//КОД АЛИКА => who's this?
wss.on('connection', on_ws_connection);

function on_ws_connection(ws, url){
console.log("websocket connected!");
ws.on('message', on_message);
ws.on('close', function(){console.log("Websocket disconnected!")})
ws.on('error', function(error){console.log("Websocket error\n", error);})

function on_message(data){

console.log("data came: ", data);
var send_to_clients=0;
try{
var msg = JSON.parse(data);//must be Json format, not binary, not a simple text

}catch(e){console.log(e);return;}

if(msg.message_type=="msg"){
console.log("message here: ", msg);
}else if(msg.message_type=="nick"){
console.log("set a nick");
ws.nick=msg.nick;
ws.send(data);
msg.message_type="join";//a new user joined , inform all
let rjs=JSON.stringify(msg);
console.log(rjs);
broadcast_to_all(rjs);
send_to_clients=1;
}else if(msg.message_type=="target"){
send_target(data, msg.to);
send_to_clients=1;
}else{console.log("unknown type=>", msg.message_type); return;}
		
if(send_to_clients==0)ws.send(data);

	}}
	


    


/*const fs = require('fs');
var app = require('express')();
var https = require('https').Server(app);

//var options = {
//  key: fs.readFileSync('./private.key'),
//  cert: fs.readFileSync('./file.crt')
//};

var server = https.createServer(app);
var io = require('socket.io')(https);
//var io = require('socket.io').listen(server);

server.listen(3000, function(){
  console.log('listening on *:3000');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected' + socket.id);
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});


io.on('connection', function(socket){
  socket.on('chat message', function(msg2){
    io.emit('chat message', msg2);
    console.log('emit message: ' + msg2);
  });
});

io.on('connection', function(socket){
    socket.on('chat member gender', function(user){
    console.log('gender: ' + user[0] + " age: " + user[1] + " socket_id: " + socket.id);
  });
});



var users = {};

io.on("connection", function(socket) {

		// Желание нового пользователя присоединиться к комнате
		socket.on("room", function(message) {
			var json = JSON.parse(message);
			// Добавляем сокет в список пользователей
			users[json.id] = socket;

			console.log('пользователь добавлен в массив');

			if (socket.room !== undefined) {
				// Если сокет уже находится в какой-то комнате, выходим из нее
				socket.leave(socket.room);
			}
			// Входим в запрошенную комнату
			//socket.room = json.room;
			socket.room = "PurpleOctopusRoom";
			socket.join(socket.room);
			socket.user_id = json.id;

			console.log('пользователь добавлен в комнату ' + socket.room);


			// Отправялем остальным клиентам в этой комнате сообщение о присоединении нового участника/
			socket.broadcast.to(socket.room).emit("new", json.id);
			
		});


// Сообщение, связанное с WebRTC (SDP offer, SDP answer или ICE candidate)
		socket.on("webrtc", function(message) {

			console.log('сообщение от webrtc ');
			var json = JSON.parse(message);
			if (json.to !== undefined && users[json.to] !== undefined) {
				// Если в сообщении указан получатель и этот получатель известен серверу, отправляем сообщение только ему...
				users[json.to].emit("webrtc", message);
				console.log('emit webrtc получатель известен серверу' + json.to + " from " + json.from);
			} else {
				// ...иначе считаем сообщение широковещательным
				socket.broadcast.to(socket.room).emit("webrtc", message);
				console.log('emit webrtc считаем сообщение широковещательным');
			}
		});

});
*/

