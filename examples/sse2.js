const Koa=require('koa')
const sse=require('sse-broadcast')()
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
sse.subscribe('channel',ctx.res)
//console.log('header: ',ctx.request)
ctx.response=false;
	await next();
	//var liga=sse.subscribers('channel');
	//console.log('subscribers: ',liga)
	
})

router.post('/send',async ctx=>{
	var {name,id,type}=ctx.request.body;
sse.publish('channel','message',{name:name,id:id,type:type})
ctx.body={info:'ok'}
var piga=sse.subscriberCount('channel')
	console.log('subscriber count: ',piga)
})

app.use(router.routes()).use(router.allowedMethods())
app.listen(webport)
console.log(webport)