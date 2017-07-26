//login.js
const head=require('./head.js');
const login_css=require('./login_css.js');
const login_proto=require('./login_proto.js');
const dev_user=process.env.DEV_USER;
const dev_pwd=process.env.DEV_PWD;
const timeout_login=5000;
const dev_email=process.env.DEV_EMAIL;
const login= n =>{
let {showmodule:{mainmenu,profiler}}=n;
const buser=n.user;
var fu=true;
let messi=m=>{
console.log('msg: ',m)
let s='';
if(m.success==false){
if(m.code){
if(m.code=='23505'){s+=' User email already exists';fu=false;}else{s+=`${m.error ? m.error : ''}`}
}else{s+=`${m.error ? m.error : ''}`;}
}else if(m.success==true){s+=`${m.msg ? m.msg : ''}`}else{}
return s;
}
	
return `<!DOCTYPE html><html lang="en"><head>${head.head({title:"Log in",cssl:["css/login2.css"]})}</head>
<body>
<main id="pagewrap">
${login_proto.login_proto(n)}
</main></body>
${get_js(['/js/login.js'])}
</html>`;}
module.exports={login};
function getCssLink(){return `/css/login2.css`;}
function get_js(n){
let s='';
n.forEach((el,i)=>{
s+=`<script src="${el}"></script>`;
})
return s;
}