var Router=require('koa-router');
var bodyParser=require('koa-body');
var wrap=require('co-monk');

var fuckall=new Router();

fuckall.get('/insert2',function *(){
var db=this.fuck;
var admin=wrap(db.get('users'));
try{
var res=yield admin.findOne({username:"Bob"});

//var res=yield db.findOne({username:"Bob"});
console.log('db :'+res.username);}catch(er){console.log("error in username :"+er);}
/*
var busers = db.get('users');
busers.findOne({username:"Bob"}).on('success',function(doc){
console.log('Document',doc);
console.log(doc.username);
//_id: 54c7815186d37cb8a2f49639

});
*/
//console.log('this.path in insert2 :'+this.path);
//console.log('this url :'+this.url);
//var dorthin=this.session;
//console.log("this.flash.otkuda in insert2: "+this.flash.otkuda);
this.session.dorthin=this.path;
//this.session.dorthin=null;
//this.flash={woane: this.path};
//console.log('this.req.user in insert2 :'+this.req.user);
yield this.render('insert2',{user:this.req.user});
});
//iojs index
fuckall.get('/alfa',function *(){
	//var result=this.req.mata;
 //console.log('result:'+result);
	yield this.body={str:"OK xhr"};});

fuckall.post('/gamma',bodyParser({multipart:true,formidable:{}}),
function *(next){
	
console.log('this.request.body.fields: ',this.request.body.fields);
this.body=JSON.stringify(this.request.body,null,2);
this.body={"OK":"2222 formidable"}
yield next;}
);

module.exports=fuckall;