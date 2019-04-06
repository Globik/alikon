//var deva=true;
var path=require('path');
var config=require('../config/database.js');
console.log('deva :',config.deva);
var reload=require('reloadjs');
module.exports=function(modulename){
if(config.deva){return reload(path.resolve('views/'+modulename));}else{return require(path.resolve('views/'+modulename));}};