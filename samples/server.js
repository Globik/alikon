var express=require('express');
var path=require('path');
var app=express();
app.set('port',3000);
//app.use('static',express.static(path.join(__dirname,'./html')));
app.use(express.static('./'));
var server=app.listen(app.get('port'),function(){
var port=server.address().port;
console.log("soll on port: ",port);
});
