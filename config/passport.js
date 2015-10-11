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


//node index
passport.use('local-signup',new LocalStrategy({
	/***usernameField:'email',***/
	
passReqToCallback:true},
function(req,username,password,done){
process.nextTick(function(){
	
busers.findOne({'email':req.body.email},function(err,user){
if (err) return done(err);
if(user){
	//if(user.email == req.body.email){return done(null,false,{message:'fuck'})}
	console.log('is taken');
	console.log('user',user.email);//null
	console.log('req in db section', req.body.email);//email
	console.log('username :',username);//email

return done(null,false,{message:"Уже есть пользователь с таким имэйлом"});
}
 
 
else{
console.log('password in passport',password);
//console.log('email',email);
console.log('user in passp',username)//by email
console.log('req : '+req.body.email)
busers.insert({username:req.body.username,email:req.body.email,password:password},function(err,user){
	if(err) return done(err);
	console.log('new user',user);
return done(null,user,{message:'ОК - вносим в базу данных'});
}) 
}
})

})
}))
//fb
/*
passport.use(new FacebookStrategy({
    // clientID, clientSecret and callbackURL
    profileFields: ['id', 'displayName', 'photos']
  },
  // verify callback
));
*/
//console.log('process.env.FB_SECRET_KEY :',process.env.FB_SECRET_KEY);
var FacebookStrategy=require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
	clientID:"833998660009097",
	clientSecret:process.env.FB_SECRET_KEY,
	callbackURL:"http://alikon.herokuapp.com/auth/facebook/callback"
},function(accessToken,refreshToken,profile,done){
	process.nextTick(function(){
	var user=profile;
	return done(null,user)
	});
	}
	))
//end fb
//User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      //return done(err, user);
    //});
}