var koa=require('koa');
var app=koa();
var bodyParser=require('koa-body');
var Router=require('koa-router');
var secured=new Router();

secured.get('/app',authed,function *(){
var body= this.req.user.username;
console.log('this.req.user.username in app: '+body);
yield this.render('app',{user:this.req.user});});

secured.post('/gamma',bodyParser({multipart:true,formidable:{}}),
function *(next){
	
console.log('this.request.body.fields: ',this.request.body.fields);
this.body=JSON.stringify(this.request.body,null,2);
this.body={"OK":"2222 formidable","was namlich":this.request.body.fields}
yield next;}
);

function *authed(next){
if(this.req.isAuthenticated()){
 
yield next;}
else{ this.redirect('/');}}
module.exports=secured;