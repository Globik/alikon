const limit=3;

function* get_all_articles(){
this.session.dorthin=this.path;
let db=this.db; var posts;
var locals=this.locals;
var mamba="where status='active'";
if(this.req.isAuthenticated()){
if(this.req.user.role==='superadmin'){mamba='';}
}
try{
posts=yield db.query(`select*from articles ${mamba} order by id desc offset 0 limit ${limit}`);
}
catch(e){this.session.error=e;this.redirect('/error')}
this.body=this.render('articles_page',{buser:this.req.user, posts:posts.rows, locals:locals});
}

function* get_all_articles_page(){
this.session.dorthin=this.path;
var locals=this.locals;
let db=this.db;
var mamba="where status='active'";
if(this.req.isAuthenticated()){
if(this.req.user.role==='superadmin'){mamba='';}
}
if(locals.page <= locals.total_pages){
try{
var posts=yield db.query(`select*from articles ${mamba} order by id desc offset ${(locals.page - 1) * limit } limit ${limit}`);
}catch(e){console.log('err in db:',e);}
this.body=this.render('articles_page',{locals:locals,buser:this.req.user,posts:posts.rows});
}
else{this.status=404;this.redirect('/articles');}
}

function* article_slug(){
this.session.dorthin=this.path;
let db=this.db;
var vpost;
try{
var post=yield db.query(`update articles set gesamt_seen=gesamt_seen+1 where slug='${this.params.slug}' 
and date_url='${this.params.date_url}' returning *`);
if(post.rows.length){
vpost=post.rows[0];
	console.log('vpost: ',vpost)
this.body=this.render('article_view',{buser:this.req.user,post: vpost});
}else{
this.session.dorthin=null;
this.session.error="Yopt - not found, guy";
this.redirect('/error');}
}catch(e){console.log(e);}
	}
module.exports={get_all_articles, get_all_articles_page, article_slug}