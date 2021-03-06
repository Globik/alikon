'use strict';
const sluger=require('limax');
const bodyParser=require('koa-body');
const Router=require('koa-router');
const {encrypt,decrypt}=require('../libs/aes256gcm.js')(Buffer.from(process.env.BITAPS_KEY,'base64'))
const {readf,exists,stat,mkdir,writeFile}=require('../libs/await-fs.js');
const path=require('path');
//const moment=require('moment');
const walletValidator=require('wallet-address-validator');//0.1.0
const rk=require('request');

//const pub=new Router();


var admin=new Router();

function is_devel(b){
if(process.env.DEVELOPMENT=="yes"){
	if(!b){return false;}
	return true;
}else{return false;}
}
function rkw(obj){return new Promise(function(res,rej){
rk(obj,function(err,resp,body){
if(err)rej(err)
res({resp:resp,body:body})
})})
	}

admin.get('/dashboard', authed,async ctx=>{
ctx.body=await ctx.render('admin_dashboard',{});
})

/* **************************************************
   BITPAY PART
 *************************************************** */

admin.get('/dashboard/banners', authed, async ctx=>{
let db=ctx.db;
var result=null;
try{
var banners=await db.query(`select*from banners`);
if(banners.rows.length){result=banners.rows;
console.log('result: ',result);			   
					   }
}catch(e){console.log(e);}
ctx.body=await ctx.render('adm_dsh_banners',{banners:result});
})

/* *********************************
ADMIN_BITAPS_API
******************************** */
const cwa="1BMXmqU3fZ8PVjPbxgeenEX93YYf74bjeB";//persnl wall
admin.get("/dashboard/admin_bitaps",authed,async ctx=>{
let payment=ctx.payment,db=ctx.db,su=undefined, error=null,dmount=0;let mu=0;
	try{
	let bmount=await db.query("select count(*) from reedem")
	if(bmount.rows[0]){dmount=bmount.rows[0].count}
	let curd=await db.query("select * from reedem where rd_t='a'")
	if(curd.rows[0]){su=curd.rows[0];mu=curd.rows;}
	}catch(e){error=e}
	
ctx.body=await ctx.render('admin_bitaps',{payment,error,dbdec:mu,unencrypted:true,curd:su,cwa,dmount})
})

admin.post('/api/payment_system',authed,async ctx=>{
let {fn}=ctx.request.body,m,d;
if(!fn){ctx.throw(400,"No fname")}
try{
d=await readf(`./config/${fn}.json`,'utf8')
m=JSON.parse(d)
}catch(e){ctx.throw(400,e)}
ctx.body={info:ctx.request.body,m}
})


/* BITAPS */
admin.post('/admin/conf_bitaps_payment',auth,bodyParser({multipart:true,formidable:{}}),async ctx=>{
//console.log('ctx.tok_pack: ',ctx.tok_pack)
if(!ctx.tok_pack){ctx.throw(404,'no config file parameter found!')}
let {config}=ctx.tok_pack;
//console.log('fields: ',ctx.request.body.fields)
let fi=ctx.request.body.fields;
try{
let fi2=JSON.stringify(fi);
await writeFile(path.resolve(`./config/${config}.json`),fi2,'utf8');
}catch(e){ctx.throw(400,e);}
ctx.body={info:ctx.request.body.fields}
})

admin.post('/admin/uncache_what',auth,async ctx=>{
ctx.body={info:ctx.request.body}
})

const test_address="1Gdc5d6hKQnguxrkHmPYw4A1bP7rHAoSAs";// 34 
const test_invoice="invNetkQ1TTTk5y2Hw48JoSipULpgGewG2mskqmKtitwUJoSFT12V";// 53 
const test_redeem_code="BTCvb1EkcMq3UanuFacxRpW9Ei4ePLt9HQ8SXTgZVhSQFRA4NB7Le";// 53

