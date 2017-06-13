var express=require('express');
var app=express()

var port=5000;
var i=0;
//var index2=require('./views/index2.js');
var fs=require('fs');
const path=require('path');
const map=new Map();

const reload=require('../../koa/node_modules/hotreloader');

var mama;
function vov(ms, pleva){
fs.readdirSync(`./${ms}`).forEach(filename=> {
if(path.extname(filename)==='.js'){
if(pleva){	
 mama=reload(path.resolve(`${ms}/${filename}`));}
else{
mama=require(path.resolve(`${ms}/${filename}`))}
map.set(filename,mama);
}
});
}

app.locals.title="My awsome application";
app.use((function(opt){
	if (!opt || !opt.root) {throw new Error('settings.root required');}
	console.log('opt.root: ',opt.root)
	vov(opt.root, opt.development)
	return function(req,res,next){
		console.log('req.app.locals.title: ',req.app.locals.title)
	res.compile=function(v,ops){
		var context={};
		Object.assign(context,req.app.locals,ops)
		var html;
try{	
html=end(v,context);
	//console.log('html: ',html)
	function end(v,ops){
	var fn=map.get(`${v}.js`);
		//console.log('V: ',v);
		//console.log('FN: ',fn);
return fn[v](ops) 
	}

}catch(er){html=`error: ${er} in file: ${v}.js stack: ${er.stack}`;}
		return html;
}
	res.rendel=function(v,ops){
	return res.send(res.compile(v,ops))
	}
	function end(v,ops){
	var fn=map.get(`${v}.js`);
return fn[v](ops) 
	}
next();
	}
})({root:'views',development:true}))
app.get('/',(req,res)=>{

	res.rendel('index',{mama:"baba"})
})
app.get('/m',(req,res)=>{
//res.rendel('index2',{mama:"abba"})
	res.send({info:'OK',body:res.compile('index2',{mama:'starik'})})
})
app.listen(port)
console.log(port)
/*
function render(view, options, callback) {
  var app = this.req.app;
  var done = callback;
  var opts = options || {};
  var req = this.req;
  var self = this;

  // support callback function as second arg
  if (typeof options === 'function') {
    done = options;
    opts = {};
  }

  // merge res.locals
  opts._locals = self.locals;

  // default callback to respond
  done = done || function (err, str) {
    if (err) return req.next(err);
    self.send(str);
  };

  // render
  app.render(view, opts, done);
}
*/