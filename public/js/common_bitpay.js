var is_dev=is_dev=gid("isDevel").value, payoutinfo2=gid("payoutinfo2"),
dforma=document.forms.namedItem("payment2"), mikok=false, tokens_packet=100;
function is_devel(){
if(is_dev=="true"){return true;}else{return false;}
}
function is_devel(){if(is_dev=="true"){return true;}else{return false;}}
function set_price2(el){
console.log('setting a price');
tokens_packet=el.getAttribute('data-t_pack');
mikok=false;
}
var messy=null;
dforma.addEventListener('submit',get_invoice);

function get_invoice(ev){
ev.preventDefault();
if(ev.target.buyerId.value.length==0){ payoutinfo2.innerHTML='Go <a href="/login">log in</a><br>';return false;}
payoutinfo2.innerHTML="Connecting to server...";
var d;
if(ev.target.buyerId.value.length==0){ payoutinfo2.innerHTML='Go <a href="/login">log in</a><br>';return false;}
try{
d=new FormData(ev.target);
}catch(e){alert('FormData is not supported? '+e);return;}
d.append("tok_pack",tokens_packet);
vax(ev.target.method,"/create_invoice",d,qr_response,erl,true);//true means formdata, not an json set request header
}
function erl(er){alert('erl: '+er);console.log(er);}
function qr_response(f){
mikok=true;
payoutinfo2.innerHTML="Connecting to payment server...";
show_invoice(f);
}
function show_invoice(e){
var mata=e;//JSON.parse(e.target.response);
console.log('mata: ',mata.id);
bitpay.enableTestMode();
bitpay.showInvoice(mata.id);
//messy=mata.messy;
//dummy_process();
}
window.addEventListener('message', function(event){
if(event.data.status==="paid"){
console.log('paid');
if(is_devel()){dummy_process();}
}
},false);
function dummy_process(){
var d={};
d.messy=messy;
vax("post","/api/dummy_set_bitpay",d,dummy_response,erl,false);
}
function dummy_response(f){alert(f);}