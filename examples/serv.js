const Koa=require('koa');
const Router=require('koa-router');
const render=require('./render.js')
const webport=5000;
const app=new Koa();

render(app,{root:'views', development: true})
const router=new Router();
router.get('/',async ctx=>{
ctx.body=ctx.render('index',{mama:"mama"})
})
router.get('/index2', async ctx=>{
	ctx.body=ctx.render('index2',{})
})
app.use(router.routes()).use(router.allowedMethods())
app.listen(webport);
console.log(webport);