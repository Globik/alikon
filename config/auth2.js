
const LocalStrategy=require('passport-local').Strategy;
const FacebookStrategy=require('passport-facebook').Strategy;

module.exports=(db,passport)=>{

passport.serializeUser(function(user,done){
done(null,user.email)
})

passport.deserializeUser(async (email,done)=>{
try{
const luser=await db.query(`select id,name,role,mjoind,email,verif,items,w_items,model,nick from busers where email='${email}'`)
done(null,luser.rows[0])
}catch(e){
done(e)
}
})

passport.use(new LocalStrategy({usernameField:'email',passwordField:'password'}, (email,password,done)=>{
process.nextTick(async()=>{
try{
let user=await db.query(`select*from busers where email='${email}' and pwd=crypt('${password}',pwd) `)
if(!user.rows[0]){return done(null,false,{message:'Wrong user email or password!'})}
return done(null,user.rows[0],{message:'Erfolgreich loged in!!!'})
}catch(err){return done(err)} 
})
}))

const nicky=email=>{return email.substring(0,email.indexOf("@"))}
const get_str=n=>`insert into busers(email,pwd,name,nick) values('${n.email}',crypt('${n.password}',gen_salt('bf',8)),'${n.username}','${n.nick}') 
returning name,role,mjoind,email,verif`

passport.use('local-signup',new LocalStrategy({usernameField:'email',passReqToCallback:true},(req,email,password,done)=>{
if(!req.body.username){return done(null,false,{message:"missing username",code:'1'})}	
process.nextTick(async()=>{
try{
var useri=await db.query(get_str({email:email,password:password,username:req.body.username,nick:(`${nicky(email)}` ? `${nicky(email)}`:'none')}))				 
return done(null,useri.rows[0],{message: `You're almost finished.<br><br>
We've sent an account activation email to you at <strong>${email}</strong>.
Head over to your inbox and click on the "Activate My Account" button to validate your email address.`})
}catch(err){
	//custom error handling
	if(err.code==='23505'){
	return done(null,false,{message:'Email already in use', code:err.code})
	}else if(err.code==='23514'){
	return done(null,false,{message:'Email validation failed', code:err.code})
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
let user=await db.query(`select*from busers where email='${femail}'`)
if(user.rows[0]){return done(null,user.rows[0])}else{
try{
let useri=await db.query(get_str({email:femail,password:fpassword,username:fname,nick:`${nicky(femail)}`}))
return done(null,useri.rows[0])
}catch(err){return done(err)}
}

}catch(er){return done(er)}
})
}))

}
