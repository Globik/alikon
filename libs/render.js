
var fs=require('fs');
var path=require('path');
var config=require('../config/database.js');
var map=new Map();
var reload=require('reloadjs');
var mama;
fs.readdirSync('./views').forEach(filename=> {
if(config.deva){	
 mama=reload(path.resolve(`views/${filename}`));}
else{mama=require(path.resolve(`views/${filename}`))}
	map.set(filename,mama)
});

module.exports=(app,settings)=>{
	if(app.context.render){return;}
	console.log(map);
	//var settings=settings || {};
	//if (!settings || !settings.root) {throw new Error('settings.root required');}
// settings.root = path.resolve(process.cwd(), settings.root);
	function render(v,ops){
		//console.log(v);console.log('ops :',ops);
		var fn=map.get(`${v}.js`);
	return fn[v](ops) }
	app.context.render=function(v,_context){
		var context = {};
	Object.assign(context,this.state,_context);
    var html = render(v,context);
	/* context.body = html;
	 var layout = context.layout === false ? false : (context.layout || settings.layout);
    if (layout){html = yield *render(layout, context);}*/return html;}}
