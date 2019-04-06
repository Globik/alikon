const head=require('./head.js');
const email_validation=n=>{
return `<!DOCTYPE html><html lang="en"><head>
${head.head({title:"email validation"})}
</head>
<body>
<main id="pagewrap" style="background:pink;">
<a href="/">home</a>
${n.error==null ? `<span id="ok" data-red="${n.redirect}">${n.message}</span>` : 
`<span id="ok" data-red="${n.redirect}">${ n.error}</span>`}
</main>
<script>
setTimeout(boo,4000);
//alert(ok.getAttribute("data-red"));
function boo(){
var ok=document.getElementById("ok");
window.location.href=ok.getAttribute("data-red");
}
</script>
</body>
</html>`;
}
module.exports={email_validation};