const s2="https://bitaps.com/api/create/redeemcode";
const si='insert into reedem(rd_c,rd_adr, rd_inv) values($1,$2,$3) returning *'
admin.post('/api/create_redeem_code',auth,async ctx=>{

let db=ctx.db,decred,encred,dbdec;
let {ramount}=ctx.tok_pack;
if(!ramount){ctx.trow(400,"no romaunt from pay.json")}
let {parol}=ctx.request.body;
if(!parol){ctx.throw(400,"No parol provided.")}
try{
let rs=await db.query("select from reedem");
console.log('ramount: ',ramount)
if(rs.rowCount){
//if(rs.rowCount > ramount)ctx.throw(400,"More than "+ramount+"redeems not allowed. Try to delete one or more idempotent, passive, or rd_lm==rd_at")
}
}catch(e){ctx.throw(400,e)}
if(is_devel(true)){
console.log('DEVELOPING?')
try{
encred=encrypt(test_redeem_code,parol)
//red_c red_adr red_inv
dbdec=await db.query(si,[encred,test_address,test_invoice])
if(dbdec.rows[0] && dbdec.rows[0].rd_c){
decred=decrypt(dbdec.rows[0].rd_c,parol)

dbdec.rows[0].rd_c=decred
}
}catch(e){ctx.throw(400,e)}
}else{
console.log("It's PRODUCTION!")
let ops1={method:'get',url:s2};
try{
let a=await rkw(ops1)
let sak=JSON.parse(a.body);
	console.log('SAKA!: ',sak.address,'\n',sak.invoice)
let {address,redeem_code,invoice}=sak;
	
console.log('addrr: ',address,'\n redeem_code:\n',redeem_code,' inv:\n ',invoice)
encred=encrypt(redeem_code,parol)
//red_c red_adr red_inv
dbdec=await db.query(si,[encred,address,invoice])
if(dbdec.rows[0] && dbdec.rows[0].rd_c){
decred=decrypt(dbdec.rows[0].rd_c,parol)
dbdec.rows[0].rd_c=decred
}
}catch(e){ctx.throw(400,e)}
}	
ctx.body={"info":"OK",encred, 
htmlbody:await ctx.render('admin_v_bitaps_reedem',{dbdec:dbdec.rows,unencrypted:false})
		 }
})



admin.post('/make_rc_active',auth,async ctx=>{
let {rd_id,rd_t,cold_adr}=ctx.request.body;
if(!rd_id || !rd_t || !cold_adr)ctx.throw(400,"no rd_id or rd_t or cold_adr provided!")
let db=ctx.db;
let vali=walletValidator.validate(cold_adr,'bitcoin');
if(!vali){ctx.throw(400,'bitcoin cold_adr is not valid!')}
try{
//await db.query("update reedem set rd_t=$1, rd_cold_adr=$2 where rd_id=$3",[rd_t,cold_adr,rd_id])
await db.query("select bitaps_update_rd_type($1,$2,$3)",[rd_t,cold_adr,rd_id])
}catch(e){ctx.throw(400,e)}
ctx.body={info:`id ${rd_id} marked as active!`}
})

admin.get('/mid/:mister',async ctx=>{
	//ctx.throw(400,'uhu err')
ctx.body={info:ctx.params.mister}
})

admin.post('/admin/api/saveColdAdr',auth,async ctx=>{
	let {rd_id,cold_adr}=ctx.request.body;
	if(!rd_id || !cold_adr){ctx.throw(400,'no cold address or red_id to save!')}
	let vali=walletValidator.validate(cold_adr,'bitcoin');
	if(!vali){ctx.throw(400,'bitcoin cold_adr is not valid!')}
	let db=ctx.db;
	try{
	await db.query('update reedem set rd_cold_adr=$1,rd_lm=now() where rd_id=$2',[cold_adr,rd_id])
	}catch(e){ctx.throw(400,e)}
ctx.body={info:'ok'}
})
//const grund="https://bitaps.com/api/";
admin.post('/admin/check_balance_rc',auth,async ctx=>{
let {rc,enc,parol=undefined}=ctx.request.body;
	if(!rc || !enc){ctx.throw(400,'no rc or enc provided')}
	console.log('enc: ',enc)
	if(enc=='true'){
	if(!parol){ctx.throw(400,'no parol provided!')}
		try{
		rc=decrypt(rc,parol)
		}catch(er){ctx.throw(400,er)}
	}
	let b;
	let g=ctx.payment;
	if(!g){ctx.throw(400,'no pay conf')}
	let s2=g.grund+"get/redeemcode/info";
let data1={redeemcode:rc};
let ops1={method:'post',body:data1,json:true,url:s2};
	try{
		let a=await rkw(ops1)
		b=a.body;// it's not JSON!
		//console.log('a: ',b)
	}catch(e){ctx.throw(400,e)}
ctx.body={info:'ok',b}
})

