//bitaps.com/api/
var MyWallet=require('blockchain.info/MyWallet');
var ops={apiCode:'1',apiHost:'http://localhost:5000'}
var w=new MyWallet('','',ops);
var request=require('request');
//w.getBalance().then(b=>{console.log(b)})
var addr='12aen2PeV1PmYvUGqQSPxFjm2RtG7RubQX';
var inv="invP2iL5aVvGue3u1cVbSkyEFx18suLPsFr7qfR7URpmEzTPeudof";
var red="BTCvQstS4SRCo8XEcPJyyZSrwNCQ8ShNdf6rg9iPPzP2urNCayXTV";
var url='https://bitaps.com/api/create/redeemcode';
var url2='https://bitaps.com/api/get/redeemcode/info';
var url3='https://bitaps.com/api/use/redeemcode';

var data={};
data.redeemcode=red;

var mops={uri:url2,method:'POST',json:data};
/*request(url,(e,b,body)=>{
if(e){console.log(e);}
	console.log(b.statusCode);
	console.log('body: ',body);
})*/
/*
request.post(mops,(e,b,body)=>{
if(e)console.log(e)
console.log(body);
});
*/
var data2={};
data2.redeemcode=red;
data2.address=addr;
data2.amount='All available';

var mops2={uri:url3,method:'POST',json:data2};

request(mops2,(e,b,body)=>{
if(e)console.log(e)
console.log('body: ',body);
})

