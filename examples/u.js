const Koa=require('koa');
const Router=require('koa-router');
const render=require('koa-rend');
const koaBody=require('koa-body');
//const redis=require('redis');
const redis=require('./redis-promis.js')();
var cli=redis.createClient();

const webport=5000;
const app=new Koa();
const router=new Router();
app.use(koaBody());
render(app,{root:'views', development: true})


app.use(async(ctx,next)=>{
ctx.state.title="Yout awsome title";
await next();
})
var abba=[];
cli.sscan('us',0,(err,obj)=>{
if(err)console.log(err)
console.log('obj: ',obj)
if(obj){
obj[1].forEach((el,i)=>{
cli.hgetall(el,(err,res)=>{
if(err)console.log(err)
console.log('obj[1]: ', obj[1][i])
res.id=obj[1][i];
console.log('result3: ',res);
	abba.push(res)
})
console.log('abba: ',abba)
})
console.log('abba: ',abba)
}
	//console.log('abba: ',abba)
})

/*(async()=>{
 try{
 let bu=await cli.sscan('us',0);
console.log('bu: ',bu)
 }catch(e){console.log('er',e)}
 })
*/

async function get_all(mn,ct){
let bu;var riga=[];let suka;
try{
bu=await cli.sscan(mn,ct);
bu[1].forEach((el,i)=>{riga.push(bordo(el))})
suka=await Promise.all(riga);

return suka;
}catch(e){throw new Error(e)}
//return suka;
}
function bordo(el){
return new Promise((res,rej)=>{
cli.hgetall(el).then(d=>{d.id=el;res(d)}).catch(e=>{rej(e)})
})
}


router.get('/', async ctx=>{
	console.log('abba: ',abba)
	
	let bu=await get_all('us',0);//cli.sscan('us',0);
	console.log('bu: ',bu)
	//var li=await bordo(bu[1][0])
	//console.log('li: ',li)
	//bu[1].forEach((el,i)=>{sak.push(bordo(el))})
	//console.log('sak: ',sak)
	
	//var si=await Promise.all(sak)
	//console.log('si: ',si)
ctx.body=await ctx.render("starter",{bu:bu})
})
router.get('/roomer', async ctx=>{
ctx.body=await ctx.render('roomer',{})
})
router.post('/create_room', async ctx=>{
var {roomid,email,username}=ctx.request.body;
cli.hmset(roomid,["email",email,"username",username],(err,res)=>{
if(err)console.log('err in create room: ',err)
console.log('resultat: ',res)
cli.sadd("us",[roomid],(err,res)=>{
if(err)console.log(err)
console.log('resultat2: ',res)
})
})
ctx.body={info:'ok',body:ctx.request.body}
})
app.use(router.routes()).use(router.allowedMethods())
app.listen(webport);
console.log(webport);

cli.on('ready',()=>console.log('redis ready'))
cli.on('connect',()=>console.log('redis connected'))
cli.on('reconnecting',()=>console.log('redis reconnecting'))
cli.on('error',e=>console.log('redis err: ',e))
cli.on('end',()=>console.log('redis end()'))