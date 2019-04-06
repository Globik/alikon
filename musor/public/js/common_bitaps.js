var mikok=false,tokens_packet=100,is_dev=gid("isDevel").value,dforma=document.forms.namedItem("payment2"),
	qr_address=gid("qr_address"),btc_amount=gid("btc_amount"),ssout=gid("ssout"),
	gInvoice=null, gAddress=null, btoki=null, superbtc=null, supersatoshi=null;
function is_devel(){if(is_dev=="true"){return true;}else{return false;}}
function set_price2(el){
console.log('setting a price');
tokens_packet=el.getAttribute('data-t_pack');
mikok=false;
}
dforma.addEventListener('submit',get_invoice);
function get_invoice(ev){
ev.preventDefault();
var d;
if(ev.target.buyerId.value.length==0){ payoutinfo2.innerHTML='Go <a href="/login">log in</a><br>';return false;}
try{
d=new FormData(ev.target);
}catch(e){alert('FormData is not supported? '+e);return;}
d.append("tok_pack",tokens_packet);
vax(ev.target.method,ev.target.action,d,qr_response,erl,true);//true means formdata, not an json set request header
}
function erl(er){alert('erl: '+er);console.log(er);}
function qr_response(f){
mikok=true;
proc_inc(f);
}
function proc_inc(md){
console.log('MD: ',md)
if(!md)return;
if(md.result){
gInvoice=md.result.bt_inv_id;
gAddress=md.result.addr;
btoki=md.result.bt_pck_tok;
console.log('btoki: ',btoki)
superbtc=org_btc_price(btoki);
if(superbtc){supersatoshi=superbtc*100000000;}
if(md.src4){
qrlink.href="bitcoin:"+md.result.addr+"?amount="+md.body.items2+"&label="+md.body.buyerId+"&message=Purchase%20"+md.body.tok_pack+"%20tokens";
console.log('qrlink.href: ',qrlink.href);
testimg.src=md.src4;
qr_address.textContent=md.result.addr;
btc_amount.textContent=md.body.items2;
}}}
function dev_bitaps_cb(){
console.log('mikok: ',mikok)
if(!is_devel()){console.log('not develop mode');return;}
if(mikok==false){alert('press zuerst on go to pay button');return;}
if(busid.value.length==0){alert('please go log in');return;}
if(!gAddress || !gInvoice){console.warn('no address/invoice provided. Return.');return;}
if(!supersatoshi){console.warn('satoshi is not provided.');return;}
var d={}, payment_code_dev='PMTvNPy4NYp9PKZ76BG1f4KAWR3LC95XQS1rWgYjG1NGEshAqge63';
console.log('invoice: ',gInvoice);
console.log('gAdr: ',gAddress);
console.log('btoki: ',btoki);
console.log('bitcoins: ', superbtc);
console.log('satoshi: ',supersatoshi);
d.address=gAddress;
d.invoice=gInvoice;
d.amount=supersatoshi;//40000;//satoshi
d.code=payment_code_dev;
d.tx_hash="tx_h_09c90";
d.confirmations=3;
d.payout_tx_hash="p_tx_h_666y";
d.payout_miner_fee=0.0002;
d.payout_service_fee=0.0002;
vax('post','/bitaps/cb/'+busid.value,d,on_bitaps_cb_suc,erl);
}
function on_bitaps_cb_suc(f){console.log(f);}
function org_btc_price(n){
if(!n){console.log('no pack provided. Return');return null;}
if(n==100){
return superbtc=0.04;
}else if(n==200){return superbtc=0.08;}else if(n==500){return superbtc=0.2;}else if(n==1000){return superbtc=0.4;}else{return null;}
}

function go_sse(){
if(gevS==null){console.log('evS is null');return;}
gevS.addEventListener('bitaps_cb',notify_bitaps_cb,false);
gevS.onmessage=function(e){}
}
go_sse();

function notify_bitaps_cb(ev){
try{
var dss=JSON.parse(ev.data);
}catch(e){console.error(e);}
console.warn('sse data came: ',dss);
/*
{ us_id: '58a1a78a406da007a696e917',
  items: 100,
  inv_id: 'invNoStCHMT7SwUESos6oW9UhnFCQjJ6E6LwXWDCLBB5RYtMGpJYm',
  bcamt: 4000000,
  type: 'paid' }
*/
ssout.innerHTML='<br><b>us_id: </b>'+dss.us_id+'<br><b>items: </b>'+dss.items+'<br><b>inv_id: </b>'+dss.inv_id+'<br>';
ssout.innerHTML+='<b>bcamt: </b>'+dss.bcamt+'<br><b>type: </b>'+dss.type+'<br>';
if(dss.inv_id==gInvoice && dss.us_id==busid.value){
ssout.innerHTML+='<b>invoice id and us_id are equal. OK.</b><br><br>';
ssout.innerHTML+='Congratulations! You have '+dss.items+' tokens. Your '+dss.bcamt+' successfully processed.<br>'
}}