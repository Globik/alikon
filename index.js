-){var mdl=yield mods.findOne({modulname:"aside"});console.log('mdl.status :',mdl.status);yield next;});***/
/*var options={
serveClientFile:true,
clientFilePath:'/koaws.js',
heartbeat:true,
heartbeatInterval:5000};
app.use(koaws(app,options));
app.ws.register('hello',function *(){this.result('world!');});
*/
var low = require('lowdb')
var lowdb = low('db.json')
//lowdb('posts').push({ title: 'home',href:'/'});
//var qu=lowdb('posts').find({title:'lowdb is awesome'});
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
getgi(){return 1;},
* showmodule(){try{var mn=yield fs.readFile('app.json','utf-8');

return mn;}catch(e){console.log(e);}},
path:function (){var b;if(this.method === 'GET'){b=this.path} return b;},
signup:function *(){try{
var mdsignup=yield db.collection('modules').findOne({modulname:"signup"});
return mdsignup.status} catch(err){}},
module:function *(){try{
var mdl=yield mod.findOne({modulname:"aside"});return mdl.status}catch(err){}} ,
ip: function *(){yield wait(100);return this.ip;},
menu:[{name:"home",href:'/'},{name:"articles",href:"/articles"},{name:"labs",href:"/labo"}]
};
const {esc_html,esc2_html,html_pretty,js_pretty,css_pretty,advec}=require('./libs/filters.js');
var {script}=require('./libs/filter_script.js');
const filters={
    format: time => time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate(),
	subtime:date =>{var mate=moment(date);return mate.format('MMM D, YYYY');},
	js_pretty,esc_html,esc2_html,css_pretty,html_pretty,aprecoded: advec};
 render(app,{})
app.use(serve(__dirname+'/public'));
/*app.use(function *(next){
  const start = new Date;
  yield next;
  const ms = new Date - start;
  console.log(`${this.method} ${this.url} - ${ms}ms`);
});*/
-
//2. create an user administrator for a single database
use todo
db.createUser({
	user:'todouseradmin',
	pwd:'admin',
	roles:[{role:'userAdmin',db:'todo'}]
})
//undone***/
/*
cd mon3/bin
mongod -dbpath ../data/db

*/