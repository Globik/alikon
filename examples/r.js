//require('./inv.js');
//require('module-invalidate');
var path=require('path');
var reload=require('./reload2.js');
//var counti=require('./ex.js');
//var mu=reload(require.resolve('./ex.js'));
var mu=reload('./ex.js');
//var counti=require('./ex.js');
//var counti=require('./ex.js');
/*
console.log(counti.counti());
console.log(counti.counti());

//console.log(counti())
console.log('counti: ',counti);

for(let i in counti){
	console.log('i:',i)
}

//module.constructor.invalidateByExports(counti);
module.invalidateByPath('./ex.js')
//module.constructor.invalidate()
//inv(require.resolve(counti));

console.log(counti.counti());
console.log(counti.counti());
*/
console.log('mu: ',mu.counti())
console.log('mu : ',mu.counti())

setTimeout(function(){
console.log('ISTABLISHED')
console.log(mu.counti())
console.log(mu.counti())

}, 10000)