admin.post('/admin/more_reedem',auth,async ctx=>{
let db=ctx.db;let res;
try{
res=await db.query('select*from reedem')
}catch(e){ctx.throw(400,e)}
ctx.body={htmlbody:await ctx.render('admin_v_bitaps_reedem',{dbdec:res.rows,unencrypted:true})}
})
admin.post('/admin/api/delete_redeem',auth,async ctx=>{
let {rdid,typ}=ctx.request.body;
if(!rdid){ctx.throw(400,'rdid is not provided.')}
let db=ctx.db;
try{
	//bitaps_delete_rd(rd_id int)
await db.query("select bitaps_delete_rd($1)",[rdid])
}catch(e){ctx.throw(400,e)}
ctx.body={info:"ok",del:rdid}
})
/* END BITAPS */

admin.post('/banner/set_banner', authed, async ctx=>{
let boss=ctx.boss;
var jobid_en=await boss.publish('banner_enable',{message:{ban_id:ban_id,href,src,title,type}},{startIn:ctx.request.body.start});
	//.then(jobid=>{
console.log(jobid_en);
ctx.body={info: ctx.request.body}
})

admin.get('/dashboard/articles',authed, async ctx=>{
let db=ctx.db;
	try{
	var posts=await db.query('select*from articles order by id desc limit 10');
	}catch(e){console.log('err in dashboard articles: ',e)}
ctx.body=await ctx.render('admin_dashboard_articles',{posts:posts.rows});
});

admin.post('/dashboard/article_create', authed, bodyParser({multipart:true,formidable:{}}), async ctx=>{
let db=ctx.db;
let locs=ctx.request.body.fields;
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
var post=await db.query(`insert into articles(title, slug, author,body) values('${locs.title}','${locs.slug}','${locs.author}','${locs.body}')`);
}catch(e){console.log('error :',e);ctx.throw(404,e);}
ctx.body=JSON.stringify(locs,post,null,2);
});
admin.get('/get_an_article/:dataid', authed, async ctx=>{
let db=ctx.db;
var post;
try{
post=await db.query(`select*from articles where id=${ctx.params.dataid}`)
 //console.log('Post: ',post.rows);
//{_id,title,slogan,sub_title,author,leader,body,tags,category,rubrik,part,description,type,status,slug,
//created_on,last_modified,date_url}; todo{checked{by,when},pic}
	}catch(e){ console.log('error find article: ',e);ctx.throw(404,e);}
ctx.body={post: post.rows[0]}
})
	
admin.post('/save_an_edited_post',authed, bodyParser({multipart:true,formidable:{}}), async ctx=>{
let db=ctx.db;
let locs=ctx.request.body.fields;
locs.slug=sluger(locs.title);
locs.last_modified='now()';
try{
//title,slug,author,last_modified,description,body,foto_cover,status,part
var result=await db.query(`update articles set ${bef_upd(locs)} where id=${locs.id}`);
}catch(e){console.log(e);ctx.throw(404,e);}
ctx.body={locs,result};
});

admin.post('/dashboard/save_editable_article', authed, async ctx=>{
let db=ctx.db;
let locs=ctx.request.body;
	console.log('locs: ',locs);
locs.slug=sluger(locs.title);
locs.last_modified='now()';
await db.query(`update articles set ${bef_upd(locs)} where id=${locs.id}`)
ctx.body={info:locs,moody:locs.slug}
})
function bef_upd(obj){
let s='';
let d=Object.entries(obj);
d.forEach((el,i)=>{
s+=`${i==0 ? '': ', '}${el[0]}='${el[1]}'`;
})
return s;
}

admin.post('/dashboard/save_img_content',authed, async ctx=>{
//save jsonb images within table articles ["content","quelle"]
let db=ctx.db;
var order=ctx.request.body.order;
var art_id=ctx.request.body.art_id;
var key=ctx.request.body.key;
var value=ctx.request.body.value;

try{
await db.query(`update articles set images=jsonb_set(images,'{${order},${key}}','"${value}"') where id=${art_id}`);
}catch(e){ctx.throw(400,e.message);}
ctx.body={info:"ok",body:ctx.request.body};
})

