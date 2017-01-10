'use strict';
const koa=require('koa');
const render=require('./libs/render.js');
const path=require('path');
var url=require('url');
var Pool=require('pg-pool');
var serve=require('koa-static');
//var flash=require('koa-flash');
//r PS=require('pg-pubsub');
var PS=require('./libs/pg-subpub.js');
var bodyParser=require('koa-body');
var session=require('koa-generic-session');
//var PgStore=require('koa-pg-session');
var PgStore=require('./pg-sess.js');
var passport=require('koa-passport');
var fs=require('co-fs');
var pubrouter=require('./routes/pubrouter2.js');
//var adminrouter=require('./routes/admin2.js');
var configDB=require('./config/database.js');

var {script}=require('./libs/filter_script');
var locals={
* showmodule(){try{var mn=yield fs.readFile('app.json','utf-8');
	return mn;}catch(e){console.log(e);}}
};
 var database_url=configDB.pg_local_heroku_url;
//var database_url=configDB.pg_url;//'postgres://globik:null@localhost:5432/postgres';
console.log('database_url: ',database_url);
console.log('process.env.DEVELOPMENT and DEV_USER: ',/*process.env.DEVELOPMENT,*/process.env.DEV_PWD);
var pars=url.parse(database_url);
var cauth=pars.auth.split(':');
console.log('user auth[0] ', cauth[0]);
console.log('pwd auth[1] ', cauth[1]);
console.log('host: ',pars.hostname);
console.log('port: ',pars.port);
console.log('db name: ',pars.pathname.split('/')[1]);
var pconfig={
user:cauth[0],
password:cauth[1],
host:pars.hostname,
port:pars.port,
database: pars.pathname.split('/')[1],
ssl:true};
var api_key, domain=null;
if(process.env.DEVELOPMENT=="yes"){
api_key=process.env.TMAILGUNAPIKEY;
console.log('mailgun api key: ', api_key);

domain=process.env.TMAILGUN_DOMAIN;
console.log('mailgun domain: ', domain);
}else{
	api_key=process.env.MAILGUN_API_KEY;
	domain=process.env.MAILGUN_DOMAIN;
}
var mailgun=require('mailgun-js')({apiKey: api_key, domain:domain});

var app=koa();
var pool=module.exports=new Pool(pconfig);

require('./config/passport2.js')(pool, passport);

var pg_store=new PgStore(pool);
//var pg_store=new PgStore(database_url);
render(app,{})
app.use(serve(__dirname+'/public'));
app.keys=['fg'];
app.use(session({store:pg_store}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(flash());
var lasha=true;
app.use(bodyParser());

app.use(function*(next){
if(this.method ==='POST'){
//this.flash={error:'flash err'};
}else if(this.method==='GET'){
//this.flash.woane=this.path;
	//this.session.dorthin=this.path;
	console.log('this.session.dorthin: ',this.session.dorthin);
}
yield next;});
var mobject={};
app.use(function*(next){
this.state.filter_script=script;
	this.db=pool;
var sa;
if(lasha){sa=yield locals.showmodule();
sa=JSON.parse(sa);
mobject.showmodule=sa;
lasha=false;
}

this.state.showmodule=mobject.showmodule;
this.state.showmodulecache=lasha;
if(this.path=='/module_cache'){
lasha=true;}
yield next;
});
app.use(pubrouter.routes());
//app.use(adminrouter.routes());

app.use(function*(){
//this.message=this.session.err;
	//console.log('this session.err: ',this.session.err);
this.status=404;//??
//this.redirect('/');

});

app.on('error',(err, ctx)=>{
console.log('app.on.error: ',err, ctx.request.url);
});

pg_store.on('connect',()=>console.log('PG_STORE IS CONNECTED!!!'));
pg_store.setup().then(()=>{
	console.log('soll listnening port 5000 via setup()');
app.listen(process.env.PORT || 5000)
});
console.log('soll on 5000');

pool.on('connect',client=>console.log('pool connected'));
pool.on('error',(err, client)=>console.log('error in pool: ', err.message));
pool.on('acquire', client=>console.log('pool acquired '));


var ps=new PS(database_url+'?ssl=true');
ps.addChannel('reset',function(msg){
	console.log('msg2: ',msg);
var mgdata={
from: 'Excited users <me@samples.mailgun.org>',
to:msg.email,
subject:'Password '+msg.token_type,
text:`You are receiving this because you (or someone else) have requested the reset of 
the password for your account. 
Please click on the following link, or paste this into your browser to complete the process:
http://localhost:5000/reset/${msg.token}
<a href="alikon.herokuapp.com/reset/${msg.token}">https://alikon.herokuapp.com/reset/${msg.token}
If you did not request this, please ignore this email and your password will remain unchanged.`
};

mailgun.messages().send(mgdata, function(error, body){
if(error) console.log('error: ',error);
console.log('Body: ', body);
});


});

pool.query('LISTEN reset');
