var picssammler={"pics":[
	                   {"src1":"/uploads/58a1a78a406da007a696e917/blum-m4-k1.jpg"},
					   {"src2":"/uploads/58a1a78a406da007a696e917/blum-m4-k2.jpg"},
					   {"src3":"/uploads/58a1a78a406da007a696e917/blum-m4-k3.jpg"},
					   {"src4":"/uploads/58a1a78a406da007a696e917/blum-m4-k4.jpg"},
	
	                   {"src1":"/uploads/58a1a78a406da007a696e917/ping-m4-k1.jpg"},
					   {"src2":"/uploads/58a1a78a406da007a696e917/ping-m4-k2.jpg"},
					   {"src3":"/uploads/58a1a78a406da007a696e917/ping-m4-k3.jpg"},
					   {"src4":"/uploads/58a1a78a406da007a696e917/ping-m4-k4.jpg"}
						]
			  }
var pi={"pics":[
	                  [ {"src1":"/uploads/58a1a78a406da007a696e917/blum-m4-k1.jpg"},
					   {"src2":"/uploads/58a1a78a406da007a696e917/blum-m4-k2.jpg"},
					   {"src3":"/uploads/58a1a78a406da007a696e917/blum-m4-k3.jpg"},
					   {"src4":"/uploads/58a1a78a406da007a696e917/blum-m4-k4.jpg"}],
	
	                   [{"src1":"/uploads/58a1a78a406da007a696e917/ping-m4-k1.jpg"},
					   {"src2":"/uploads/58a1a78a406da007a696e917/ping-m4-k2.jpg"},
					   {"src3":"/uploads/58a1a78a406da007a696e917/ping-m4-k3.jpg"},
					   {"src4":"/uploads/58a1a78a406da007a696e917/ping-m4-k4.jpg"}]
						]
			  }
var str='';
var step=0;
var fu={};
var bu={};
var moo={};
var va=[];
var map=new Map();
var bep=4;
picssammler.pics.forEach(function(el,i){
Object.assign(fu, el);
	
		
				
})
console.log('VA: ',va);
fu.title="Some title";
console.log('fu: ',fu);
var li=bu.sam=[fu];
var step=0;
console.log('li: ', JSON.stringify(li));
//var w=picssammler.pics.slice(step,step+=4);
//var w=picssammler.pics.slice(4,8);
//console.log('w: ',w);
// node examples/pic
var ew=chunk(picssammler.pics,4);
console.log('EW: ',ew);

ew.forEach((el,i)=>{
console.log(el);
	map.set(i,el)
})
console.log('map: ',map);
map.forEach(function(el,i){

})
console.log('moo: ',moo);
function chunk(arr, size){
var R=[];
	for (var i=0,len=arr.length;i<len;i+=size){
R.push(arr.slice(i,i+size));}
	return R;
}

var fucker=[];var lira={};
var sisi='';
pi.pics.forEach(function(el,k){
var eq=Object.entries(el);
	//fucker.push(lira);
	//sisi+=`{ ${eq[k]} }`;
	console.log('pi1: ',Object.entries(el));
	
	
	var pisi=Object.entries(pi.pics[0]);
	console.log('pidsi: ',pisi[0]);
	
	})
console.log('sisi: ',sisi);
				
console.log('lira: ',lira);
console.log('fucker: ',fucker);
var dama=[];
for(var i=0;i<2;i++)
{
	var rama={};
	for(var k=0;k<4;k+=1){
Object.assign(rama,pi.pics[i][k]);

	}
	rama.title="Some title";
dama.push(rama);
}

console.log('dama: ',dama);
//console.log('sisi: ',sisi);
//console.log('ducker: ',ducker);