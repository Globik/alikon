
var fs=require('fs');
var path=require('path');
var config=require('../config/database.js');
var map=new Map();
var reload=require('reloadjs');
var mama;
//console.log('div :',config.deva)
fs.readdirSync('./views').forEach(filename=> {
	//console.log(filename);
if(config.deva){	
 mama=reload(path.resolve(`views/${filename}`));}
else{mama=require(path.resolve(`views/${filename}`))}
	map.set(filename,mama)
});

//console.log('map :',map);
module.exports=(app,settings)=>{
	if(app.context.render){return;}
	console.log(map);
	//var eda=map.get('admin_dashboard.js');
	//var eda2=require('../views/'+eda);
	//console.log('eda2 :',eda2.admin_dashboard({buser:"a"}))
	//var settings=settings || {};
	//if (!settings || !settings.root) {throw new Error('settings.root required');}
// settings.root = path.resolve(process.cwd(), settings.root);
//npm start
	function render(v,ops){
		//console.log(v);
		//console.log('ops :',ops);
		var fn=map.get(`${v}.js`)
		//var fn=require(`../views/${v}.js`)
	return fn[v](ops) }
	app.context.render=function(v,_context){
		var context = {};
    //merge(context, this.state);
    //merge(context, _context);
	Object.assign(context,this.state,_context);
    var html = render(v,context);
	/* context.body = html;
	 var layout = context.layout === false ? false : (context.layout || settings.layout);
    if (layout){html = yield *render(layout, context);}*/return html;}}
//function merge(target, source) {for (var key in source) {target[key] = source[key];}}
