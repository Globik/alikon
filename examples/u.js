var Module=module.constructor;
var invalidate=require('invalidate-module');
var count=require('./ex.js');
var path=require('path');

console.log(count.counti())
console.log(count.counti())
//invalidate(require.resolve('./ex.js'))
//delete require.cache[path.resolve('./ex.js')].counti;
console.log( Module._cache['/home/globik/alikon/examples/ex.js'].exports.counti);
delete  Module._cache['/home/globik/alikon/examples/ex.js'].exports.counti;
//var count=require('./ex.js')
setTimeout(function(){
console.log(count.counti())
console.log(count.counti())
console.log( Module._cache['/home/globik/alikon/examples/ex.js']);
},2000)