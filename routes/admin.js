'use strict';
var sluger=require('limax');
var bodyParser=require('koa-body');
var Router=require('koa-router');
var co=require('co');
var fs=require('fs');
var cfs=require('co-fs');
var path=require('path');
//var diskspace=require('diskspace');

var admin=new Router();
admin.get('/dashboard', authed, function*(){
this.body=this.render('admin_dashboard',{buser:this.req.user});
})
//var admin_dashboard_articles=rel(`${viewpath}//admin_dashboard_articles.js`);
admin.get('/dashboard/articles',authed,function *(){
let db=this.db;
	try{
	var posts=yield db.query('select*from articles order by id desc limit 10');
	}catch(e){console.log('err in dashboard articles: ',e)}
this.body=this.render('admin_dashboard_articles',{buser:this.req.user, posts:posts.rows});
});

admin.post('/dashboard/article_create', authed, bodyParser({multipart:true,formidable:{}}), function *(){
//let {dob}=this, docs=dob.collection('posts');
let db=this.db;
let locs=this.request.body.fields;
locs.slug=sluger(locs.title);
let date=new Date();
locs.created_on=date;
locs.last_modified=locs.created_on;
locs.date_url=date.getTime().toString().slice(0,8);
try{
//insert into articles(title, slug, author, body) values('Mama-3', 'mama-3', 'Globik', 'Hello, Sister!');
var post=yield db.query(`insert into articles(title, slug, author,body) values('${locs.title}','${locs.slug}','${locs.author}','${locs.body}')`);
}catch(e){console.log('error :',e);this.throw(404,e);}
	
this.body=JSON.stringify(locs,post,null,2);
});
admin.get('/get_an_article/:dataid', authed,function *(){
let db=this.db;
var post;
try{
post=yield db.query(`select*from articles where id=${this.params.dataid}`)
 //console.log('Post: ',post.rows);
//{_id,title,slogan,sub_title,author,leader,body,tags,category,rubrik,part,description,type,status,slug,
//created_on,last_modified,date_url}; todo{checked{by,when},pic}
	}catch(e){ console.log('error find article: ',e);this.throw(404,e);}
	this.body={post: post.rows[0]};});
	
admin.post('/save_an_edited_post',authed, bodyParser({multipart:true,formidable:{}}), function *(){
let db=this.db;
let locs=this.request.body.fields;
locs.slug=sluger(locs.title);
locs.last_modified='now()';
try{
//title,slug,author,last_modified,description,body,foto_cover,status,part
var result=yield db.query(`update articles set ${bef_upd(locs)} where id=${locs.id}`);
}catch(e){console.log(e);this.throw(404,e);}
this.body={locs,result};
});
admin.post('/save_editable_article', authed, function*(){
let db=this.db;
let locs=this.request.body;
	console.log('locs: ',locs);
locs.slug=sluger(locs.title);
locs.last_modified='now()';
yield db.query(`update articles set ${bef_upd(locs)} where id=${locs.id}`)
this.body={info:locs,moody:locs.slug}
})
function bef_upd(obj){
let s='';
let d=Object.entries(obj);
d.forEach((el,i)=>{
s+=`${i==0 ? '': ', '}${el[0]}='${el[1]}'`;
})
return s;
}
admin.get('/remove_an_article/:dataid',authed,function*(){
let db=this.db;
console.log('dataid: ', this.params.dataid);
try{
yield db.query(`delete from articles where id=${this.params.dataid}`);
}catch(e){console.log('error find article: ',e);this.throw(404,e);}
this.body={info:'OK. '+this.params.dataid+' is deleted'};
})
/* ************************ */
admin.get('/dashboard/image_uploader', authed, function *(){
	
this.body=this.render('image_uploader',{buser:this.req.user});
});
admin.get('/dashboard/articles_manager', authed, function *(){
	
this.body=this.render('articles_manager',{buser:this.req.user});
});
admin.post('/create_album',authed,function *(){
	var db=this.db;
	//var docs=wrap(db.get('fotoalbums'));
	var title=this.request.body.title;
	var userId=this.request.body.userId;
	var multi=this.request.body.multi;
	console.log('title: ',title,userId,multi);
	var album;
	//var multi=4;
	var created_on=new Date();
	var flagexist;
	var folderexist;
	/*try{
	if(yield cfs.exists('./public/images/upload/'+userId)){
		console.log('exist!');flagexist="schon";}
    else{console.log('doesnt exist - moment mal');
    yield cfs.mkdir('./public/images/upload/'+userId);
	flagexist=true;
     }
	}catch(e){this.throw(400,e.message);}
	*/
	 //var ind=yield docs.ensureIndex({title:1},{unique:true});
	 //console.log('ensure index :',ind);
	 try{
	 //album=yield docs.insert({title:title,user:userId,multi:multi,created_on:created_on});
album=yield db.query(`insert into albums(title,us_data) values('${title}', '{"multi":"${multi}","us_id":"${userId}"}') returning *`);
	 
	/*
	catch(er){
		 console.log('er in catch insert',er);
		 console.log('er code :',er.code+' '+er.name);
		 //try{yield cfs.rmdir(`./public/images/upload/${userId}`);}catch(e){this.throw(400,e.message);}
		 this.throw(400,"имя альбома уже существует. Дай другое имя.")
		 }
		 */
	 if(album.rows && album.rows.length){
		try{
		if(yield cfs.exists('./public/images/upload/'+album.rows[0].id)){
		console.log('exist!');folderexist="schon";}
        else{console.log('doesnt exist - moment mal');
        yield cfs.mkdir('./public/images/upload/'+album.rows[0].id);
	    folderexist=true;
     }
	}catch(e){this.throw(400,e.message)}
	}
	 }catch(e){console.log(e);this.throw(400,e.message);}
	yield this.body={info:"OK",flagexist:folderexist,folderexist:folderexist,album:album.rows[0]};
	 
});
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
if(this.req.isAuthenticated() && this.req.user.role == "superadmin"){yield next;}else{ this.redirect('/');}}