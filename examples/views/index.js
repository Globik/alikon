//module.invalidable=true;
const footer=require('./footer.js');
var buben=1;
const index=n=>{return `<html><body>
s
<br><br>locals:${n.title}
<b>m:</b>${n.mama}<br>
<footer>${footer.footer({})}</footer>
</body></html>`;
			   }

module.exports={index}