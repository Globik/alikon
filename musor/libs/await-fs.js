const fs=require('fs'), util=require('util');
const readf=util.promisify(fs.readFile);
const exists=util.promisify(fs.exists);//use fs.stat() or fs.access() instead
const mkdir=util.promisify(fs.mkdir);
const stat=util.promisify(fs.stat),
	  writeFile=util.promisify(fs.writeFile);
module.exports={readf,exists,mkdir,stat,writeFile}