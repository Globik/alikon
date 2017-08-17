//adm_abuse_list
let adm_abuse_list=n=>{
return `<ul>${form_abuse_list(n)}</ul>`;
}
module.exports={adm_abuse_list}
function form_abuse_list(n){
let s='';
n.abuse_list.forEach((el,i)=>{
s+=`<li class="abuseli" data-aid="${el.id}" data-abnick="${el.by_nick}" ${el.cmnt?`title="${el.cmnt}"`:''} data-atit="${el.at_t}">
<a href="/webrtc/${el.name}" target="_blank">${el.name}</a>&nbsp;${el.slc}`;
})
return s;
}
//id by_nyck slc cmnt us_id at_t name