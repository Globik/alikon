const head=require('./head'),header_menu=require('./header_menu'),
	  {js_help}=require('../libs/helper.js'),devi=require('../libs/devi.js'),form_payment=require('./form_payment.js');
const bitaps=n=>{
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- bitaps.js --><head>${head.head({title:"Purchase Tokens"})}</head><body>
<a href="/">home</a>
<h1>Get Tokens - real mode</h1>
<div id="payoutinfo2"></div>
${form_payment.form_payment({buser,packs:n.packs})}
<div id="qrcont">
<a id="qrlink" href=""><img id="testimg" src=""/></a>
</div><div id="qraddr">
<div id="qr_address"></div>
<div id="btc_amount"></div>
</div>
${devi()?'<br><button onclick="dev_bitaps_cb();">devel_bitaps_cb</button><br>':''}
<output id="ssout"></output>
${js_help(["/js/common_bitaps.js"])}</body></html><!-- bitaps.js -->`;}
module.exports={bitaps}