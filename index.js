'use strict';
var koa=require('koa');
var render=require('koa-ejs');
var path=require('path');
var wait=require('co-wait');
var logger=require('koa-logger');
var route=require('koa-route');
var parse=require('co-body');
var monk=require('monk');
var wrap=require('co-monk');
 //var db=monk("mongodb://localhost:27017/todo");
 var db=monk(process.env.MONGOHQ_URL,{w:1});
var tasks=wrap(db.get('tasks'));
var app=koa();

var locals={
version:'0.0.1',
now:function(){
return new Date();},
ip: function *(){
yield wait(100);
return this.ip;}
};
var filters={
    format: function *(time){
    return time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate();
 }};

render(app,{
root:path.join(__dirname,'view'),
layout:'template',
viewExt:'html',
cache:false,
debug:true,
locals:locals,
filters:filters});

app.use(logger());


var db = {
  tobi: {id:1, name: 'tobi', species: ['ferret','kino'] },
  loki: {id:2, name: 'loki', species: ['internet','theater'] },
  jane: {id:3, name: 'jane', species: ['sport','lesen'] }
};
var users=[{name:'Dead Horse'},{name:'Jack'},{name:'Tom'}];

var pets = {
  list: function *(){
//var names = Object.keys(db);
  var dbs=db;
    yield this.render('show',{pets:dbs,users:users});
  },

  show: function *(name){
    var pet = db[name];
    if (!pet) return this.error('cannot find that pet', 404);
    yield this.render('sh',{pets:"1"});
  }
};

app.use(route.get('/show/:name',getUser));

function *getUser(name){
var user=db[name];

 if(!user) this.throw(404,'invalid user name');
console.log(user);
yield this.render('showName',{user:user.name});
};

app.use(route.get('/show',pets.list));

// logger

app.use(route.get('/', function *(){
var users=[{name:'Dead Horse'},{name:'Jack'},{name:'Tom'}];
var tslist=yield tasks.find({});
console.log(tslist);
yield this.render('content',{users:users,tslist:tslist});

  //var start = new Date;
  //yield next;
  //var ms = new Date - start;
  //console.log('%s %s - %s', this.method, this.url, ms);
}));

/***
app.use(function *(){
  this.body = 'Hello Body!';
});
***/

if(process.env.NODE_ENV === 'test'){
module.exports=app.callback();}
else{

console.log(3000);
app.listen(process.env.PORT || 3000);}