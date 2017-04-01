'use strict';
const sluger=require('limax');
const bodyParser=require('koa-body');
const Router=require('koa-router');
const co=require('co');
const fs=require('fs');
const cfs=require('co-fs');
const path=require('path');
const moment=require('moment');
//var pool=require('../app4.js');
//boss.publish('workbanner',{message:'ok banner start'},{startIn:'6 seconds'}).then(j=>console.log(j));
//var diskspace=require('diskspace');
//pool.query('select from busers',function(er,r){console.log(er);console.log(r);})

const bitpay=require('bitpay-rest');
const bitauth=require('bitauth');

//var privkey=bitauth.decrypt('',fs.readFileSync('/home/globik/.bitpay/api.key','utf8'));
const privkey=bitauth.decrypt('',process.env.BITPAY_TEST_APIKEY);
console.log('privkey: ',privkey);

const pub=new Router();
//var debug=require('debug');^.+@.+\..+$^.+@.+\..+$
const bpclient=bitpay.createClient(privkey);
bpclient.on('error',err=>console.log(err));

bpclient.on('ready',()=>{console.log('bitpay ready')})

var admin=new Router();
admin.get('/dashboard', authed, function*(){
this.body=this.render('admin_dashboard',{buser:this.req.user});
})

/* **************************************************
   BITPAY PART
 *************************************************** */
admin.post('/create_invoice', authed,bodyParser({multipart:true,formidable:{}}), function*(){
var mata=this.request.body.fields;
//console.log('mata: ',mata);
	mata.posData=`{"items":${mata.items}}`;
	//mata.posData.ref="referal-123456"; mata.posData.affiliate="some affiliate fucker";
	mata.itemDesc=mata.items+" Tokens";
	mata.itemCode=66666;
	
	//mata.buyerEmail=process.env.DEV_EMAIL;
    //mata.buyerName="Ali Boos";
	mata.orderID="123456789fd";
	mata.fullNotifications=true;
	//mata.notificationEmail=process.env.DEV_EMAIL;
	mata.notificationURL="https://alikon.herokuapp.com/bp/cb";
	//mata.notificationURL="https://localhost:5000/bp/cb";
	
	console.log('mata: ',mata);
	//console.log('mata: ',mata);
	function bitp(d){
	return new Promise((resolve,reject)=>{bpclient.as('merchant').post('invoices',d,(err,invoice)=>err?reject(err):resolve(invoice))
	})
	}
	var binv=null;
	try{
	var invoice=yield bitp(mata);
		console.log('invoice resultat: ',invoice);
		console.log('posData: ', JSON.parse(invoice.posData).items);
		//console.log('posData: ',invoice.posData.items);
		console.log('buyeremail: ',invoice.buyer.email);
	}catch(e){console.log(e);this.throw(400,e.message);}
	if(process.env.DEVELOPMENT=="yes"){binv=invoice;}
	this.body={id:invoice.id, messy:binv};
})

/* ***********************************
END BITPAY PART
****************************** */



//boss

admin.get('/dashboard/banners', authed, function*(){
let db=this.db;
var result=null;
try{
var banners=yield db.query(`select*from banners`);
if(banners.rows.length){result=banners.rows;
console.log('result: ',result);			   
					   }
}catch(e){console.log(e);}
this.body=this.render('adm_dsh_banners',{buser:this.req.user,banners:result});
})


admin.post('/banner/set_banner', authed, function*(){
	let boss=this.boss;
var jobid_en=yield boss.publish('banner_enable',{message:{ban_id:ban_id,href,src,title,type}},{startIn:this.request.body.start});
	//.then(jobid=>{
	console.log(jobid_en);

this.body={info:this.request.body}
})

admin.get('/dashboard/articles',authed,function *(){
let db=this.db;
	try{
	var posts=yield db.query('select*from articles order by id desc limit 10');
	}catch(e){console.log('err in dashboard articles: ',e)}
this.body=this.render('admin_dashboard_articles'/*'articles_manager'*/,{buser:this.req.user, posts:posts.rows});
});

