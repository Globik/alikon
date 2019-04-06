const limit=3;

async function get_all_articles(ctx){
ctx.session.dorthin=ctx.path;
let db=ctx.db; var posts;
let locals=ctx.locals;
var mamba="where status='active'";
if(ctx.isAuthenticated()){
if(ctx.state.user.role==='superadmin'){mamba='';}
}
try{
posts=await db.query(`select*from articles ${mamba} order by id desc offset 0 limit ${limit}`);
}
catch(e){ctx.session.error=e;ctx.redirect('/error')}
ctx.body=ctx.render('articles_page',{posts:posts.rows, locals:locals});
}

async function get_all_articles_page(ctx){
ctx.session.dorthin=ctx.path;
let locals=ctx.locals;
let db=ctx.db;
var mamba="where status='active'";
if(ctx.isAuthenticated()){
if(ctx.state.user.role==='superadmin'){mamba='';}
}
if(locals.page <= locals.total_pages){
try{
var posts=await db.query(`select*from articles ${mamba} order by id desc offset ${(locals.page - 1) * limit } limit ${limit}`);
}catch(e){console.log('err in db:',e);}
ctx.body=ctx.render('articles_page',{locals:locals,posts:posts.rows});
}
else{ctx.status=404;ctx.redirect('/articles');}
}

async function article_slug(ctx){
ctx.session.dorthin=ctx.path;
let db=ctx.db;
var vpost;
try{
var post=await db.query(`update articles set gesamt_seen=gesamt_seen+1 where slug='${ctx.params.slug}' returning *`);
if(post.rows.length){
vpost=post.rows[0];
console.log('vpost: ',vpost)
ctx.body=ctx.render('article_view',{post: vpost});
}else{
ctx.session.dorthin=null;
ctx.session.error="Yopt - not found, guy";
ctx.redirect('/error');}
}catch(e){console.log(e);}
}
module.exports={get_all_articles, get_all_articles_page, article_slug}