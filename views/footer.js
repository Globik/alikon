//footer.js
const footer=n=> `${styleIt()}<b>content.</b>

${n.fuck ? `<div class="errorstred"> ${n.fuck}</div>
<div class="errorst">In a file: <span class="errorange"> ${n.file}.js</span></div>
 - ${n.stack.replace(/\s at/g,'<br>at ')}`:``}
`;
module.exports={footer}; 
function styleIt(){
return `<style> .errorstred{background:red;}
.errorange{background:orange;}
</style>`;
}