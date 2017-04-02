
const LocalStrategy = require('passport-local').Strategy;


module.exports=(db,passport)=>{

passport.serializeUser((user, done)=> {
	console.log('USER IN SERIALIZEUSER: ',user);
	done(null, user.email);
});

passport.deserializeUser((email, done)=> {
	console.log('name: ',email);
db.query(`select id, name,role,mjoind,email,verif,items,w_items from busers where email='${email}'`,(err,luser)=>{
if(err){return done(err);}
	//for this.req.user in global haupt_page.html rendering
done(null,luser.rows[0]);
});
});


passport.use(new LocalStrategy({usernameField:'email',passwordField:'password'},(email, password, done) =>{
process.nextTick( ()=> {
db.query(`select*from busers where email='${email}' and pwd=crypt('${password}',pwd)`,(err, user)=>{
if (err) { console.log('ERROR: ',err);
		  return done(err); }
if (!user.rows[0]) { 
return done(null, false, { message: 'Wrong user email or password!'}); 
}
	//send to serialize function
	return done(null,user.rows[0]);
});
}
				) }
));
var get_str=n=> `insert into busers(email,pwd,name) values('${n.email}',crypt('${n.password}',gen_salt('bf',8)),'${n.username}') 
returning name,role,mjoind,email,verif`;
	
passport.use('local-signup',new LocalStrategy({usernameField:'email',passReqToCallback:true},(req,email,password,done)=> process.nextTick(()=>
db.query(get_str({email:req.body.email,password:req.body.password,username:req.body.username}), (err,useri)=>{
if (err) return done(err);
return  done(null,useri.rows[0],{message:"OK saved a new user"});
	})
)

))
		

var FacebookStrategy=require('passport-facebook').Strategy;
	var loc_fb='';var loc_vk='';
	if(process.env.DEVELOPMENT==='yes'){
	loc_fb="http://localhost:5000/auth/facebook/callback";
	loc_vk="http://localhost:5000/auth/vkontakte/cb";
	}else{
	loc_fb="https://alikon.herokuapp.com/auth/facebook/callback";
	loc_vk="https://alikon.herokuapp.com/auth/vkontakte/cb";
	}
passport.use(new FacebookStrategy({
	clientID:process.env.FB_CLIENT_ID,
	clientSecret:process.env.FB_SECRET_KEY,
	callbackURL:loc_fb,
	profileFields:['id','emails','name'],
	returns_scops:true
},function(accessToken,refreshToken, profile,done){
	process.nextTick(function(){
		var sata=profile._json;
		var femail='';
		console.log('profile: ', profile);
		//return done(null,{email:"fb@.me.ru"});
		if(!sata.email){
		femail=`${profile.id}@fb.com`;
		}else{femail=sata.email;}
		var fpassword=profile.id;
		var fname=sata.first_name+' '+sata.last_name;
		console.log(femail);
		db.query(`select * from busers where email='${femail}'`,(err,user)=>{
			if(err){return done(err);}
			if(user.rows[0]){return done(null,user.rows[0]);}else{
		//})
	
		db.query(get_str({email:femail,password:fpassword, username:fname}), function(err, user) {
        if (err) { console.log('err within fb insert user: ',err.message);
				  return done(err); }
console.log('fb user.rows[0] :' ,user.rows[0]);
			return done(null,user.rows[0]);
		})  } })
 
		})
}))
	const VkontakteStrategy = require('passport-vkontakte').Strategy;
passport.use(new VkontakteStrategy({
clientID: process.env.VK_ID,
clientSecret: process.env.VK_SECRET,
callbackURL:loc_vk,
scope:['email'],
profileFields:['email']}, (accessToken,refreshToken, params, profile, done)=>{
	process.nextTick(()=>{
	console.log('vk Profile: ', profile);
	console.log('params!: ', params);
	console.log('accessToken: ', accessToken);
	console.log('refreshToken: ', refreshToken);
var sata=profile._json;
var vmail='';
if(!params.email){
vmail=`${profile.id}@vk.com`;
}else{vmail=params.email;}
var vpassword=profile.id;
var vname=sata.first_name+' '+sata.last_name;
db.query(`select * from busers where email='${vmail}'`, (err,user)=>{
if(err){return done(err);}
if(user.rows[0]){return done(null,user.rows[0]);}else{
	
db.query(get_str({email:vmail, password:vpassword, username:vname}), (err, user) =>{
if (err) { console.log('err within fb insert user: ',err.message);
return done(err); }
console.log('VK user.rows[0] :' ,user.rows[0]);
return done(null,user.rows[0]);
		})  } })
		
	
	}
					
	)}
								  
	))






}
