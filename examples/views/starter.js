const starter=n=>{
return `<html><body><a href="/roomer">roomer</a><br><h1>Starter</h1>
${n.bu ? go_bu(n.bu) :''}
</body></html>`
}
module.exports={starter}

function go_bu(n){
let s='';
n.forEach((el,i)=>{
s+=`<div><li>name: ${el.username}
<li>id: ${el.id}
<li>email: ${el.email}
</div><hr>`;
})
return s;
}