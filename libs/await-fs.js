const fs=require('fs');
const ab=['access','rename','ftruncate','chown','lchown','cmod','fchmod','stat','lstat','fstat','link','symlink',
		'readlink','realpath','unlink','rmdir','readdir','close','open','utimes',
		'futimes','fsync','write','read','readFile','writeFile','appendFile','mkdir','mkdtemp']
// fchown fdatasync mkdtemp rename truncate
ab.forEach(name=>{
if(!fs[name])return;
exports[name]=(...n)=>{
return new Promise((res,rej)=>{
fs[name](...n,(er,d)=>{
if(er)rej(er)
if(d)res(d)
})
})
}
})