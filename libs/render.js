
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
html=ender('footer',{fuck: err,file:v,stack:err.stack});
}
return html;}
}
function ender(v,ops){
var fn=map.get(`${v}.js`);
return fn[v](ops) 
}