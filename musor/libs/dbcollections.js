'use strict';
//var db=require('../index');
//var mongojs=require('mongojs');
//var db=mongojs('todo');
var mongo = require('mongoskin');
//var MongoClient=require('mongodb').MongoClient;
var url="mongodb://127.0.0.1:27017/todo";
var db = mongo.db(url,{native_parser:true});
/*
var db=MongoClient.connect(url).then(function(d){console.log("DEBIL :",d)},function(e){});
*/
class Model{constructor(name){this.name=name;} getn(name){return db.collection(name);}
find(...p){return new Promise((a,x)=>this.getn(this.name).find(...p).toArray((e,d)=>(e?x(e):a(d))))}
/*find(...p){return new Promise((a,x)=>this.getn(this.name).find(...p,(e,d)=>(e?x(e):a(d))))}*/
findOne(op,op2){return new  Promise((a,x)=>this.getn(this.name).findOne(op,op2,(e,d)=>(e?x(e):a(d))))}
findOneAndUpdate(...p){return  new Promise((a,x)=>this.getn(this.name).findOneAndUpdate(...p,(e,d)=>(e?x(e):a(d))))}
findOneAndReplace(...p){return new Promise((a,x)=>this.getn(this.name).findOneAndReplace(...p,(e,d)=>(e?x(e):a(d))))}
findOneAndDelete(...p){return new Promise((a,x)=>this.getn(this.name).findOneAndDelete(...p,(e,d)=>(e?x(e):a(d))))}
/*findById(id){return new Promise((a,x)=>this.getn(this.name).findById(id,(e,d)=>(e?x(e):a(d))))}*/


insertMany(...p){return new Promise((a,x)=>this.getn(this.name).insertMany(...p,(e,d)=>(e?x(e):a(d))))}
}
db.on('ready',function(){console.log('connected to db')})
//module.exports=db;
module.exports=n=>new Model(n)