admin.get('/remove_an_article/:dataid',authed, async ctx=>{
let db=ctx.db;
console.log('dataid: ', ctx.params.dataid);
try{
await db.query(`delete from articles where id=${ctx.params.dataid}`);
}catch(e){console.log('error find article: ',e);ctx.throw(404,e);}
ctx.body={info:'OK. '+ctx.params.dataid+' is deleted'};
})

admin.get('/dashboard/articles/edit_photo/:article_id', authed, async ctx=>{
let db=ctx.db;
let post=null;

try{
var resultat=await db.query(`select*from articles where id=${ctx.params.article_id}`);
if(resultat.rows && resultat.rows[0]){
	post=resultat.rows[0];

}
}catch(e){
console.log(e)
}
ctx.body=ctx.render("adm_photo_gal",{});
})

//pics to the articles
admin.post('/dashboard/pics_to_post',authed, async ctx=>{
let db=ctx.db;
var result=null;
var resp={};
try{
var res=await db.query(`update articles set images='${JSON.stringify(ctx.request.body.images)}'
 where id=${ctx.request.body.article_id} returning id, slug, date_url`);
//console.log('resultat in dashb/piccs_to_post: ', result);
	//moment(date_url).format('YYYY-MM-DD')
	if(res && res.rows.length){
		resp.date_url=moment(res.rows[0].date_url).format('YYYY-MM-DD');
		resp.slug=res.rows[0].slug;
		resp.art_id=res.rows[0].id;
		result=resp;
		
	}
}catch(e){
ctx.throw(400,e.message);
}
ctx.body={info: ctx.request.body,result:result}
})

admin.post('/dashboard/albums_list', authed, async ctx=>{
let db=ctx.db;
var albums=null;
var user_email=ctx.request.body.user_email;
try{
var resultat=await db.query(`select*from albums where us_id='${user_email}'`)
if(resultat.rows){albums=resultat.rows;console.log('resultat: ',albums[0]);}
}catch(e){ctx.throw(400,e.message);}
ctx.body={albums:albums}
})

admin.post('/dashboard/albums_list/images',authed, async ctx=>{
let db=ctx.db;
var images=null;
var alb_id=ctx.request.body.alb_id;
try{
var resultat=await db.query(`select*from images where alb_id='${alb_id}'`);
if(resultat.rows && resultat.rows.length){images=resultat.rows;}
}catch(e){ctx.throw(400,e.message)}
ctx.body={images}
})
/* ************************  Albums  */
var parse=require('co-busboy');
const shortid=require('shortid');

admin.get('/dashboard/albums', authed, async ctx=>{
let db=ctx.db;
const albums=null;
try{
var result=await db.query(`select*from albums`)
if(result.rows && result.rows[0]){albums=result.rows;}
}catch(e){console.log(e)}
ctx.body=await ctx.render('albums',{albums});
});

admin.get('/dashboard/albums/:alb_id/:alb_title', async ctx=>{
let photos=null;
let db=ctx.db;
try{
var result=await db.query(`select*from images where alb_id='${ctx.params.alb_id}'`);
//var result=yield db.query(`select*from images inner join albums on alb_id=albums.id where alb_id='${this.params.alb_id}'`);
if(result.rows && result.rows[0]){photos=result.rows;console.log('resultat: ',result.rows);}
}catch(e){console.log(e)}
ctx.body=await ctx.render('album_view',{photos,alb_id:ctx.params.alb_id,alb_title:ctx.params.alb_title});
})

admin.get('/dashboard/articles_manager', authed, async ctx=>{
	
ctx.body=ctx.render('articles_manager',{});
});

admin.post('/create_album',authed, async ctx=>{
	let db=ctx.db;
	//var docs=wrap(db.get('fotoalbums'));
	let id=shortid.generate();
	let title=ctx.request.body.title;
	let userId=ctx.request.body.userId;
	let userEmail=ctx.request.body.userEmail;
	var multi=ctx.request.body.multi;
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
album=await db.query(`insert into albums(id, alb_title, us_id) values('${id}','${title}', '${userEmail}') returning *`);
	 
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
		if(await cfs.exists('./public/uploads/'+userId)){
		console.log('exist!');folderexist="schon";}
        else{console.log('doesnt exist - moment mal');
        await cfs.mkdir('./public/uploads/'+userId);
	    folderexist=true;
     }
	}catch(e){ctx.throw(400,e.message)}
	}
	 }catch(e){console.log(e);ctx.throw(400,e.message);}
	ctx.body={info:"OK",flagexist:folderexist,folderexist:folderexist,album:album.rows[0]};
	 
});