admin.post('/dashboard/article_create', authed, bodyParser({multipart:true,formidable:{}}), function *(){
let db=this.db;
let locs=this.request.body.fields;
locs.slug=sluger(locs.title);
let date=new Date();
locs.created_on=date;
locs.last_modified=locs.created_on;boss.start().then(ready).catch(err=>console.log(err));
/*
function ready(){
boss.subscribe('workbanner', (job,done)=>{
console.log(job.name,job.id,job.data);
done().then(()=>console.log('confirmed done'))
})
}*/	
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

admin.post('/dashboard/save_editable_article', authed, function*(){
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

admin.post('/dashboard/save_img_content',authed,function*(){
//save jsonb images within table articles ["content","quelle"]
let db=this.db;
var order=this.request.body.order;
var art_id=this.request.body.art_id;
var key=this.request.body.key;
var value=this.request.body.value;

try{
yield db.query(`update articles set images=jsonb_set(images,'{${order},${key}}','"${value}"') where id=${art_id}`);
}catch(e){this.throw(400,e.message);}
this.body={info:"ok",body:this.request.body};
})

admin.get('/remove_an_article/:dataid',authed,function*(){
let db=this.db;
console.log('dataid: ', this.params.dataid);
try{
yield db.query(`delete from articles where id=${this.params.dataid}`);
}catch(e){console.log('error find article: ',e);this.throw(404,e);}
this.body={info:'OK. '+this.params.dataid+' is deleted'};
})

admin.get('/dashboard/articles/edit_photo/:article_id', authed, function*(){
let db=this.db;
let post=null;

try{
var resultat=yield db.query(`select*from articles where id=${this.params.article_id}`);
if(resultat.rows && resultat.rows[0]){
	post=resultat.rows[0];

}
}catch(e){

}
this.body=this.render("adm_photo_gal",{buser:this.req.user,post});
})

//pics to the articles
admin.post('/dashboard/pics_to_post',authed,function*(){
let db=this.db;
var result=null;
var resp={};
try{
var res=yield db.query(`update articles set images='${JSON.stringify(this.request.body.images)}'
 where id=${this.request.body.article_id} returning id, slug, date_url`);
//console.log('resultat in dashb/piccs_to_post: ', result);
	//moment(date_url).format('YYYY-MM-DD')
	if(res && res.rows.length){
		resp.date_url=moment(res.rows[0].date_url).format('YYYY-MM-DD');
		resp.slug=res.rows[0].slug;
		resp.art_id=res.rows[0].id;
		result=resp;
		
	}
}catch(e){
this.throw(400,e.message);
}
this.body={info:this.request.body,result:result}
})

admin.post('/dashboard/albums_list', authed, function*(){
let db=this.db;
var albums=null;
var user_email=this.request.body.user_email;
try{
var resultat=yield db.query(`select*from albums where us_id='${user_email}'`)
if(resultat.rows){albums=resultat.rows;console.log('resultat: ',albums[0]);}
}catch(e){throw(400,e.message);}
this.body={albums:albums}

})

admin.post('/dashboard/albums_list/images',authed, function*(){
let db=this.db;
var images=null;
var alb_id=this.request.body.alb_id;
try{
var resultat=yield db.query(`select*from images where alb_id='${alb_id}'`);
if(resultat.rows && resultat.rows.length){images=resultat.rows;}
}catch(e){this.throw(400,e.message);}
this.body={images};
})
/* ************************  Albums  */
var parse=require('co-busboy');
var shortid=require('shortid');

admin.get('/dashboard/albums', authed, function *(){
let db=this.db;
var albums=null;
try{
var result=yield db.query(`select*from albums`)
if(result.rows && result.rows[0]){albums=result.rows;}
}catch(e){console.log(e)}
this.body=this.render('albums',{buser:this.req.user,albums});
});

admin.get('/dashboard/albums/:alb_id/:alb_title', function*(){
var photos=null;
	
let db=this.db;
try{
var result=yield db.query(`select*from images where alb_id='${this.params.alb_id}'`);
//var result=yield db.query(`select*from images inner join albums on alb_id=albums.id where alb_id='${this.params.alb_id}'`);
if(result.rows && result.rows[0]){photos=result.rows;console.log('resultat: ',result.rows);}
}catch(e){console.log(e)}
this.body=this.render('album_view',{buser:this.req.user,photos,alb_id:this.params.alb_id,alb_title:this.params.alb_title});
})

admin.get('/dashboard/articles_manager', authed, function *(){
	
this.body=this.render('articles_manager',{buser:this.req.user});
});

admin.post('/create_album',authed,function *(){
	let db=this.db;
	//var docs=wrap(db.get('fotoalbums'));
	let id=shortid.generate();
	let title=this.request.body.title;
	let userId=this.request.body.userId;
	let userEmail=this.request.body.userEmail;
	var multi=this.request.body.multi;
	console.log('title: ',title,userId,multi);
	var album;
	//var multi=4;
	var created_on=new Date();
	var flagexist;
	var folderexist;
	/*
	try{
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
		// insert into albums(id,alb_title, us_id) values ('brother','gru5@yandex.ru');
album=yield db.query(`insert into albums(id, alb_title, us_id) values('${id}','${title}', '${userEmail}') returning *`);
	 
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
		if(yield cfs.exists('./public/uploads/'+userId)){
		console.log('exist!');folderexist="schon";}
        else{console.log('doesnt exist - moment mal');
        yield cfs.mkdir('./public/uploads/'+userId);
	    folderexist=true;
     }
	}catch(e){this.throw(400,e.message)}
	}
	 }catch(e){console.log(e);this.throw(400,e.message);}
	yield this.body={info:"OK",flagexist:folderexist,folderexist:folderexist,album:album.rows[0]};
	 
});


admin.post('/multipics', authed,function *(next){
if ('POST' != this.method) return yield next;
var parts=parse(this,{autoFields:true});
var part,stream;
var picsSammler={};
let db=this.db;
var i=0;
picsSammler.pics=[];

var fu={};

while(part=yield parts){
i+=1;
var user_email=parts.field.useremail;
var user_id=parts.field.user_id;
var alb_id=parts.field.album_id;
var alb_title=parts.field.album_title;
var alb_ids=parts.field.album_ids;

if(part.length){console.log(part)}
else{
stream= fs.createWriteStream(path.join('./public/uploads/'+user_id+'/', part.filename));
part.pipe(stream);
}

picsSammler.pics.push({['src'+i]: user_id+'/'+part.filename});
if(i==4){i=0;}
part.on('error',(er)=>{console.log('error in part ',er)})
stream.on('error',(er)=>{console.log('err in stream',er)})
stream.on('close',()=>{console.log('it looks like a close event in stream')})
stream.on('end',()=>{console.log('end stream')})
stream.on('finish',()=>{console.log('finish in a stream')})
}
console.log('picsSamler: ',picsSammler);
var chy=chunk(picsSammler.pics,4);
console.log('chy: ',chy);
console.log('chy length: ',chy.length);
//var alb_id='58a6dd5da18de009ae858ec2';
//var us_id='gru5@yandex.ru';
var dama=[];
for(var i=0;i<chy.length;i++)
{
var rama={};
var huirama={};
for(var k=0;k<4;k+=1){
Object.assign(rama,chy[i][k]);
}
console.log('rama src1: ',rama.src1);
var inod1=yield cfs.stat('./public/uploads/'+rama.src1);
console.log('inod: ',inod1.ino);
var inod2=yield cfs.stat('./public/uploads/'+rama.src2);
var inod3=yield cfs.stat('./public/uploads/'+rama.src3);
var inod4=yield cfs.stat('./public/uploads/'+rama.src4);
	
rama.id=shortid.generate();
rama.title="some title";
rama.alb_id=alb_id;
rama.us_id=user_email;
huirama.ino1=inod1.ino;
huirama.ino2=inod2.ino;
huirama.ino3=inod3.ino;
huirama.ino4=inod4.ino;
huirama.alb_title={[alb_title]:1};
huirama.alb_ids={[alb_ids]:1};
	console.log('alb_title: ',alb_title);
console.log('huirama: ',huirama);
rama.srama=huirama;
rama.created='now()';
dama.push(rama);
}
var jsdama=JSON.stringify(dama);
	console.log('rama.srama: ',rama.srama);
	console.log('huirama: ',huirama);
console.log('rama: ',JSON.stringify(dama));
try{
//insert into images(alb_id,alb_title,us_id,src1,src2,src3,src4) values('fed0','mama','gru5@yandex.ru',
yield db.query(`insert into images select * from json_populate_recordset(null::images,'${jsdama}') 
on conflict(src1) do update set srama=jsonb_set(images.srama,'{alb_title}',images.srama->'alb_title' || '${JSON.stringify(huirama.alb_title)}')`)
//srama=jsonb_set(srama,'{alb_ids}','[${JSON.stringify(alb_ids)}]')`)
}catch(e){console.log('err in db picssammler: ',e);}
yield this.body={inf:'ok',picssammler:picsSammler,dama:dama}
});

function chunk(arr, size){
var R=[];
for (var i=0,len=arr.length;i<len;i+=size){
R.push(arr.slice(i,i+size));}
return R;
}

admin.get('/getalbumlist',authed,function *(){
var db=this.fuck;
try{
var albums=wrap(db.get('fotoalbums'));
var folders;
var falschf
var album=yield albums.find({});
	
	 try{folders=yield fs.readdir('public/images/upload/'+album[0].user);
	 console.log('folders :',folders);}catch(err){console.log(err);}
	for(var i=0;i<album.length;i++){
	try{falschf=yield fs.readdir('public/images/upload/'+album[0].user+'/'+album[i]._id)}
	catch(err){console.log(err);
	console.log('falsch file :',falschf);
	try{var sa=yield albums.remove({_id:album[i]._id});console.log('sa :',sa);
	//yield doc.remove({_id:this.params.dataid});
	}catch(err){console.log('err in try of remove  :',err)}
	}}
	album=yield albums.find({});
	yield this.body={album:album,folders:folders}  
	}
	catch(err){yield this.body={err:err}}
})
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