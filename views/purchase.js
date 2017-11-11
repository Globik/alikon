//purchase.js
const head=require('./head'),
    header_menu=require('./header_menu');
const is_devel=process.env.DEVELOPMENT;
function devi(){
if(is_devel=="yes"){return true;}else{return false;}
}
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
<input type="hidden" id="isDevel" name="is_develop" value="${devi()}"/>
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
<script>
var is_dev=document.getElementById("isDevel").value;
function is_devel(){
if(is_dev=="true"){return true;}else{return false;}
}
var messy=null;
var forma=document.forms.namedItem("payment");
function set_price(el){
forma.price.value=el.getAttribute('data-price');
}

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
</script>
</body>
</html>`;
}
module.exports={purchase};