'use strict';

//var crypto=require('crypto');
const koa=require('koa');
const render=require('koa-ejs');
const path=require('path');
var wait=require('co-wait');
var logger=require('koa-logger');
var serve=require('koa-static');
//var route=require('koa-route');
//var Router=require('koa-router');
var flash=require('koa-flash');
var koaws=require('koa-ws');
var moment=require('moment');
//var parse=require('co-body');
//var bodyParser=require('koa-bodyparser');
var bodyParser=require('koa-body');
var session=require('koa-generic-session');
var MongoStore=require('koa-generic-session-mongo');

var passport=require('koa-passport');
var fs=require('co-fs');
var fuckall=require('./routes/database');
var secured=require('./routes/secured');
var configDB=require('./config/database.js');

var monk=require('monk');
var wrap=require('co-monk');
  //var db=module.exports=monk('mongodb://127.0.0.1:27017/todo');
  
  //poe
  var db=module.exports=monk(configDB.url || configDB.localurl);//prod
  //var db=module.exports=monk(process.env.MONGOHQ_URL_TEST); //remote test
  var Agenda=require('agenda');
  
  var agenda=new Agenda({db:{address:configDB.url || configDB.localurl}});//prod
  //var agenda=new Agenda({db:{address:process.env.MONGOHQ_URL_TEST}});//remote test
 

/***	
var status;
agenda.on('start', function(job) {
	
  console.log("Job %s starting", job.attrs.name);
  //status=job.attrs.name;
  //return status;
  
});
***/
//console.log(status);


/***
exports.showMessage=function(agenda){
agenda.define('show message',function(job,done){
console.log('Shows message.');
done();
});
}***/
//collection from mongodb: db.agendaJobs.find()
  /***
 //var db=monk(process.env.MONGOHQ_URL,{w:1});***/
 //var jobSchedule=require('./routes/job-schedule.js');
    // jobSchedule.setupJobs("fucker");
//console.log("string: "+jobSchedule.setupJobs("fucker"));



//iojs index
//var us=wrap(db.get('users'));


require('./config/passport')(passport);

var app=koa();
var mods=wrap(db.get('modules'));
    /***
	app.use(function *(next){
		var mdl=yield mods.findOne({modulname:"aside"});
		console.log('mdl.status :',mdl.status);
		yield next;
	});***/
var options={
serveClientFile:true,
clientFilePath:'/koaws.js',
heartbeat:true,
heartbeatInterval:5000};
app.use(koaws(app,options));
app.ws.register('hello',function *(){
this.result('world!');
});
/***
on client use koaws js
 koaws.register('session', function (err, payload) {
        if (err) console.error('Something went wrong', err);
        console.log(payload) // should include our session
    });

Connect to the server:

    koaws.connect();

    koaws.method('hello', function (err, result) {
        if (err) console.error('Something went wrong', err);
        console.log(result) // should log 'world!'
    });

***/
var low = require('lowdb')
var lowdb = low('db.json')
//lowdb('posts').push({ title: 'home',href:'/'});
//var qu=lowdb('posts').find({title:'lowdb is awesome'});
//console.log('LOWDB :',qu);

var locals={
version:'0.0.1',
site_name:"Atariku",
site_creator:"Globik",
site_url:"http://alikon.herokuapp.com",
main_site_description:"Attariku blog codelab",
fb_app_id:"833998660009097",
fb_admins:"100002318783216",
og_plugin:true,
schema_plugin:true,
shema_canonical_href:"http://alikon.herokuapp.com/",
message:'message must be',
somefunc:"alert('some Func')",
ldb:function *(){try{var s=yield fs.readFile('db.json','utf-8');return JSON.parse(s);}
catch(err){console.log('LOWDB API err :',err);}},
path:function (){var b;if(this.method === 'GET'){b=this.path} return b;},
signup:function *(){try{
	var mdsignup=yield mods.findOne({modulname:"signup"});
return mdsignup.status} catch(err){
	//console.log(err);
}
},
module:function *(){try{
		var mdl=yield mods.findOne({modulname:"aside"});
//console.log('mdl.status :'+ mdl.status);
return mdl.status}catch(err){
	//console.log('err :'+err);
	}} ,
ip: function *(){
yield wait(100);
return this.ip;},
menu:[{name:"home",href:'/'},{name:"articles",href:"/articles"},{name:"labs",href:"/labo"}]
};
var esc2_html = n => n.replace(/</g,"&lt;").replace(/>/g,"&gt;");
var esc_atrs=s=> s.replace(/(\w+)="(.*?)"/g,`<span class=brown>$1</span>=<span class=green>"$2"</span>`);
var html_pretty = ns => {return ns.replace(/&lt;(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^(&gt;)\s]+))?)*)\s*(\/?)&gt;/g,
(s,p1,p2,p3,ofs) =>{
return `<span class=orange>&lt;</span>
<span class=blue>${p1}</span>${esc_atrs(p2)}<span class=violet>${p3}</span><span class=orange>></span>`;})
.replace(/((&lt;)\/(\w+)(&gt;))/g,`<span class="orange">$2</span>
<span class=violet>/</span><span class=blue>$3</span>
<span class=orange>$4</span>`).replace(/\b(disabled)\b/g,`<span class=red>$1</span>`).replace(/(&lt;\!--[\S\s]*?--&gt;)/g,`<span class=green>$1</span>`).replace(/\n/g,'');
}


