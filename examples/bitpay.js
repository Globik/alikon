var bitpay=require('bitpay-rest');
var bitauth=require('bitauth');
var fs=require('fs');
var privkey=bitauth.decrypt('',fs.readFileSync('/home/globik/.bitpay/api.key','utf8'));
console.log('privkey: ',privkey);

var client=bitpay.createClient(privkey);
client.on('error',err=>console.log(err));

client.on('ready',()=>{
var data={price:1,currency:'USD'};

client.as('merchant').post('invoices',data,(err,invoice)=>{
if(err){console.log(err);}
else{
console.log('invoice data: ',invoice);
}
});

client.get('invoices',(err, invoices)=>{
if(invoices){
invoices[0].get('refunds',(err,refunds)=>{
console.log('err:', err);
console.log('refunds: ',refunds);
});
}else{console.log('no invoices');}
});
})