admin.post('/multipics', authed, async (ctx)=>{
//if ('POST' != this.method) return yield next;
var parts=parse(ctx,{autoFields:true});
var part,stream;
var picsSammler={};
let db=ctx.db;
var i=0;
picsSammler.pics=[];

var fu={};

while(part=await parts){
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
var inod1=await cfs.stat('./public/uploads/'+rama.src1);
console.log('inod: ',inod1.ino);
var inod2=await cfs.stat('./public/uploads/'+rama.src2);
var inod3=await cfs.stat('./public/uploads/'+rama.src3);
var inod4=await cfs.stat('./public/uploads/'+rama.src4);
	
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
await db.query(`insert into images select * from json_populate_recordset(null::images,'${jsdama}') 
on conflict(src1) do update set srama=jsonb_set(images.srama,'{alb_title}',images.srama->'alb_title' || '${JSON.stringify(huirama.alb_title)}')`)
//srama=jsonb_set(srama,'{alb_ids}','[${JSON.stringify(alb_ids)}]')`)
}catch(e){console.log('err in db picssammler: ',e);}
ctx.body={inf:'ok',picssammler:picsSammler,dama:dama}
});

function chunk(arr, size){
var R=[];
for (var i=0,len=arr.length;i<len;i+=size){
R.push(arr.slice(i,i+size));}
return R;
}

admin.get('/getalbumlist',authed, async ctx=>{
var db=ctx.fuck;
try{
var albums=wrap(db.get('fotoalbums'));
var folders;
var falschf
var album=await albums.find({});
	
	 try{folders=await fs.readdir('public/images/upload/'+album[0].user);
	 console.log('folders :',folders);}catch(err){console.log(err);}
	for(var i=0;i<album.length;i++){
	try{falschf=await fs.readdir('public/images/upload/'+album[0].user+'/'+album[i]._id)}
	catch(err){console.log(err);
	console.log('falsch file :',falschf);
	try{var sa=await albums.remove({_id:album[i]._id});console.log('sa :',sa);
	//yield doc.remove({_id:this.params.dataid});
	}catch(err){console.log('err in try of remove  :',err)}
	}}
	album=await albums.find({});
	ctx.body={album:album,folders:folders}  
	}
	catch(err){ctx.body={err:err}}
})
/* ************************************************************************
   CABINET_ADMIN
   *********************************************************************** */
admin.get('/dashboard/cabinet_admin', authed, async ctx=>{
	let db=ctx.db;
	var result=null;
	ctx.session.dorthin=ctx.path;
	try{
	var ob=await db.query(`select popa()`);
		if(ob.rows.length !==0){
		console.log('result: ',ob.rows[0].popa);
			result=ob.rows[0].popa;
		}
	}catch(e){console.log(e);}
	//select sum(amt_tok) as total from conv
ctx.body=ctx.render('cabinet_admin',{ledge:result})
})
admin.get('/dashboard/get_to_payments_list',auth, async ctx=>{
let db=ctx.db;
var result=null;
try{
var pa=await db.query(`select conv.us_id, conv.amt_tok, conv.proz, conv.status, conv.at, conv.lmod, cardi.addr
from conv inner join cardi on conv.us_id=cardi.us_id where status='waiting' order by at desc limit 4`)
if(pa.rows){
result=pa.rows;
console.log('result: ',result);
		}
}catch(e){ctx.throw(400,e.message);}	
ctx.body={content:ctx.render('vidget_admin_topayments',{data:result})};
})
admin.post('/dashboard/cabinet_admin/page',auth, async ctx=>{
	let db=ctx.db;
	var result=null;
	var {next}=ctx.request.body;
try{var pa=await db.query(`select conv.us_id, conv.amt_tok, conv.proz, conv.status, conv.at, conv.lmod, cardi.addr
from conv inner join cardi on conv.us_id=cardi.us_id where conv.status='waiting' and conv.at < '${next}'::timestamp 
order by at desc limit 4`);
   if(pa.rows){result=pa.rows;console.log('results: ',result);}
   }catch(e){ctx.throw(400,e.message)}
this.body={body:ctx.request.body,content:ctx.render('vidget_admin_topayments',{data:result})}
})

