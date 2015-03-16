//config/passport.js
//var passport=require('koa-passport');
var monk=require('monk');
var configDB=require('./database.js');
 //var db= monk(configDB.url);
 //var db=monk(configDB.localurl);
//var db=monk("mongodb://localhost:27017/todo");
var db=require('../index');
//var db=monk(process.env.MONGOHQ_URL,{w:1});


module.exports=function(passport){
var busers = db.get('users');

passport.serializeUser(function(user, done) {
  done(null, user._id);});

passport.deserializeUser(function(_id, done) {
busers.findById(_id,function(err,user){
if(err){return done(err);}
done(null,user);
});
});
//iojs index
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
function(username, password, done) {
process.nextTick(function () {
busers.findOne({'username':username}, function(err, user) {
if (err) { return done(err); }
if (!user) { 
return done(null, false, { message: 'Unknown user ' + username }); }
if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
return done(null,user);
});});}));

}