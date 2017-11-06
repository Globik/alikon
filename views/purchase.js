//purchase.js
const head=require('./head'),
    header_menu=require('./header_menu');

const purchase = n=>{
 const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- purchase.js -->
<head>${head.head({title:"Purchase Tokens", js:["https://bitpay.com/bitpay.min.js"]})}</head>
<body>
<style>
.sect{background:lightgreen;padding:10px;margin:0;}
		.sect h1{padding:20px;margin:10px;}
			#payment h4{padding:12px;margin:12px;}
			.inp{padding:10px;margin:10px;}
.warn_pay{padding:20px;}
</style>
<section class="sect">
<a href="/">home</a>
		<h1>Get Tokens - test mode</h1>
<output id="payoutinfo"></output>
		<form id="payment"  name="payment" method="post" enctype="multipart/form-data">
			<h4>The more tokens you buy, the less they cost!</h4>
			<input id="payEmail" type="hidden" name="buyerEmail" value="${buser ? buser.email : ''}"/>
            <input type="hidden" name="buyerName" value="${buser ? buser.name : ''}"/>
            <input type="hidden" name="price" value=""/>
            <input type="hidden" name="currency" value="USD"/>
			<div class="inp"><input type="radio" name="items" value="100" data-price="1" onchange="set_price(this);"/> 100 tokens for $1</div>
			<div class="inp"><input type="radio" name="items" value="200" data-price="20" onchange="set_price(this);"/> 200 tokens for $20</div>
			<div class="inp"><input type="radio" name="items" value="500" data-price="50" onchange="set_price(this);"/> 500 tokens for $50</div>
			<h4>Payment options:</h4>
			<div class="inp"><input type="radio" name="bitc" value="bitcoin" checked/> Bitcoin</div>
		<div class="inp"><input type="submit" value="go to pay"></div>
		</form>
		</section>


<section class="sect">
<h1>Get Tokens - a real mode</h1>
<h4>Recommended amount of tokens:</h4>
<output id="payoutinfo2"></output>
<form id="payment2"  name="payment2" method="post" action="get_invoice" enctype="multipart/form-data">

<input type="hidden" name="buyerId" value="${buser ? buser.id : ''}"/>


<div class="inp"><input type="radio" name="items2" value="0.04" data-t_pack="100" onchange="set_price2(this);" checked/> 100 tokens for 0.04 BTC</div>
<div class="inp"><input type="radio" name="items2" value="0.08" data-t_pack="200" onchange="set_price2(this);"/> 200 tokens for 0.08 BTC</div>
<div class="inp"><input type="radio" name="items2" value="0.2" data-t_pack="500" onchange="set_price2(this);"/> 500 tokens for 0.2 BTC</div>
<div class="inp"><input type="radio" name="items2" value="0.4" data-t_pack="1000" onchange="set_price2(this);"/> 1000 tokens for 0.4 BTC</div>

<div class="inp"><input id="bitsend" name="submit" type="submit" value="go to pay"></div>
</form>
</section>
<script>
var messy=null;
var forma=document.forms.namedItem("payment");
var dforma=document.forms.namedItem("payment2");
function set_price(el){
forma.price.value=el.getAttribute('data-price');
}
var tokens_packet=100;
function set_price2(el){console.log('setting a price');
tokens_packet=el.getAttribute('data-t_pack');
}
dforma.addEventListener('submit',get_invoice);

forma.addEventListener('submit',function(ev){
if(payEmail.value){
payoutinfo.innerHTML="Connecting to server...";
var data=new FormData(document.forms.namedItem("payment"));

var xhr=new XMLHttpRequest();
xhr.open("post","/create_invoice",true);
xhr.onload=function(e){
if(xhr.status==200){
payoutinfo.innerHTML="Connecting to payment server...";

show_invoice(e);
}
else{
payoutinfo.innerHTML=this.response;
}}
xhr.onerror=function(e){payoutinfo.innerHTML=e;}
xhr.send(data);
}else{
payoutinfo.innerHTML='<p class="warn_pay">You must first to <a href="/login">log in</a> or <a href="/signup">sign up</a>.</p>';
}
ev.preventDefault();
},false);


function show_invoice(e){
var mata=JSON.parse(e.target.response);
console.log('mata: ',mata.id);
bitpay.enableTestMode();
bitpay.showInvoice(mata.id);
//messy=mata.messy;
//dummy_process();
}


window.addEventListener('message', function(event){
if(event.data.status==="paid"){
console.log('paid');
${process.env.DEVELOPMENT==="yes" ? 'dummy_process();' : ""}
}
},false);
function dummy_process(){
var xhr=new XMLHttpRequest();
xhr.open('post','/api/dummy_set_bitpay');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
console.log(this.response);
}else{
console.log(this.response);
}}
xhr.onerror=function(e){console.log(this.response + e)}

xhr.send(JSON.stringify(messy));
}
var instat=0;
function get_invoice(ev){
ev.preventDefault();
if(ev.target.buyerId.value.length==0){ payoutinfo2.innerHTML='Go <a href="/login">log in</a><br>';return ev.preventDefault();}
//alert(ev.target.buyerId.value.length);
payoutinfo2.innerHTML=ev.target.method+'<br>'+ev.target.action+'<br>'+ev.target.items2.value+'<br>'+tokens_packet;
instat++;
//ev.target.submit.disabled=true;
//setTimeout(function(){ev.target.submit.disabled=false;},5000)
var data=new FormData(document.forms.namedItem("payment2"));
data.append("instat",instat);
data.append("tok_pack",tokens_packet);
var xhr=new XMLHttpRequest();
xhr.open(ev.target.method,ev.target.action,true);
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
//try{alert(JSON.parse(this.response).resultat.p_addr);}catch(e){alert(e);}
payoutinfo2.innerHTML=this.response;
try{
var mdata=JSON.parse(this.response);
}catch(e){console.error(e);}

if(mdata.type=="neu"){}else if(mdata.type=="alt"){}else{}

}
else{
payoutinfo2.innerHTML=this.response;
}}
xhr.onerror=function(e){payoutinfo.innerHTML=e;}
xhr.send(data);
}


</script>
</body>
</html>`;
}
module.exports={purchase};