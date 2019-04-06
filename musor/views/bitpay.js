//bitpay.js
const head=require('./head'),header_menu=require('./header_menu'),{js_help}=require('../libs/helper.js'),devi=require('../libs/devi.js'),
	  form_payment=require('./form_payment.js');
const bitpay=n=>{
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- bitpay.js -->
<head>${head.head({title:"Purchase Tokens",js:["https://bitpay.com/bitpay.min.js"]})}</head><body>
<a href="/">home</a>
<h1>Get Tokens - test mode</h1>
<div id="payoutinfo2"></div>
${form_payment.form_payment({buser,packs:n.packs})}
${js_help(["/js/common_bitpay.js"])}</body></html>`;
}
module.exports={bitpay};