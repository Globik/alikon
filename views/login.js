//login.js
const head=require('./head.js'),
	  login_css=require('./login_css.js'),
	  login_proto=require('./login_proto.js');
const {js_help}=require('../libs/helper.js');
const login= n =>{
let {showmodule:{mainmenu,profiler}}=n;
const buser=n.user;
//console.log('busery me',n.user.name)
return `<!DOCTYPE html><html lang="en"><head>${head.head({title:"Log in",cssl:["css/login2.css"]})}</head>
<body>
<main id="pagewrap">
${login_proto.login_proto(n)}
</main></body>
${js_help(['/js/login.js'])}
</html>`;}
module.exports={login};