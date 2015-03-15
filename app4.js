var session = require('koa-mongodb-session');
//var mongodb = require('mongodb');
//var mongo = mongodb.MongoClient;
var MongoStore=require('koa-generic-session-mongo');
var koa = require('koa');
var monk=require('monk');
var wrap=require('co-monk');
  var db=monk("mongodb://localhost:27017/todo");
 //var db=monk(process.env.MONGOHQ_URL,{w:1});

var tasks=wrap(db.get('tasks'));
var busers = db.get('users');

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

  app.listen(3000);
  console.log('listening on http://localhost:3000');