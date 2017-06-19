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

router.get('/subscribe', async ctx=>{
    let stream = new PassThrough();

    let fn = (message) =>{ console.log('message: ',message);stream.write(`data: ${JSON.stringify(message)}\n\n`);}
    let finish = () => {console.log('OnFinish!');dispatcher.removeListener('message', fn);}

    ctx.response.status = 200;
    ctx.response.type = 'text/event-stream;charset=utf-8';
    ctx.response.set('Cache-Control', 'no-cache');

    ctx.body = stream;

    stream.write('event:fuck\ndata: open stream\n\n');
    dispatcher.on('message', fn);
    ctx.req.on('close', finish);
    ctx.req.on('finish', finish);
    ctx.req.on('error', finish);
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(webport);
console.log(webport);