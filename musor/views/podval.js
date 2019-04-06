/* podval.js */
var podval= n=>{
let s="";
s+=`${n.podva ? podvali(n):''}`;
return s;
}
module.exports={podval};
function podvali(n){
let s='';
if(Array.isArray(n.podva)){
n.podva.forEach(function(el){
s+=`<script src=${el}></script>`;
});
}
return s;
}