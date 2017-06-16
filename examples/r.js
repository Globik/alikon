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

let st=n=>{return `Ma geht ins ${n.kino}. Sie schaut auf ${n.mich} an. ${n.prone}`}

function doit(n){
return new Promise((res,rej)=>{
let si;
try{si=st(n);res(si)}catch(err){rej(err)}
})
}

//doit({kino:'kino',mich:'mich'}).then(data=>{console.log('data: ',data)}).catch(err=>{console.log('error in doit promise: ',err)})
/*
(async()=>{
try{
var mata=await doit({kino:'kino1',mich:'mich1'})
console.log('mata: ',mata);
}catch(e){console.log('error in async mata: ',e)}
})()
*/
function punct(n){
return (async()=>{
try{
var mata=await doit(n)
return mata;
//console.log('mata: ',mata);
}catch(e){
return e;
//console.log('error in async mata: ',e)
}
})()

}

var pino=punct({kino:'kino3',mich:'mich3'}).then(dati=>{console.log('dati: ',dati)})
console.log('pino: ',pino);


















