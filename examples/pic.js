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

// node examples/pic
var ew=chunk(picssammler.pics,4);
console.log('EW: ',ew);

function chunk(arr, size){
var R=[];
for (var i=0,len=arr.length;i<len;i+=size){
R.push(arr.slice(i,i+size));}
	return R;
}

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