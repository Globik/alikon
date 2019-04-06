// which psql heroku pg:psql --app frozen-atoll-47887
const PORT = 3000;
//const DB_URL='postgress://globik:null@localhost:5432/test';
const DB_URL=process.env.DATABASE_URL;
const Koa=require('koa');
const koaBody=require('koa-body');
const passport=require('koa-passport');
const WebSocket=require('ws');
const {websock}=require('./libs/websock.js');
const shortid=require('shortid');

const url=require('url');
const Pool=require('pg-pool');
const PgStore=require('./libs/pg-sess.js');
const pgtypes=require('pg').types;
const render=require('koa-rend');
const serve=require('koa-static');
const session=require('koa-generic-session');
const pubrouter=require('./routes/pubrouter.js');
const adminrouter=require('./routes/adminrouter.js');
const mainmenu=require('./config/app.json');
//const adminrouter=require('./routes/adminrouter.js');

//const pgn=require('pg').native.Client; // see test/pg.js for LD_LIBRARY_PATH
pgtypes.setTypeParser(1114, str=>str);
const pars=url.parse(DB_URL);
const cauth=pars.auth.split(':');
const pg_opts = { user:cauth[0],password:cauth[1],host:pars.hostname,port:pars.port,database:pars.pathname.split('/')[1],
	ssl:false
	//Client:pgn
	};
const pool = new Pool(pg_opts);
const pg_store=new PgStore(pool);

pool.on('connect', function(client){console.log('db connected!')})
pool.on('error', function(err, client){console.log('db err: ', err.name)})
pool.on('acquire', function(client){console.log('db acquired!')})

const app=new Koa();
app.keys=['your-secret']
app.use(serve(__dirname+'/public'));
app.use(session({store: pg_store}, app))

render(app,{root:'views', development: true})

app.use(koaBody())
require('./config/auth.js')(pool,passport)

app.use(passport.initialize())
app.use(passport.session())

function xhr(){
return async function xhr(ctx,next){
ctx.state.xhr=(ctx.request.get('X-Requested-With')==='XMLHttpRequest')
await next()
}
}
app.use(xhr());
app.use(async (ctx, next)=>{
ctx.state.showmodule = mainmenu;//see config/app.json
await next();	
})
app.use(pubrouter.routes()).use(pubrouter.allowedMethods());
app.use(adminrouter.routes()).use(adminrouter.allowedMethods());

app.use(async (ctx, next)=>{
console.log('ctx.status!',ctx.status);
//await next();

try{
await next();

if(ctx.status === 404) ctx.throw(404, "fuck not found",{user:"fuck userss"});
}catch(err){
//ctx.status=err.status || 500;
//console.log('THIS>STATUS: ', ctx.status);
console.log("error");
if(ctx.status=== 404){
ctx.session.error='not found';
console.log('method: ', ctx.method, 'ctx.url: ', ctx.url);
if(!ctx.state.xhr)ctx.body=await ctx.render("error",{});
return;

}

}});

app.on('error', function(err, ctx){
console.log('app.on.error: ',err.message, 'ctx.url : ', ctx.url);
});

pg_store.setup().then(function(){
const servak=app.listen(PORT);
	const wss=new WebSocket.Server({server:servak});
	//websock(wss,pool,sse,shortid,server,RTCPeerConnection,RTCSessionDescription,peerCapabilities,roomOptions);
//websock(wss,pool, 'sse', shortid,' server', 'RTCPeerConnection ', 'RTCSessionDescription' , 'peerCapabilities,roomOptions');
function noop(){}
const interval=setInterval(function ping(){
wss.clients.forEach(function each(ws){
if(ws.isAlive===false)return ws.terminate();
ws.isAlive=false;
ws.ping(noop);	
})	
},50000)
function heartbeat(){this.isAlive=true;}
wss.on('connection', function(ws,url){
console.log("websocket connected.");
ws.isAlive=true;
ws.on('pong',heartbeat);
ws.on('message',function(msg){
console.log("websocke message: ",msg);
var send_to_client=0;
if(send_to_client==0)ws.send(msg);
});
ws.on('error', function(er){console.log("websock err: ", err);})
ws.on('close', function(){console.log("websocket closed");
//ws.removeListener(heartbeat);
});	
	
});


console.log('soll on port: ', PORT, 'started.');
}).catch(function(err){
console.log("err setup pg_store", err.name);
});

process.on('unhundledRejection',(reason, p)=>{
console.log('Unhandled Rejection at: Promise', p, 'reason: ', reason);
});	
