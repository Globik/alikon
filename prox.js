//he
'use strict';
var Proxy=require('harmony-proxy');
var Reflect=require('harmony-reflect');
var posts={title:"Post Number One",_id:1,img:"pic-1.png",body:"Some content",autor:"Bob"};


//node --harmony --harmony_proxies --harmony_reflect --harmony_destructuring prox
let k=new Proxy(posts,{
get(target,p,r){
if((p in target)){
console.log(p);

//throw new ReferenceError(`unknown property ${p}`);
}
return Reflect.get(target,p,r);
}
});
var {title}=k;
console.log(title,k);
var Presenter={present(model){return Proxy(model,this.handler);},
handler:{
get(target,name,rec){
var val=name in target ? target[name] : this[name];
return typeof val=='function' ? val(target) :val;},
//set(target,name,rec){
//target['slug']=this.slug(target);
//target['created']=new Date();
//target['last_modified']=target['created'];
//},
slug(target){return target.title.toLowerCase().replace(/\s+/g,'-');}
}}
var pres=Presenter.present(posts);
//pres.slug="fuck";
//console.log('Present :',pres);
pres.created_on=new Date();
pres.last_modified=pres.created_on;
pres.slug=pres.slug;
console.log('Model :',pres);
//mm
