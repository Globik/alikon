var lay=0;
var fs=require('fs');
var path=require('path');
var config=require('../config/database.js');
var map=new Map();
var reload=require('reloadjs');
var mama;
fs.readdirSync('./views').forEach(filename=> {
if(config.deva){	
//console.log('MAMA IS DA');
 mama=reload(path.resolve(`views/${filename}`));}
else{
//console.log('NOT HOT RELOAD>JS');
	mama=require(path.resolve(`views/${filename}`))}
	//console.log('filename: ',filename);
	//console.log('mama: ',mama.head);
	map.set(filename,mama);

});
/*
var main_s=["articles_page","haupt_page","login","admin_dashboard","admin_dashboard_articles",
"admin_dashboard_mongodb","vidget_disk_space"];
main_s.forEach(function(el,i){
	console.log(el);
	mama=require(path.resolve(`views/${el}.js`));
	console.log('mama: ',el);
	map.set(el+'.js',mama);
	
})
*/
module.exports=(app,settings)=>{
	if(app.context.render){return;}
	//console.log(map);
	//var settings=settings || {};
	//if (!settings || !settings.root) {throw new Error('settings.root required');}
// settings.root = path.resolve(process.cwd(), settings.root);
	/*function ender(v,ops){
	//console.log(v);console.log('ops :',ops);
	var fn=map.get(`${v}.js`);
		console.log('func V: ',fn);
		//console.log('ops: ',ops);
return fn[v](ops) 
	}*/
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
	//console.log(v);console.log('ops :',ops);
	//if(v=="haupt_page"){return;}
	console.log('v: ',v);
	var fn=map.get(`${v}.js`);
		//console.log('ops: ',ops);
		lay+=1;
		console.log('lay: ',lay);
return fn[v](ops) 
	}