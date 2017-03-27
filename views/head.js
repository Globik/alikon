// head.js
var head=(n)=>
`<!-- head.js -->
<meta charset="utf-8">
<title>${n.title ? n.title : "Simple title"}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes">
<!-- here must be socials metatags - twitter,fb -->
<link rel="shortcut icon" type="image/ico" href="/images/w4.png"> 

${n.csslink ? `<link href="${n.csslink}" rel="stylesheet">` :''}
${n.csslink2 ? `<link href="${n.csslink2}" rel="stylesheet">` : ''}
${n.cssl ? get_cssl(n) : ''}
${n.csshelper ? `<style>${n.csshelper}</style>`:``}
<script>
var html=document.getElementsByTagName("html")[0],dtct=document.createElement('div');
dtct.style.display='flex';if(dtct.style.display === 'flex'){html.className='flex';}</script>  
<!--[if lt IE 9]><script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
<!--[if lt IE 9]><script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script><![endif]-->
${n.js ? get_js(n):''}
`;
module.exports={head};

function get_cssl(n){
let s='';
n.cssl.forEach((el,i)=>{
s+=`<link href="${el}" rel="stylesheet">`;
})
return s;
}
function get_js(n){
let s='';
n.js.forEach((el,i)=>{
s+=`<script src="${el}"></script>`;
})
return s;
}