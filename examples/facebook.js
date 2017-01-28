var passport=require('passport');
function bo(passport){
	var FacebookStrategy=require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
	clientID:"833998660009097",
	clientSecret:process.env.FB_SECRET_KEY,
	callbackURL:/*"http://alikon.herokuapp.com/auth/facebook/callback"*/
	"http://localhost:3000/auth/facebook/callback"
},function(accessToken,refreshToken,profile,done){
	process.nextTick(function(){
		console.log(accessToken, refreshToken, profile);
		return done(null,"user");
	/*	busers.findOne({'username':profile.name.givenName}, function(err, user) {
        if (err) { return done(err); }
	console.log('PROFILE :',profile)
	console.log('User in DB :',user);
		if(user) return done(null,user);}) */
	});
	}
	))
	
	
}