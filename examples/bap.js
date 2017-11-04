var estr="http://example.com/name/big-name/little_name";
var estr2=encodeURIComponent(estr);
console.log('estr2: ',estr2);

var grund="https://bitaps.com/api/";
var s="https://bitaps.com/api/create/redeemcode";
var rk=require('request');
var m="get";
/*
rk.get(s,function(err,resp,body){
if(err)console.log('error: ',err)
console.log('status: ',resp.statusCode)
console.log('body: ',body);
})
console.log('it s work?')
*/

/*

body_1:  {
"address": "1Gdc5d6hKQnguxrkHmPYw4A1bP7rHAoSAs", 
"invoice": "invNetkQ1TTTk5y2Hw48JoSipULpgGewG2mskqmKtitwUJoSFT12V", 
"redeem_code": "BTCvb1EkcMq3UanuFacxRpW9Ei4ePLt9HQ8SXTgZVhSQFRA4NB7Le"
}

*/
var real_address="1Gdc5d6hKQnguxrkHmPYw4A1bP7rHAoSAs"; // hot wallet?
var cold_wallet_address="1DnxfQ4YqAvzEkeR6XBkxQt76MRQvScet3"

var s2=grund+"get/redeemcode/info";
var redeem= "BTCvb1EkcMq3UanuFacxRpW9Ei4ePLt9HQ8SXTgZVhSQFRA4NB7Le";
var data1={redeemcode:redeem};

var ops1={method:'post',body:data1,json:true,url:s2};
console.log(s2);
/*
rk(ops1,function(err,resp,body){
if(err)console.log('error: ',err)
console.log('status: ',resp.statusCode)
console.log('headers: ',resp.headers)
console.log('body: ',body);
})
*/
var s3=grund+"use/redeemcode";
var fakeaddress="39cjjxHTu7344mXExKb5SoDzbAoDWBpCj9";
var data2={redeemcode:redeem,address:fakeaddress,amount:600}
var ops2={url:s3,method:'post',json:true,body:data2};
/*
rk(ops2,function(err,resp,body){
if(err)console.log('error: ',err)
console.log('status: ',resp.statusCode)
console.log('headers: ',resp.headers)
console.log('body: ',body);
})
*/
var callback=estr2;
var s4=grund+"create/payment/"+real_address+"/"+callback+"?";
var qes={confirmations:3,free_level:"low"};
/*
rk({method:"get",url:s4,qs:qes},function(err,resp,body){
if(err)console.log('error: ',err)
console.log('status: ',resp.statusCode)
console.log('headers: ',resp.headers)
console.log('body: ',body);
})
*/
/*
body:  {
"payment_code": "PMTujx5hrxG9zRrNcNQVfK25AEc1wp6QVi4ueRUM1bRqsynp5uL9W", 
"invoice": "invP2FWZHopowhVmE1cmBN6ikQUyLzMGEp9w53PQBnqJ6hvCZs2Bu", 
"address": "1DSPfSrZDJJXCKfVPmmP6ZEw45GLvWtSAk"
}
*/

var padres="1DSPfSrZDJJXCKfVPmmP6ZEw45GLvWtSAk?amount=20.3&label=Vasja_Pupkin&message=order%20for%tokens";
var s5=grund+"qrcode/"+padres;

/*
rk({method:'get',url:s5},function(err,resp,body){
if(err)console.log('error: ',err)
console.log('status: ',resp.statusCode)
console.log('headers: ',resp.headers)
console.log('body: ',body);
})
*/
//var padres2="1DSPfSrZDJJXCKfVPmmP6ZEw45GLvWtSAk?amount=20.3&label=Vasja_Pupkin&message=order%20for%tokens";
var s6=grund+"qrcode/png/"+padres;
/*
rk({method:'get',url:s6},function(err,resp,body){
if(err)console.log('error: ',err)
console.log('status: ',resp.statusCode)
console.log('headers: ',resp.headers)
console.log('body: ',body);
})
*/
var s6=grund+"create/payment/smartcontract/"+callback;
var data5={type:"hot_wallet",hot_wallet:real_address,cold_storage:cold_wallet_address,hot_wallet_quota:60}
var ops5={url:s6,method:'post',json:true,body:data5};
rk(ops5,function(err,resp,body){
if(err)console.log('error: ',err)
console.log('status: ',resp.statusCode)
console.log('headers: ',resp.headers)
console.log('body: ',body);
})

body:  { 
  payment_code: 'PMTvNPy4NYp9PKZ76BG1f4KAWR3LC95XQS1rWgYjG1NGEshAqge63',
  invoice: 'invNoStCHMT7SwUESos6oW9UhnFCQjJ6E6LwXWDCLBB5RYtMGpJYm',
  address: '18J8Qjy6AJLV4icAcWAjPELNxrhzEnwecb' 
}











