const {Encoder,Levels}=require('qr-node');
const {measure}=require('/home/globik/globibot/measure.js');

const url='http://example.com';
const ob={background_color:'#76eec6',
foreground_color:'#ff0000'
,level:Levels.HIGH, dot_size:12,margin:8};
function boo(n){
for(var i=0;i<n;i++){
Encoder.encode(url,null,ob).then(data=>{
//console.log('data: ','data:image/png;base64,'+data.toString('base64'))
console.log(data.toString('base64').substring(0,16));
}).catch(e=>{console.log('error: ',e)})
// -s -m dot_ size and margin default 3 and 4
}

}
var boo=measure(boo);
boo(1);
boo(100);
/*
let bas_part='data:image/png;base64,';
async function dor(){
try{
let b=await Encoder.encode(url,null,ob)
//console.log('B: ',b);
//return `${bas_part}${b.toString('base64')}`
throw "aw3";
}catch(e){console.log(e);
//return 'fuck_error';
throw "ass";
}
}
(async function(){
try{
let ac=await dor();
console.log('ac: ',ac)
}catch(e){console.log('err: ',e)}
})()

var wob={body:{name:'serg',papa:'mama'}}
console.log(wob.body.name);
var {name}=wob.body;
console.log('name: ',name)
*/