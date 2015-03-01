'use strict';
var koa=require('koa');
var app=koa();

app.use(function *(){
  this.body = 'Hello Body!';
});

if(process.env.NODE_ENV === 'test'){
module.exports=app.callback();}
else{

console.log(3000);
app.listen(3000);}