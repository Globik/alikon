const js_help=n=>{
let s='';
if(Array.isArray(n)){
s+=jsi(n)
}else{
s+=jsi(n.js)		
}
return s;
}
module.exports={js_help}
function jsi(n){
let s='';
n.forEach((el,i)=>{
s+=`<script src="${el}"></script>`
})
return s;
}