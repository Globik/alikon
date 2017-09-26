var jsi=require('node-stringify');
var map=new Map();

var doo={bro:({x:1,y:5}),gru:function(m){return m;},massiv:[1,{mama:"mama",massiv:[0,1,3]}]}
var set=new Set([doo,5])
//var set=new Set();
console.log('is 5 in Set?: ',set.has(5));
console.log('is {x:1,y:5} in set?: ',set.has(doo))
console.log('set.size: ',set.size);
function isType(obj, type) {
  var t = Object.prototype.toString.call(obj)
  return t === '[object ' + type + ']'
}
var g=isType(map,'Map')
console.log('g: ',g);
var g1=typeof map;
console.log('g1: ',g1);
var g2=isType(set,'Set');
console.log('is set typeof set?: ',g2);
console.log('set: '+set)
map.set('student','globik');
var o={name:"Bob",getname:function(name){return name;},map:map,zwei:{zwei:function(n){return n}},
far:[99,{dob:function(b){return b;}},88],seti:set};
console.log('o: ',o);
var d=JSON.stringify(o);
console.log('d ',d);
console.log('parse d: ',JSON.parse(d))
console.log('map: ',map);
//var da= "new Map ([['student','globik']])";
var da="new Map([['student','globik']])";
var da1=eval(da);
var da3=da1.get('student');
console.log('map3: '+da3+' '+da1.size);
var gro="new Set([5,8])";
var gro1=eval(gro);
var gro2=gro1.has(5);
console.log('gro2: ',gro2,' ',gro1.size)
var parsed=JSON.parse(d);
var k=parsed.map;
//var l=eval('('+parsed.getname('pinokio')+')');
//var k2=k.get('student');
console.log('k2: ',k);
var jj=jsi(o);
console.log('jj: ',jj);
var c=eval(jj);
var c2=c.getname('vova');
console.log('c2: ',c2,' c.name: ',c.name,' c.zwei.zwei(7): ',c.zwei.zwei(7), ' c.far[1].dob(dob): ',c.far[1].dob('dob'));
//console.log('map2: ',c.map.get('student'))
console.log('size:',set.size)
/*var lui='new Set([';
for(let m of set){
	let i=0;
	let z=',';
	if(i>set.size-1)z='';
console.log('set: ',m)
lui+=jsi(m)+z;
	i++;
}
lui+='])'
*/ 
var lui='new Set('+jsi([...set])+')';
console.log('lui: ',lui)
var er=eval(lui);
var er1=er.size;
console.log('er.size: ',er1);
for (let m of er){
//console.log('set2: ',m.massiv[1].massiv[0]);
	console.log('set2: ',m)
}
console.log('is has 5: ',er.has(5))
console.log('is has doo: ',er.has(doo));