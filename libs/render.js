
const fs=require('fs');
const path=require('path');
const map=new Map();
const reload=require('reloadjs');

var mama;
function vov(ms, pleva){
fs.readdirSync(`./${ms}`).forEach(filename=> {
if(pleva){	
 mama=reload(path.resolve(`${ms}/${filename}`));}
else{
mama=require(path.resolve(`${ms}/${filename}`))}
map.set(filename,mama);
});
}
module.exports=(app,settings={})=>{
if(app.context.render){return;}
if (!settings || !settings.root) {throw new Error('settings.root required');}
vov(settings.root, settings.development)
app.context.render=function(v,_context){
var context = {};
Object.assign(context,this.state,_context);
var html;
try{	
html=ender(v,context);
} catch(err){
html=errshow({ferr:err,file:v,stack:err.stack})
}
return html;}
}
function ender(v,ops){
var fn=map.get(`${v}.js`);
if(fn){
	console.log('fn: ',fn)
//console.log('IS FN[V] typeof FUNCTION ???: ',(typeof fn[v]==='function'))
return fn[v](ops)}else{throw new Error('not a function fn[v]')} 
}

function errshow(n){
let styleIt=()=>{return `<style> 
.errorstred{background:red;}
.errorange{background:orange;}
</style>`}
return `${styleIt()}<b>Error: </b>
${n.ferr ? `<div class="errorstred"> ${n.ferr}</div>
<div class="errorst">In a file: <span class="errorange"> ${n.file}.js</span></div>
${n.stack.replace(/\s at/g,'<br>at ')}`:``}
`;
}