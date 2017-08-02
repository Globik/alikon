
const LocalStrategy=require('passport-local').Strategy;
const FacebookStrategy=require('passport-facebook').Strategy;

module.exports=(db,passport)=>{

passport.serializeUser((user,done)=>{
	//console.log('in serialize USERA: ',user);
done(null,user.id)
})

passport.deserializeUser(async (id,done)=>{
try{
const luser=await db.query(`select id,name,role,verif,items, w_items,model from busers where id=$1`,[id])
done(null,luser.rows[0])
}catch(e){
done(e)
}
})

passport.use(new LocalStrategy({usernameField:'email',passwordField:'password'}, (email,password,done)=>{
process.nextTick(async()=>{
try{
let user=await db.query(`select id from busers where email=$1 and pwd=crypt($2,pwd) `,[email,password])
if(!user.rows[0]){return done(null,false,{message:'Wrong user email or password!'})}
return done(null,user.rows[0],{message:'Erfolgreich loged in!!!'})
}catch(err){return done(err)} 
})
}))

const nicky=email=>{return email.substring(0,email.indexOf("@"))}
const get_str=n=>`insert into busers(email,pwd,name) values(${n.email},crypt(${n.password},gen_salt('bf',8)),${n.username}) 
returning id`;//,name,role,email,verif`

passport.use('local-signup',new LocalStrategy({usernameField:'email',passReqToCallback:true},(req,email,password,done)=>{
if(!req.body.username){return done(null,false,{message:"missing username",code:'1'})}	
process.nextTick(async()=>{
try{
var useri=await db.query(get_str({email:'$1',password:'$2',username:'$3'}),[email,password,req.body.username])
//console.log('USER.rows[0]: ',useri.rows[0])
return done(null,useri.rows[0],{message: `You're almost finished.<br><br>
We've sent an account activation email to you at <strong>${email}</strong>.
Head over to your inbox and click on the "Activate My Account" button to validate your email address.`})
}catch(err){
	console.log('custom error handling: ',err.message);
	if(err.code==='23505'){
		let dru='';let bcode=0;
		if(err.detail.includes('name')){
			dru='The nickname is already in use.';
			bcode=1;
		}else if(err.detail.includes('email')){
			dru='The email already exists. ';
			bcode=2;
		}else{
			drue=err.message;
		}
		
	return done(null,false,{message:dru, code:err.code, bcode:bcode})
	}else if(err.code==='23514'){
	return done(null,false,{message:'Email validation failed', code:err.code,bcode:3})
	}else{
		return done(err)
	}
}				 
})
}))

var loc_fb;
if(process.env.DEVELOPMENT==='yes'){
loc_fb='http://localhost:5000/auth/facebook/callback';
}else{}
passport.use(new FacebookStrategy({
	clientID:process.env.FB_CLIENT_ID,
	clientSecret:process.env.FB_SECRET_KEY,
	callbackURL:loc_fb,
	profileFields:['id','emails','name'],
	returns_scops:true},(accessToken,refreshToken,profile,done)=>{
process.nextTick(async ()=>{
var sata=profile._json;
	var femail='';
	console.log('profile: ',profile)
	if(!sata.email){
	femail=`${profile.id}@fb.com`;
	}else{
	femail=sata.email;
	}
const fpassword=profile.id;
const fname=sata.first_name+' '+sata.last_name;
try{
let user=await db.query(`select*from busers where email=$1`,[femail])
if(user.rows[0]){return done(null,user.rows[0])}else{
try{
let useri=await db.query(get_str({email:'$1',password:'$2',username:'$3'}),[femail,fpassword,fname])
return done(null,useri.rows[0])
}catch(err){return done(err)}
}

}catch(er){return done(er)}
})
}))

}