var esc_html= n => n.replace(/([\'])/g,`&apos;`)
.replace(/([\"])/g,`&quot;`)
.replace(/(<(.*?)>)/g,(str,p1,p2,ofs,s)=> `&lt;${p2}&gt`);
var js_pretty= tex =>{
return tex.
replace(/\b(function|var|if|in|of|return)\b/g,`<span class='blue'>$1</span>`)
.replace(/\b(i|k|l|m)\b/g,`<span class='one-fit'>$1</span>`)
.replace(/("[^"]*")/g,`<span class='dbqw'>$1</span>`)
.replace(/(\d+|\.\d+|\d+\.\d*)/g,`<span class='zifra'>$1</span>`)
.replace(/(\/\/.*|\/\*[^]*?\*\/)/g,`<span class='comments'>$1</span>`)
.replace(/(\{|\}|\]|\[|\|)/g,`<span class='figskobki'>$1</span>`)
.replace(/(new)\s+(.*)(?=\()/g,`<span class='constructor'><b>$1</b> $2</span>`)
.replace(/\.(push|length|getElementById|getElementsByClassName|innerHTML|textContent|querySelector)/g,
`<span class='attribute'>.$1</span>`)
.replace(/(&apos;[\s\S]*?&apos;)/g,`<span class="kavichki">$1</span>`)
.replace(/(&quot;[^"]*?&quot;)/g,`<span class="dbquot">$1</span>`)
}
var css_pretty= n =>
 n.replace(/(\/\*[\s\S]*?\*\/)/gm,`<span class="orange">$1</span>`)
.replace(/(\.[\w\-_]+)/g,`<span class="yellow">$1</span>`)
.replace(/(\#[\w\-_]+)/g,`<span class="blue">$1</span>`)
.replace(/\b(pre|textarea)\b/g,`<span class="green">$1</span>`)
.replace(/(\{|\}|\]|\[|\|)/g,`<span class='figskobki'>$1</span>`)
.replace(/(:[\w\-_]+)/g,`<span class="brown">$1</span>`)
.replace(/(\d+|\.\d+|\d+\.\d*)/g,`<span class='blue'>$1</span>`);

const filters={
    format: time => time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate(),
	subtime:date =>{var mate=moment(date);return mate.format('MMM D, YYYY');},
	js_pretty,
    esc_html,
	esc2_html,
    css_pretty,
	html_pretty,
    aprecoded: se => {
	let shortcodename='$REKLAMA';
	let reg=new RegExp(`\\${shortcodename}`,`g`);
var ba=se.replace(reg,`Some box:<sector role='note' class='reklamabox' itemscope itemtype="http://schema.org/WPAdBlock">
<meta itemprop="name" content="Adsense for pagetitle"/>
<meta itemprop="name" content="Support Atariku by using Adsense and other advertisments."/>
<div class="reklamabox">My AD block.</div></sector>`);
var ab=ba.replace(/<pre class="(.*?)">([\s\S]*?)<\/pre>/g,(str,p1,p2,ofs,s) => {
if(p1=="pre-code-js"){return `<pre class="pre-code-js">${js_pretty(esc_html(p2))}</pre>`;}
else if(p1=="pre-code-css"){return `<pre class="pre-code-css">${css_pretty(p2)}</pre>`}
else if(p1=="pre-code-html"){return `<pre class="pre-code-html">${html_pretty(esc2_html(p2))}</pre>`}
else{return "";}
});
return ab;
}
 };
 
 /*
var css_pretty= n =>
 n.replace(/(\/\*[\s\S]*?\*\/)/gm,`<span class="orange">$1</span>`)
.replace(/(\.[\w\-_]+)/g,`<span class="yellow">$1</span>`)
.replace(/(\#[\w\-_]+)/g,`<span class="blue">$1</span>`)
.replace(/\b(pre|textarea)\b/g,`<span class="green">$1</span>`)
.replace(/(\{|\}|\]|\[|\|)/g,`<span class='figskobki'>$1</span>`)
.replace(/(:[\w\-_]+)/g,`<span class="brown">$1</span>`)
.replace(/(\d+|\.\d+|\d+\.\d*)/g,`<span class='blue'>$1</span>`);
*/

render(app,{
root:path.join(__dirname,'view'),
layout:'template',
viewExt:'html',
cache:false,
debug:true,
filters:filters});



app.use(serve(__dirname+'/public'));
app.use(logger());
app.keys=['fg'];

 //remote db test:
 //app.use(session({store:new MongoStore({url:process.env.MONGOHQ_URL_TEST+"/alikon-fantastic-database"})}));
 app.use(session({store:new MongoStore({url:configDB.url || configDB.localurl})}));
 //app.use(session({store:new MongoStore({url:configDB.newUrl})}))
 
app.use(passport.initialize());
app.use(passport.session());
//app.use(Router(app));
app.use(bodyParser());

app.use(flash());
 //iojs index
 app.use(function *(next){this.state=locals;yield next;})
 app.use(function *(next){this.lowdb=lowdb;yield next;})
app.use(function *(next){
this.fuck=db;
yield next;});

app.use(function *(next){
	this.agenda=agenda;
	yield next;
});
app.use(function *(next) {
  switch (this.path) {
  case '/get':
    get.call(this);
    break;
  case '/remove':
    remove.call(this);
    break;
default:yield next;
  }
});
//iojs index

function get() {
  var session = this.session;
  session.count = session.count || 0;
  session.count++;
  this.body = session.count;
}
function remove() {
  this.session = null;
  this.body = 0;
}

var gu=0;
app.use(function *(next) {

  if (this.method === 'POST') {
    this.flash = { error: 'This is a flash error message.' };
	console.log('sess dorth in apuse :'+this.session.dorthin);
  } else
  if (this.method === 'GET') {
	  
	  //console.log(this.flash.error); 
	  console.log("This path in ap use",this.path);
	  console.log('this.session.err :',this.message);
	  //console.log("THIS FLASH FUCKER : ",this.flash.fucker);
	  this.flash={woane:this.path,views:gu};gu++;
	 
	  //console.log('Flash in Index :',this.flash.views)
  } 
  yield next;
});
//node index
app.use(fuckall.middleware());
app.use(secured.middleware());
app.use(function *(){
	this.message=this.session.err;
	this.status=302;this.redirect('/');
})

/*app.use(function *(next){
if(404 !=this.status) return;
	this.status=404;
	//console.log('NOW status :',this.status+':'+this.flash.fucker)
	yield this.render('/error-view',{err:this.message,fly:this.flash.fucker,status:this.status,user:this.req.user});
})*/


app.on('error',function(err){
	console.log('some err in app on error :', err.message)
})
if(process.env.NODE_ENV === 'test'){
module.exports=app.callback();}
else{

console.log(3000);
app.listen(process.env.PORT || 3000);}
/***
3. mongod --dbpath ../data/db --auth
4. mongo --port 27017 -u manager -p admin --autheticationDatabase admin?
use admin
//1. create a system user administrator
db.createUser({
	user:"admin",//siteUserAdmin
	pwd:"admin",
	roles:[{role:'userAdminAnyDatabase',
	db:'admin'}]
})
//done
//check: db.getUser("admin")
//2. create an user administrator for a single database
use todo
db.createUser({
	user:'todouseradmin',
	pwd:'admin',
	roles:[{role:'userAdmin',db:'todo'}]
})
//undone
***/
