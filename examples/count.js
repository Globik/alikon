var ab=[1,2,3];
var fs=require('fs');
/*fs.readFile('serv.js','utf-8',(er,d)=>{
if(er)console.log(er)
console.log('ok');
})*/
/*var bu=fs.readFileSync('serv.js','utf-8');
if(bu)console.log('ok');
*/

var str=n=>{return `helo ${n.name} ${how()}`;function how(){for(var i=0;i<100;i++){var du=4*100;console.log(i)}return 'moo';} }
//var fi=str({name:'world'});
//console.log(fi);

function boo(n){
return new Promise((res,rej)=>{
res(str(n))
})
}

//boo({name:'world'}).then(d=>console.log(d))

(async function(){
var d=await boo({name:'m'})
console.log(d)
})()


ab.forEach(el=>{console.log(el)})