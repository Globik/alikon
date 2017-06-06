const fs=require('fs');
const cfs=require('co-fs');
const bs=require('../libs/await-fs.js');
const {sep}=require('path');
(async ()=>{
var json=await cfs.readFile('mailgun.js','utf8')
//console.log('json: ',json);
})()
var ab=['access','rename','ftruncate','chown','lchown','cmod','fchmod','stat','lstat','fstat','link','symlink',
		'readlink','realpath','unlink','rmdir','readdir','close','open','utimes',
		'futimes','fsync','write','read','readFile','writeFile','appendFile','mkdir','mkdtemp']
// fchown fdatasync mkdtemp rename truncate
var data={}
//var name=1;
ab.forEach((name)=>{
if(!fs[name])return
data[name]=(...n)=>{
return new Promise((res,rej)=>{
fs[name](...n,(er,d)=>{
if(er)rej(er)
if(d)res(d)
		 })
})
}
})
		   //console.log('data: ',data);
var mich=data;
(async ()=>{
let js=await mich.readFile('mailgun.js','utf8')
//console.log('JS: ',js)
})()
var v=Object.entries(fs)
//console.log('v: ',v[3])
var tmpDir='./fuckable';
(async ()=>{
try{
//let li=await bs.mkdtemp(`${tmpDir}${sep}`)
//console.log('li: ',li)
}catch(e){console.log(e)}
try{
let li=await bs.access('/etc',fs.constants.R_OK | fs.constants.W_OK);
console.log('li: ',li)
}catch(e){console.log('error::::',e)}	

})()














