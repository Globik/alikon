'use strict';

const Koa = require('koa');
const router = require('koa-router')();
const koaBody = require('koa-body');
const webport=5000;
const events = require('events');
const render=require('koa-rend');

const PassThrough = require('stream').PassThrough;
const dispatcher = new events.EventEmitter();
const app = new Koa();
app.use(koaBody());
render(app,{root:'views', development: true})

router.get('/',async ctx=>{
ctx.body=await ctx.render('sse',{})
})

router.post('/send', async ctx=> {
    dispatcher.emit('message', ctx.request.body);
    //ctx.response.set('Content-Type', 'text/plain;charset=utf-8');
    ctx.body = {info:'ok'}
});
let stream = new PassThrough();
let vid=0;
let con=new Map();
router.get('/subscribe', async ctx=>{
    function dow(){stream.write('event:fuck\ndata: fuck and data\n\n')}
var t=setInterval(dow,5000);
    let fn = (message) =>{ console.log('message: ',message);stream.write(`data: ${JSON.stringify(message)}\n\n`);}
    let finish = () => {
		console.log('OnFinish!');
		dispatcher.removeListener('message', fn);
	}
let onclose=(e)=>{console.log('ON_CLOSE!',e);clearInterval(t);
				 console.log('clear interval for: ',ctx.vid);
				  delete ctx.vid;
				 }
let onerror=(e)=>{console.log('ON_ERROR!',e)}
    ctx.response.status = 200;
    ctx.response.type = 'text/event-stream;charset=utf-8';
    ctx.response.set('Cache-Control', 'no-cache');
	//ctx.response.set(

    ctx.body = stream;
	ctx.vid=vid;
	con.set('pid',vid)
	console.log('size: ',con.size);
vid++;
	
    dispatcher.on('message', fn);
    ctx.req.on('close', onclose);
    ctx.req.on('finish', finish);
    ctx.req.on('error', onerror);
	ctx.res.on('close',function(){console.log('RESPONSE_CLOSE')})
	ctx.req.on('connection',()=>{console.log('REQ_CONNECTION')})
	ctx.res.on('connection',()=>{console.log('RES_CONNECTION!')})
	stream.on('error',(e)=>{console.log('error!!: ',e);
							//ctx.res.end()
							//stream.end();
							//ctx.response.status=500;
							//ctx.throw(500,'fuck')
						   })//??
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(webport);

















console.log(webport);