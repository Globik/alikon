
const LocalStrategy=require('passport-local').Strategy;
//const FacebookStrategy=require('passport-facebook').Strategy;//zum Teufel

module.exports=(db, passport)=>{

passport.serializeUser((user,done)=>{
	//console.log('in serialize USERA: ',user);
done(null,user.id)
})

passport.deserializeUser(async (id,done)=>{
try{
const luser=await db.query('select id, bname, brole, age, buser_d  from busers where id=$1',[id])
done(null,luser.rows[0])
}catch(e){
done(e)
}
})

passport.use(new LocalStrategy({usernameField:'username',passwordField:'password'}, (username, password, done)=>{
	console.log("USERNAME AND PASSWORD: ",username,password);
process.nextTick(async()=>{
try{
let user=await db.query('select id from busers where bname=$1 and pwd=crypt($2,pwd)', [username, password])
if(!user.rows[0]){return done(null, false, {message:'Wrong user name or password!'})}
return done(null,user.rows[0],{message: 'Succsess! logged in!!!'})
}catch(err){return done(err)} 
})
}))

const nicky=email=>{return email.substring(0,email.indexOf("@"))}
const get_str=n=>`insert into busers(pwd, bname, age, fem) values(crypt(${n.password},gen_salt('bf',8)),${n.username},${n.age},
${n.fem}) returning id`;

passport.use('local-signup',new LocalStrategy({usernameField:'username',passReqToCallback:true},(req,username,password,done)=>{
if(!req.body.username){return done(null,false,{message:"missing username",code:'1'})}	
process.nextTick(async()=>{
try{
	console.log(username,password);
var useri=await db.query(get_str({password:'$1',username:'$2',age:'$3',fem:'$4'}),
[password,req.body.username,req.body.age,req.body.gender])
//console.log('USER.rows[0]: ',useri.rows[0])
return done(null,useri.rows[0],{message: `You're almost finished.<br><br>
We've sent an account activation email to you at <strong>the fuck you do</strong>.
Head over to your inbox and click on the "Activate My Account" button to validate your email address.`})
}catch(err){
	console.log('custom error handling in local signup auth.js: ', err.message);
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


}
