var copy = require('copy-to'),ejs = require('ejs'),path=require('path'),fs=require('co-fs');
//console.log('ejs :',ejs);
var defaultSettings = {
  cache: true,layout: 'layout',viewExt: 'html',open: '<%',close: '%>',filters: {},locals: {},debug: false,
  writeResp: true,rmWhitespace:true,_with:true};
exports = module.exports=(app,settings)=>{
if (app.context.render) {return;}
if (!settings || !settings.root) { throw new Error('settings.root required');}
settings.root = path.resolve(process.cwd(), settings.root);
  var cache = Object.create(null);
copy(defaultSettings).to(settings);
settings.viewExt = settings.viewExt ? '.' + settings.viewExt.replace(/^\./, '') : '';
function *render(view, options) {
    view += settings.viewExt;var viewPath = path.join(settings.root, view);
if (settings.cache && cache[viewPath]) {return cache[viewPath].call(options.scope, options);}
var tpl = yield fs.readFile(viewPath, 'utf8');
    var fn = ejs.compile(tpl, {
      filename: viewPath,_with: settings._with,compileDebug: settings.debug,open: settings.open,
	  close: settings.close,rmWhitespace:settings.rmWhitespace});
    if (settings.cache) {cache[viewPath] = fn;}return fn.call(options.scope, options);}
app.context.render = function *(view, _context) {
    var context = {};merge(context, this.state);merge(context, _context);
var html = yield *render(view, context);
//console.log('view :',view);
//console.log('context :',context);
    var layout = context.layout === false ? false : (context.layout || settings.layout);
    if (layout) {context.body = html;html = yield *render(layout, context);}
	var writeResp = context.writeResp === false ? false : (context.writeResp || settings.writeResp);
if (writeResp) {this.type = 'html';this.body = html;}else{return html;}}}
exports.ejs = ejs;
function merge(target, source) {
  for (var key in source) {
    target[key] = source[key];
  }
}
