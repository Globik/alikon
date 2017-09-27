//in err.detail
var pin="Key ( ame  )=(mark) already exists.";
var din=pin.includes("name ");//email
console.log('din: ',din);

//insert into busers(email,pwd,name) values('ami@ya.ru','bur','loladadadadadadadadadadadad');

//in err.name "unique_email" "unique_name"

//busers_email_check
//value too long for type character varying(24)

var abb=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];
function compute(cb){console.log('compute')
var i=0;
var big=abb.length;
					 console.log('abb.length: ',abb.length);
var max=5;
//var s=0;
function baba(){
	var s=0;
	//s++;
	console.log('kuku')
for(var k=i;k<(i+max) && k<= big;k++){
	//while(i<big){
		s++;
//print(k);
console.log('k: ','k','i: ',i,' max: ',max)
if(i==max){
i=max;
//i+=s;
console.log('max');
	cb(null,'baba '+s);
	s=0;
	
	max+=5;
	break;
//process.nextTick(baba)	
//if(i<big){	console.log('moving recursion');process.nextTick(baba);}else{console.log('dura!!!!!!!!!!!!!!!!!!!!');cb(null,'done')}
console.log('gu')

//s++;
//break;
	console.log('duu')
//max+=5;

}
	//baba();
		if(i==big-1){console.log('SUKA!!!!!!!!!!!!!!!!!!!!! i = ',i);cb(null,'done')}
	//else{
//if(i<10){	console.log('moving recursion');process.nextTick(baba)}
//}
	
//if(max>=20){cb(null,"b");}else{i++;max+=5;process.nextTick(baba)}
//if(i>=20){console.log('20 gggg');}else{baba();console.log('drr');}
i++;
}

	//t=false;
	//if(t){baba();t=false}
console.log('S: ',s)
//s++
}
baba();

}
//compute('c')
function print(n){
console.log('n: ',n)
}
//for(var k=0;k<2;k++){
compute((err,r)=>{
if(err)console.log(err);
console.log('r: ',r);
})
//}
for(var li=0;li<2;li++){console.log('li')}
var fifa=[
	{id:1,room:'globik'},
	{id:2,room:'ron'},
	{id:3,room:'globik'},
	{id:4,room:'malina'},
	{id:5,room:'globik'},
	{id:6,room:'ron'},
	{id:7,room:'suka'},
	{id:8,room:'ron'},
	{id:9,room:'globik'},
	{id:10,room:'suka'},
	{id:11,room:'globik'},
	{id:12,room:'globik'},
	{id:13,room:'ron'},
	{id:14,room:'alice'},
	{id:15,room:'ron'},
	{id:16,room:'ron'},
	{id:17,room:'alice'},
	{id:18,room:'globik'},
	{id:19,room:'globik'},
	{id:20,room:'alice'},
]
var clients=new Set(fifa)

console.log('clients.size: ', clients.size);



/*
function noop(){}
function once(fn){
var f=function(){
if(f.called)return f.value
f.called=true
return f.value=fn.apply(this,arguments)
}
f.called=false
return f
}
function maplimit(arr,limit,it,cb){
var com=0,ab=false,res=[],q=0,l=arr.length,i=0;
	var cb=once(cb || noop);
	for(var r=0;r<l;r++){res[r]=null;}
	flush()
	function flush(){
	if(com===1)return cb(null,res)
	while(q<limit){
	if(ab)break
	if(i===l)break
	push()
	}
	}
	function abort(err){
	ab=true
	return cb(err)
	}
	function push(){
	var idx=i++
	q+=1
	it(arr[idx],function(err,result){
	if(err)return abort(err)
	res[idx]=result
	com+=1
	q-=1
	console.log('f')
	flush()
	})
	}
}

maplimit(abb,5,function(ite,callback){
console.log('ite: ',ite);
setTimeout(function(){callback();},3000)
},function(err){console.log('err: ',err);console.log('done')})
*/
function drug(mstep,vroom,cb){
let vri=0,dl=mstep;
	//let si=0;
function fuck(){
	console.log('OHO!!')
	let si=0;
while(vri<clients.size){
for(let [i,v] of clients.entries()){
	si++;
if(i.room==vroom)console.log('room: ',i.room,' id: ',i.id,' vri: ',vri,' dl: ',dl);
if(vri==dl){
	//break;
vri=dl;
dl+=5;
cb(null,'cb here! '+si)

//break;
if(vri<clients.size){console.log('next tick');/*si++*/;process.nextTick(fuck);}
//break;
}
	
	//console.log('what')
if(vri==clients.size-1)cb(null,'fertig! '+si)
vri++;
}
}
}
fuck();
	//setTimeout(function(){fuck();},2000)

}
drug(5,'globik',(er,res)=>{
if(er)console.log(er)
console.log('cb: ',res)
})

function arfrom(n){
return new Promise((res,rej)=>res([...n]))
}
(async function(){
let d=await arfrom(clients);
	//console.log('await clients: ',d);
}())
var dsa=[...clients]
console.log('dsa: ',dsa.length)
var dsa1=fifa.slice(0,2)
//console.log('dsa1: ',dsa1);

function dias(room,db){
function as(arg,cb){process.nextTick(()=>cb(arg));}
	
function final(){console.log('done 3',rs);db(null,'ok')}
var rs=[]
var running=0;
var lim=2;
	var lifa=[...clients]
function launcher(){
	let me=false;
while(running<lim && lifa.length>0){

let item=lifa.shift();
as(item, async function(rt){
if(rt.room=='globik')rs.push(rt)
running--
if(lifa.length>0){
await launcher();
// process.nextTick(launcher)
}else if(running==0){
final();
}
})
running++
}
}
process.nextTick(launcher)
}
/*
dias('globik',(e,r)=>{
if(e)console.log(e)
console.log('result: ',r);
})
*/
function bios(){
return new Promise((res,rej)=>{
dias('globik',(er,r)=>{
if(er)console.log(er)
res(r)
})
})
}
(async function(){
var s=await bios()
console.log('s:',s)
}())

function boo(){
for(let l of clients){
console.log('i: ',l.id)
if(l.id==3)break;
}
}
boo()
var ass=[...clients].find(el=>el.id==2)
console.log('ass: ',ass);

const boo2=(v,id,m)=>new Promise((r,j)=>r([...v].find(e=>e[id]==m)))

//boo2(clients,'id',2).then((d)=>console.log('DATA: ',d)).catch(e=>console.log('error: ',e))

async function f(cu,i,n){
let c=await boo2(cu,i,n)
console.log('C!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!: ',c)
}
f(clients,'id',2)
console.log('LEN: ',[...clients].length)
//for(var k



