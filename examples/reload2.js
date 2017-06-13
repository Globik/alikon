'use strict';
const chokidar=require('chokidar');
const path=require('path');
const watch = new chokidar.FSWatcher({ ignored: /[\/\\]\./, persistent: true,awaitWriteFinish:{stabilityThreshold:2000,pollInterval:100} });
require('./inv.js')
function reload(n){
let l=path.resolve(n)
watch.add(l);
return require(l);
}
watch.on('change',p=>{
console.log('file is changed: ',p)
module.invalidateByPath(p)			 
					 })
module.exports = reload;
watch.on('add',p=>{console.log('added ',p)})
process.on('SIGINT',()=>{
watch.close();
console.log('closing');
process.exit(0)
})
