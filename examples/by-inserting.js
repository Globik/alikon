//title,slug,author,last_modified,description,body,foto_cover,status,part
var locs={title:"September in London",
		 slug:"september-in-london",
		 author:"globik",
		 description:"A description for any of social networks",
		 body:"Hello London!",
		 foto_cover:"http://ex.com/pics/pic.png",
		 status:"active",
		 part:'0'}

var s='';
var i=Object.values(locs);
console.log(i);
var d=Object.entries(locs);
console.log('d: ',d);
var m=new Map(d);
console.log('map: ',m);
//node by-inserting
var mis=boo(locs);
console.log('mis : ',mis);
function boo(obj){
	let s='';
for(var k in obj){
s+=`${k}='${obj[k]}' `;
}
return s;
}
var str='';
d.forEach(function(el,i){
console.log(Number.isInteger(el[1]));
	str+=`${i==0 ? '': ', '}${el[0]}='${el[1]}'`;
})
console.log('str: ',str);
console.log(Number.isInteger('7'))
function dodas(obj){
let s='';
let d=Object.entries(obj);
d.forEach((el,i)=>{
s+=`${i==0 ? '': ', '}${el[0]}='${el[1]}'`;
})
return s;
}
var estr=dodas(locs);
console.log('estr: ',estr);