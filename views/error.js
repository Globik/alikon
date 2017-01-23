const head=require('./head.js');
const error = n =>{
return `<!DOCTYPE html><html lang="en"><head>
${head.head({title:"sign up", csslink:`${get_local_style()}`})}
</head>
<body>
<main id="pagewrap" style="background:pink;">
<a href="/">home</a>
<output id="outbox">
${n.message ? `<p class="green_message">${n.message}</p>`: ''}
${n.error ? `<p class="red_message">${n.error}</p>`: ''}
</output>
</main>
</body></html>`;
}
module.exports={error};
function get_local_style(){return `/css/login2.css`;}