
var family=[
{
name:1,
mother:"Lilie",
father:"Rony",
kinder:{sohn:"Richi",doter:"Ingrid"},
images:[{sc:"src1.png",title:"title-1"},{src:"src2.png",title:"title-2"}],
meta:["a","d"]
},
{
name:2,
mother:"Bitch",
father:"Muddy",
kinder:{sohn:"Vadik",doter:"Lara"},
images:[{src:"src1.gif",title:"title-1"},{src:"src2.gif",title:"title-2"}],
meta:["dura","shura","figa","piga"]
}
]

out4.innerHTML="output is OKii";

for(var {name,mother,kinder:{sohn=""},images:[{src="No img"},{src:ba="No pic"}]} of family){
out4.innerHTML+=`<li> ${name} ${mother} ${sohn} ${src} ba : ${ba}</li>`;
}

for(var {images,meta:[...n]} of family){
console.log(`${images[0].src || "fuck"} <b>meta: </b>${su(...n)} ::: 
<li>${[...n].concat('<li></li>')}`);
}
function su(...n){
var g=``;
//for(var x=0;x<n.length;x++){g+=`<li>${n[x]}`;} 
n.forEach(el=> g+=`<li>${el}</li>`)
return g;
}

let valid={
set:function(obj,prop,val){
if(prop=='age'){
if(!Number.isInteger(val)){throw new TypeError('The age is not an integer');}}
if(val>200){
throw new RangeError('The age seems invalid!')}
obj[prop]=val;
}
}
/*
let person=new Proxy({},valid);
person.age=100;
console.log(preson.age);
person.age="noth";
console.log(person.age);
person.age=300;
console.log(person.age);
*/
/*
var p=new Proxy.create({
get:function(proxy,name){
return `Hello, ${name}!`;
}});
console.log('proxy 2 :',p.World);
alert(p.World);*/
/*
var model={best:"B"};
Object.observe(model,function(chan){
chan.forEach(function(c){
console.log(c.type);})})
model.best="A";
*/
function bos(){
let user=[
{id:1,name:"Vasja",age:40},
{id:2,name:"Misha",age:20}
];var ser=34;
out5.innerHTML=nina({user});
} bos();
function nina(n){
var s='';
let {user}=n;
if(user){
for(var {id,name,age} of user){s+=`<li>${id}<li>${name}<li>${age}`;}
}
return s;
}
function dos(){
let buser={id:1,name:"Misha",age:30};var buer="LO";
console.log('Buser :',tbuser({buser}));
} dos();
function tbuser(n){
let {buser}=n;
if(buser){
var {name,age}=buser;
console.log(name || "no name");
var sl=`<li>${name} 
${(age ? `<li>${age}</li>`:'<b>no</b>')}`;}
return sl;
}
function template(strs, ...k){
return (function(...v){
var dict=v[v.length-1] || {};
var res=[strs[0]];
k.forEach(function(k,i){
var val=Number.isInteger(k) ? v[k] : dict[k];
res.push(val,strs[i+1]);
});
return res.join('');
});
}
var ab=template`${0}${1}${0}`('Y','A');
console.log('ab :',ab);
var ab2=template`${0} ${'foo'}!`('Hello',{foo:'World'});
console.log('ab2 :',ab2);
function html(s,...v){
var res='';
for(let i=0;i<v.length;i++){
res+=s[i];
res+=v[i];
}
res+=s[s.length-1];
return res.replace(/\n/g,'');
}
var ag="baba";
var ab3=html`hallo

 ${ag}`;
console.log('ab3 :',ab3);

