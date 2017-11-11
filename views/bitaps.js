const head=require('./head'),header_menu=require('./header_menu');
const is_devel=process.env.DEVELOPMENT;
function devi(){
if(is_devel=="yes"){return true;}else{return false;}
}
const bitaps = n=>{
 const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- purchase.js -->
<head>${head.head({title:"Purchase Tokens"/*, js:["https://bitpay.com/bitpay.min.js"]*/})}</head>
<body>
<section class="sect">
<h1>Get Tokens - a real mode</h1>
<h4>Recommended amount of tokens:</h4>
<output id="payoutinfo2"></output>
<form id="payment2"  name="payment2" method="post" action="/tipping/get_invoice" enctype="multipart/form-data">
<input type="hidden" id="busid" name="buyerId" value="${buser ? buser.id : ''}"/>
<input type="hidden" id="isDevel" name="is_develop" value="${devi()}"/>

<div class="inp"><input type="radio" name="items2" value="0.04" data-t_pack="100" onchange="set_price2(this);" checked/> 100 tokens for 0.04 BTC</div>
<div class="inp"><input type="radio" name="items2" value="0.08" data-t_pack="200" onchange="set_price2(this);"/> 200 tokens for 0.08 BTC</div>
<div class="inp"><input type="radio" name="items2" value="0.2" data-t_pack="500" onchange="set_price2(this);"/> 500 tokens for 0.2 BTC</div>
<div class="inp"><input type="radio" name="items2" value="0.4" data-t_pack="1000" onchange="set_price2(this);"/> 1000 tokens for 0.4 BTC</div>

<div class="inp"><input id="bitsend" name="submit" type="submit" value="go to pay"></div>
</form>
</section>
${devi()?'<br><button onclick="dev_bitaps_cb();">devel_bitaps_cb</button><br>':''}
<script>
var mikok=false;
var is_dev=document.getElementById("isDevel").value;
var dforma=document.forms.namedItem("payment2");
function is_devel(){
if(is_dev=="true"){return true;}else{return false;}
}
var tokens_packet=100;
function set_price2(el){console.log('setting a price');
tokens_packet=el.getAttribute('data-t_pack');
mikok=false;
}
dforma.addEventListener('submit',get_invoice);

var gInvoice=null;
var gAddress=null;
var btoki=null;
var superbtc=null;
var supersatoshi=null;

function get_invoice(ev){
ev.preventDefault();
if(ev.target.buyerId.value.length==0){ payoutinfo2.innerHTML='Go <a href="/login">log in</a><br>';return ev.preventDefault();}
//alert(ev.target.buyerId.value.length);
payoutinfo2.innerHTML=ev.target.method+'<br>'+ev.target.action+'<br>'+ev.target.items2.value+'<br>'+tokens_packet;
//ev.target.submit.disabled=true;
//setTimeout(function(){ev.target.submit.disabled=false;},5000)
var data=new FormData(document.forms.namedItem("payment2"));

data.append("tok_pack",tokens_packet);
var xhr=new XMLHttpRequest();
xhr.open(ev.target.method,ev.target.action,true);
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
payoutinfo2.innerHTML=this.response;
console.log('response: ',this.response)
try{
var mdata=JSON.parse(this.response);
}catch(e){console.error(e);}
console.log('data_type: ',mdata.type);
mikok=true;
proc_inc(mdata);
if(mdata.type=="neu"){}else if(mdata.type=="alt"){}else{}

}
else{
payoutinfo2.innerHTML=this.response;
}}
xhr.onerror=function(e){payoutinfo.innerHTML=e;}
xhr.send(data);
}

function proc_inc(md){
console.log('MD: ',md)
if(!md)return;
if(md.result){
gInvoice=md.result.bt_inv_id;
gAddress=md.result.addr;
btoki=md.result.bt_pck_tok;
//bt_pck_tok: 100, inv_id: "invNoStCHMT7SwUESos6oW9UhnFCQjJ6E6LwXWDCLBB5RYtMGpJYm"}
console.log('btoki: ',btoki)
superbtc=org_btc_price(btoki);
if(superbtc){supersatoshi=superbtc*100000000;}
}

}
function dev_bitaps_cb(){
console.log('mikok: ',mikok)
if(!is_devel()){console.log('not develop mode');return;}
if(mikok==false){alert('press zuerst on go to pay button');return;}
if(busid.value.length==0){alert('please go log in');return;}
if(!gAddress || !gInvoice){console.warn('no address/invoice provided. Return.');return;}
if(!supersatoshi){console.warn('satoshi is not provided.');return;}
let d={};
var payment_code_dev='PMTvNPy4NYp9PKZ76BG1f4KAWR3LC95XQS1rWgYjG1NGEshAqge63';
 var invoice_dev='invNoStCHMT7SwUESos6oW9UhnFCQjJ6E6LwXWDCLBB5RYtMGpJYm';
 var address_dev='18J8Qjy6AJLV4icAcWAjPELNxrhzEnwecb'; 
console.log('invoice: ',invoice_dev);
console.log('invoice: ',gInvoice);
console.log('addr: ',address_dev);
console.log('gAdr: ',gAddress);
console.log('btoki: ',btoki);
console.log('bitcoins: ',superbtc);
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

//result:
//"addr":"18J8Qjy6AJLV4icAcWAjPELNxrhzEnwecb","bt_pck_tok":100,"bt_inv_id":"invNoStCHMT7SwUESos6oW9UhnFCQjJ6E6LwXWDCLBB5RYtMGpJYm"

let xhr=new XMLHttpRequest();
xhr.open('post','/bitaps/cb/'+busid.value);
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){

console.warn('this.response: ',this.response);
}else{
console.log(this.response);
}}
xhr.onerror=function(e){console.log(this.response + e)}
xhr.send(JSON.stringify(d));
}

function org_btc_price(n){
if(!n){console.log('no pack provided. Return')}
if(n==100){
return superbtc=0.04;
}else if(n==200){return superbtc=0.08;}else if(n==500){return superbtc=0.2;}else if(n==1000){return superbtc=0.4;}else{return null;}
}
</script>
</body></html>`;
}
module.exports={bitaps}