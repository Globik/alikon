//login.js
var head=require('./head'),
    header_menu=require('./header_menu');
    
var login=(n)=>
`<!DOCTYPE html><html lang="en"><head>${head.head({title:"Log in",csslink:`${getCssLink()}`})}</head>
<body><nav class="back">${header_menu.header_menu({})}</nav>
<main id="pagewrap" style="backround:pink;">
${(n.message && n.message.length > 0 ? `<span id="red-warnig">${n.message}</span>` : ``)}
<div class="form-box">
<h2>ki</h2>
<form action="/login" method="post">
<div class="group">
<input type="text" name="username" value="" placeholder="Username" required />
<input type="password" name="password" value="" placeholder="Password" required />
</div>
<button>Sign In</button>
<p>No account yet? <a href="">Create one</a></p>
<!-- Already a member? Login -->
</form>
</div>
</main></body></html>`;
module.exports={login};
function getCssLink(){return `<link href="/css/login.css" rel="stylesheet">`;}