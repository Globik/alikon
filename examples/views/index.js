//module.invalidable=true;
const footer=require('./footer.js');
var buben=1;
const index=n=>{return `<html><body>
sister
<br><br>locals:${n.title}| ${n.fitle} DURAK 22
<b>m:</b>${n.mama}<br>
<footer>${footer.footer({})}</footer>
</body></html>`;
			   }

module.exports={index}