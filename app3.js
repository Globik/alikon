var koa = require('koa');
var session = require('koa-generic-session');
var MongoStore = require('koa-generic-session-mongo');
/***
public/images/upload/**
!public/images/upload/**/


***/
var app = koa();
app.keys = ['keys', 'keykeys'];
app.use(session({
  store: new MongoStore()
}));

app.use(function *() {
  switch (this.path) {
  case '/get':
    get.call(this);
    break;
  case '/remove':
    remove.call(this);
    break;
  }
});

function get() {
  var session = this.session;
  session.count = session.count || 0;
  session.count++;
  this.body = session.count;
}

function remove() {
  this.session = null;
  this.body = 0;
}

app.listen(8080);console.log(8080);