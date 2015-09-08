var session = require('koa-mongodb-session');
//var mongodb = require('mongodb');
//var mongo = mongodb.MongoClient;
var MongoStore=require('koa-generic-session-mongo');
var koa = require('koa');
var monk=require('monk');
var wrap=require('co-monk');
var Agenda=require('Agenda');
var agenda=new Agenda({db:{address:'127.0.0.1:27017/todo'}});
  var db=monk("mongodb://127.0.0.1:27017/todo");
 //var db=monk(process.env.MONGOHQ_URL,{w:1});

//var tasks=wrap(db.get('tasks'));
var busers = db.get('users');

agenda.define('reklama',{priority:'high',concurrency:10},function(job,done){
 busers.find({}).on('success',function(doc){;
console.log(doc);
console.log('es geht.');
var data=job.attrs.data;
	console.log(data.to);});
done();
});
agenda.schedule('in 5 seconds','reklama',{to:'off'});
agenda.start();

 //  busers.find({}).on('success',function(doc){;
//console.log(doc);});

//mongo.connect('mongodb://localhost/test2', function(err, db){
  //if (err) throw err;

  var app = koa();
  app.keys = ['some secret'];
  app.use(session({sid:'we',collection:wrap(db.get('sessions2'))}));
//app.use(session(new MongoStore()));

  app.use(function *(){
    this.session.$inc('views', 1);
    this.body = this.session.views + ' views';
  })
//node app4
  app.listen(3000);
  console.log('listening on http://localhost:3000');