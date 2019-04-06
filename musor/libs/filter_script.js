/* filter_script.js */

let script=function(l,lala){
let a=filt(l.extra,lala);	
let b=lipka(a,l);
return b;
}

function filt(arr,t){
let b=arr.filter(function(x){return x.type==t;});
return b;	
}

function lipka(ar,l){
let g=[];
g.push(l.href);
ar.forEach(function(el,i){
g.push(el.href);
});
return g;
}

module.exports={script};