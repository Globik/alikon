'use strict';
var sluger=require('limax');
var bodyParser=require('koa-body');
var Router=require('koa-router');
var co=require('co');
var fs=require('fs');
var fs=require('co-fs');
var path=require('path');￼￼
var diskspace=require('diskspace');

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
let {dob}=this, docs=dob.collection('posts');
let locs=this.request.body.fields;
locs.slug=sluger(locs.title);
let date=new Date();
	locs.created_on=date;
	locs.last_modified=locs.created_on;
	locs.date_url=date.getTime().toString().slice(0,8);
	try{
		var post=yield docs.insert(locs);
		//console.log('post :',post);
	}catch(e){console.log('error :',e);this.throw(404,e);}
	
this.body=JSON.stringify(locs,post,null,2);
});
admin.post('/save_an_edited_post',authed, bodyParser({multipart:true,formidable:{}}),function *(){
	let {dob,bid}=this, docs=dob.collection('posts');
	var locs=this.request.body.fields;
	locs.slug=sluger(locs.title);
try{
yield docs.updateOne({_id:bid(locs.id)},{$set:locs},{$currentDate:{last_modified:true}});
}catch(e){console.error(e);this.throw(404,e);}
this.body=JSON.stringify(locs,null,2);
});
/*
admin.get('/get_an_article/:dataid',function *(){
let {dob,bid}=this,docs=dob.collection('posts');
var post;
try{
 post= yield docs.findOne({_id:bid(this.params.dataid)});
 console.log('Post: ',post);
//{_id,title,slogan,sub_title,author,leader,body,tags,category,rubrik,part,description,type,status,slug,
//created_on,last_modified,date_url}; todo{checked{by,when},pic}
	}catch(err){ console.log('error find article: ',err);this.throw(404,err);}
	this.body={post};});
*/
/*
==============================================================
MONGODB MANAGER
================================================================
*/

function piski(dpath){
	return new Promise((resolve,reject)=>{
		diskspace.check(dpath,(err, total, free, status)=>{
			if(err){return reject(err);}
			var data={};data.total=total;data.free=free;data.status=status;
			resolve(data)
		})
	})
}
admin.get('/dashboard/mongodb',authed,function *(){

	let {dob}=this;var error=null;
	var admindb=dob.admin();
	try{var dbs=yield admindb.listDatabases();}catch(e){error=e;}
	this.type="html";
this.body=this.render('admin_dashboard_mongodb',{buser:this.req.user, dbs, error:error});

	//collections(),listCollections({name:"codeblogs"}).toArray(),stats(),indexInformation("posts"),
	//executeDbAdminCommand({dbStats:1,scale:1}),command({dbStats:1,scale:1}),
	//command({collStats:"codeblogs",scale:1})
// cmd={dbStats:1,scale:1}collStats,listCollections for admin,{listDatabases:1,scale:1},
//listCommands,{dataSize:"todo.posts"}
	//var b=yield admindb.command({collStats:"",scale:1});console.log('ADMINDB.COMMAND(): ',b);
	//var ew=b.cursor.firstBatch[2];console.log('BATCH: ',ew);
	
});

var osType = require('os').type();
//console.log('OS: ',osType)
admin.post('/get_diskspace',authed,function *(){
	var error=null;
	var {dbtotalsize=0}=this.request.body;
	var mukushka;
	if(osType=="Windows_NT"){mukushka="/";}else{mukushka="C";}
	try{
	var pip=yield piski(mukushka);
	this.body={htmlbody:this.render('vidget_disk_space',{pip,dbtotalsize,error})};
	}
	catch(e){this.body={error:e};}
	});
	var shlag=function *(mob){
		var stat={};
		try{var docs=yield mob.listCollections().toArray();
		}catch(e){stat.error=e;}
		var bla=gif=> new Promise((res,rej)=>
		mob.collection(gif.name).stats((er,resu)=> er ? rej(er):res(resu)))
var dak=docs.map(bla);
try{var [...pik]=yield Promise.all(dak);stat.data=pik;}
catch(e){stat.error=e;}
return stat;
		}
	admin.get('/mongodb/get_db_collections_stats',authed,function *(){
		let {dob,params}=this;var error=null,data=null,htmlbody;
		console.log('params: ',params);
try{var a=yield shlag(dob);data=a.data;}catch(e){error=e;}
		this.body={data,error};
	});
/* ==================================================================== */
module.exports=admin;

function *authed(next){
if(this.req.isAuthenticated() && this.req.user.role == "admin"){yield next;}else{ this.redirect('/');}}