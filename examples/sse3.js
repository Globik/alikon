const Koa=require('koa')
const SSE=require('sse-nodejs')
const router=require('koa-router')()

const koaBody=require('koa-body');
const render=require('koa-rend');
const webport=5000;
const app=new Koa()
app.use(koaBody())
render(app,{root:'views',development:true})

router.get('/',async ctx=>{
ctx.body=await ctx.render('sse',{})
})

router.get('/subscribe', async (ctx,next)=>{
let a=SSE(ctx)
a.sendEvent('fuck',function(){
return new Date();
},1000)
ctx.response=false;
	await next();
})

router.post('/send',async ctx=>{
	var {name,id,type}=ctx.request.body;
//sse.publish('channel','message',{name:name,id:id,type:type})
ctx.body={info:'ok'}
//var piga=sse.subscriberCount('channel')
//	console.log('subscriber count: ',piga)
})

app.use(router.routes()).use(router.allowedMethods())
app.listen(webport)
console.log(webport)