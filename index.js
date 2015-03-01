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

app.use(function *(){
  this.body = 'Hello Body!';
});

if(process.env.NODE_ENV === 'test'){
module.exports=app.callback();}
else{

console.log(3000);
app.listen(process.env.PORT || 3000);}