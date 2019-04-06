const bodyParser=require('koa-body');
const Router=require('koa-router');

const adm=new Router();

adm.get('/home/profile', authed, async ctx=>{
ctx.body=await ctx.render('admin_dashboard',{});
})

module.exports=adm;
function auth(ctx,next){
	//for xhr
if(ctx.isAuthenticated() && ctx.state.user.brole=="superadmin"){return next()}else{ctx.throw(401, "Please log in.")}}
function authed(ctx, next){
	//console.log('is authenticated? : ',ctx.isAuthenticated());
	//console.log('state.user.role: ',ctx.state.user);
if(ctx.isAuthenticated() && ctx.state.user.brole == "superadmin"){
return next()
}else{ ctx.redirect('/');}}