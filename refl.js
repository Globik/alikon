// hello from linux os!
'use strict';
//System.import  from './views/page.js';
var path=require('path');
var reload=require('reloadjs');
var page=require('./views/page.js');
var 
//console.log(page);
require('harmony-reflect');
 //var proxy=require('harmony-proxy');
/*
var handler={
get(target,name,rec){console.log('Name :',name);return target[name];
return Reflect.get(target,name);
},set(target,n,v,r){if(n="sid")console.log(n,v); target.sid=v;}
};
//var pi=page.page({user:'user'});
var pi=page.page;
var p=Proxy(pi,handler);
var sus={user:"buser"};
var d=p(sus);
console.log('proxy :',d);
var b=Proxy({},{
get(t,n,r){
console.log(n);

return n+"ma";
return Reflect.get(t,n,r);
},
set(t,n,v,r){console.log(n,v);
//return Reflect.set(t,n,v,r);
}});
b.fima="al";
b.pima="ad";
b.fima;b.pima;
var obj={ws:"pima"};
var ab=Reflect.get(p,"user");console.log('ab :',ab);
var aba=Reflect.has(p,"name");console.log('aba :',aba);
var aba2=Reflect.set(p,"n","44","j");console.log(aba2);
var ga={title:"pio"};

Object.observe(sus,function(ch){

console.log('ch :',ch);
});
sus.user="giga";
var p3=p(sus);console.log('p3 :',p3);
ga.title="al";
*/
var p=Proxy(page.page,{
apply(t,...ar){
console.log(t,ar[1]);
for(let k of Object.keys(ar[1])){console.log('i :',k);

}
ar[1].fi="b";console.log(ar[1].fi);
return Reflect.apply(t,...ar);
//return t(ar[0]);
},get(t,n,r){
if(n=="good"){console.log('n :',n);}
//return t({user:"balik",good:"lik"});
console.log(n,t(n));
Reflect.get(t,'n',r);
}
});
console.log(p({user:"fuckuser",sid:"bood"}));

function render(v,k){
var vi=reload('./views/'+v);
var er=Proxy(vi,{get(t,n,r){console.log('n :',n);},set(t,n,v,r){console.log(v);}});
er[v];
return vi[v](k);
}
//var ren=render('page',{user:"buser"});
//console.log('ren :',ren);
class Model{
constructor(na){this.na=na;}
rend(){return require('./views/'+this.na);}
}
var wq=new Model('page');
console.log(wq.rend().page({user:"use"}));
//var l=Reflect.get(p,'n.good',p);console.log('l :',l);
//var l2=Reflect.apply(page.page,undefined,[0]);console.log('l2 :',l2);
//node --harmony --harmony_proxies --harmony_reflect --harmony_modules refl