admin.post('/dashboard/cabinet_admin/set_payment',auth, async ctx=>{
let db=ctx.db;
	/*var amttok=el.getAttribute('data-amttok'),
    var usd=el.getAttribute('data-usd'),
    sumbc=el.getAttribute('data-sumbc');
   // proz=el.getAttribute('data-proz'),
    //dtime=el.getAttribute('data-dtime'),
    //status=el.getAttribute('data-status'),
    //us_id=el.getAttribute('data-usid'),
    //addr=el.getAttribute('data-addr');*/
let {usid, status, amttok, usd, sumbc, proz, addr}=ctx.request.body;
	//busers convi payouts
	try{
	await db.query('begin');
	await db.query(`update conv set status='complete' where us_id='${usid}'`);
		//us_id, status,amt_tok,amt_usd,amt_bc,proz,adr
	await db.query(`insert into payouts(us_id, status, amt_tok, amt_usd, amt_bc, proz, adr) 
    values('${usid}', '${status}', ${amttok}, ${usd}, ${sumbc}, ${proz}, '${addr}')`);
    await db.query(`update busers set items=items-${amttok} where name='globik'`);
    await db.query('commit');
	}catch(e){
		await db.query('rollback');
		ctx.throw(400,e.message);}
ctx.body={body:ctx.request.body}
})
admin.post('/api/get_abuse_list',auth,async ctx=>{
let db=ctx.db;
console.log('body: ',ctx.request.body)
let {nieder=''}=ctx.request.body;
	console.log('NIEDER!: ',nieder)
let s=`select abuse.*,busers.name from abuse left join busers on abuse.abus_id=busers.id where abuse.ab_type='neu'
${nieder?`and ab_at > '${nieder}'`:''} limit 14`;
let s1=1;
try{
var r=await db.query(s);
	console.log('resultat: ',r.rows)
}catch(e){console.log(e);ctx.throw(400,e.name)}
//let a=await ctx.render('adm_abuse_list',{abuse_list:r.rows})
ctx.body={abuse_list:r.rows}		   
})

admin.post('/api/set_ban_user_two',auth,async ctx=>{
let db=ctx.db;
//banned_users(bn_us_id,bn_us_by,bn_status,bn_cmt,bn_slc)
let {bn_us_id,bn_us_by,bn_cmt,bn_slc,bn_status,is_banned}=ctx.request.body;
if(is_banned)ctx.throw(400,'This user already is banned!')
let result;
try{
result=await db.query('insert into banned_users(bn_us_id,bn_us_by,bn_slc,bn_cmt,bn_status) values($1,$2,$3,$4,$5) returning ban_id',[bn_us_id,bn_us_by,bn_slc,bn_cmt,bn_status]);
}catch(e){console.log(e);this.throw(400,e.name);}
ctx.body={info:'OK. This user is banned!',bstatus:2,result:result.rows[0]}
})

admin.post('/api/skip_ban_user',auth,async ctx=>{
let db=ctx.db;
let {abus_id}=ctx.request.body;
try{
await db.query('delete from abuse where abus_id=$1',[abus_id])
}catch(e){console.log(e);ctx.throw(400,e.name)}	
ctx.body={info:"OK. Abuse deleted"}
})

admin.post('/api/ban_out_user',auth,async ctx=>{
let db=ctx.db;
// model_id,bn_status='no',bstatus='end',ban_id
let {model_id,bn_status,bstatus,ban_id}=ctx.request.body;
try{
await db.query('update banned_users set bn_status=$1,bstatus=$2,bn_last_edit=now() where ban_id=$3',[bn_status,bstatus,ban_id]);
}catch(e){console.log(e);ctx.throw(400,e.name);}
ctx.body={info:"OK. This user banned out."}
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
function auth(ctx,next){
if(ctx.isAuthenticated() && ctx.state.user.role=="superadmin"){return next()}else{ctx.throw(401, "Please log in.")}}
function authed(ctx, next){
if(ctx.isAuthenticated() && ctx.state.user.role == "superadmin"){return next()}else{ ctx.redirect('/');}}