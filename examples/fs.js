//./public/images/upload/58a1a78a406da007a696e917
var cfs=require('co-fs');
var co=require('co');
co.wrap(function*(){
try{
yield cfs.rmdir('../public/images/upload/58a1a78a406da007a696e917');
}catch(e){console.log(e);}
})