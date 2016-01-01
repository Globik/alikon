'use strict';
var sluger=require('limax');
const viewpath="../views/";
var bodyParser=require('koa-body');
var Router=require('koa-router');
var co=require('co');
var fs=require('fs');
var fs=require('co-fs');
var path=require('path');
var sluger=require('limax');
//let rel=require('../libs/hotreload.js');
//var admin_dashboard=rel(`${viewpath}admin_dashboard.js`);
var admin=new Router();

admin.get('/dashboard',authed,function*(){
this.type="html";
this.body=this.render('admin_dashboard',{buser:this.req.user});
})

//var admin_dashboard_articles=rel(`${viewpath}//admin_dashboard_articles.js`);

admin.get('/dashboard/articles',authed,function *(){
this.type="html";
this.body=this.render('admin_dashboard_articles',{buser:this.req.user});
});

admin.post('/dashboard/article_create',authed,bodyParser({multipart:true,formidable:{}}),function *(){
let locs=this.request.body.fields;
locs.slug=sluger(locs.title);
let date=new Date();
	locs.created_on=date;
	locs.last_modified=locs.created_on;
	locs.date_url=date.getTime().toString().slice(0,8);
this.body=JSON.stringify(locs,null,2);
});

module.exports=admin;

function *authed(next){
if(this.req.isAuthenticated() && this.req.user.role == "admin"){
 yield next;}
else{ this.redirect('/');}}