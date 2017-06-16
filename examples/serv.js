const Koa=require('koa');
const Router=require('koa-router');
const render=require('./render.js')
const webport=5000;
const app=new Koa();

render(app,{root:'views', development: true})//sync true
const router=new Router();

app.use(async(ctx,next)=>{
ctx.state.title="Yout awsome title";
await next();
})

router.get('/', async ctx=>{
ctx.body=await ctx.render("index",{mama:"mama"})
})
router.get('/index2', async ctx=>{
ctx.body=await ctx.render('index2',{mama:"dama"})
})
app.use(router.routes()).use(router.allowedMethods())
app.listen(webport);
console.log(webport);