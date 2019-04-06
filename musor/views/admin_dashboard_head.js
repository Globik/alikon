/* admin_dashboard_head.js */
const admin_dashboard_head =n =>{
let s='';
s+=`<meta charset="utf-8">
<title>${n.title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes"><link rel="shortcut icon" type="image/ico" href="/w4.png">
${n.css_admin ? link(n):''} ${n.script ? script(n):''}`;
return s;}
module.exports={admin_dashboard_head};
function link(n){
let s='';
if(Array.isArray(n.css_admin)){
n.css_admin.forEach(function(l){
s+=`<link href="${l}" rel="stylesheet">`;});
}
return s;
}

function script(n){
let s='';
if(Array.isArray(n.script)){
n.script.forEach(function(l){
s+=`<script src="${l}"></script>`;
});
}
return s;
}