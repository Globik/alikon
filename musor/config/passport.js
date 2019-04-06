var crypto=require('crypto');
var  scmp=require('scmp');
var ObjectID=require('mongodb').ObjectID;
var configDB=require('./database.js');
var LocalStrategy = require('passport-local').Strategy;

module.exports=function(db,passport){
var busers=db.collection('users');

passport.serializeUser(function(user, done) {
	console.log('user._id :',user._id)
  done(null, user._id);});

passport.deserializeUser(function(_id, done) {
busers.findOne({_id:ObjectID(_id)},function(err,user){
if(err){return done(err);}
done(null,user);
});
});
//node --harmony index


passport.use(new LocalStrategy({},(username, password, done) =>{
process.nextTick( ()=> {
busers.findOne({'username':username}, function(err, user) {
if (err) { return done(err); }
if (!user) { 
return done(null, false, { message: 'Unknown user ' + username }); }
/*if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }*/
crypto.pbkdf2(password,/*user.salt*/'salt',10000,64,(er,bi)=>{
if(er){return done(er);}
if(scmp(bi.toString('base64'),user.password)){
return done(null,user);}
else{
return done(null,false,{message :'Invalid Password!'});
}
//return done(null,user);
});});}) }
));


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
//username|profile.name.givenName
//console.log('process.env.FB_SECRET_KEY :',process.env.FB_SECRET_KEY);
var FacebookStrategy=require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
	clientID:"833998660009097",
	clientSecret:process.env.FB_SECRET_KEY,
	callbackURL:"http://alikon.herokuapp.com/auth/facebook/callback"
	/*"http://localhost:3000/auth/facebook/callback"*/
},function(accessToken,refreshToken,profile,done){
	process.nextTick(function(){
		busers.findOne({'username':profile.name.givenName}, function(err, user) {
        if (err) { return done(err); }
	console.log('PROFILE :',profile)
	console.log('User in DB :',user);
		if(user) return done(null,user);})
	});
	}
	))
//end fb
//User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      //return done(err, user);
    //});
}