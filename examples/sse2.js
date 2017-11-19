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
setInterval(function(){
sse.publish('channel',{data:"fuki"});
},10000)

router.get('/subscribe', async (ctx,next)=>{
sse.subscribe('channel',ctx.res)

//console.log('header: ',ctx.request)
ctx.response=false;
	await next();
	//var liga=sse.subscribers('channel');
	//console.log('subscribers: ',liga)
	
})
var cd=0;
router.post('/send',async ctx=>{
	var {name,id,type}=ctx.request.body;
sse.publish('channel','fuck',{name:name,id:id,type:type})
ctx.body={info:'ok'}
var piga=sse.subscriberCount('channel')
console.log('subscriber count: ',piga)
if(cd>4){sse.end()}
cd++;
})

sse.on('subscribe',(room,res)=>{
console.log('room subscribe: ',room)
//console.log('res subscribe: ',res)
})
sse.on('unsubscribe',(room,res)=>{
console.log('room unsubscribe: ',room)
//console.log('res unsubscribe: ',res)
})
sse.on('finish',()=>{
console.log('finish')
})
sse.on('error',()=>{console.log('sse error')})
sse.on('warnig',()=>{console.log('sse warnig')})
//see.end()
//sse.un
app.use(router.routes()).use(router.allowedMethods())
app.listen(webport)
console.log(webport)