
const LocalStrategy = require('passport-local').Strategy;

module.exports=(db,passport)=>{

passport.serializeUser((user, done)=> {
	console.log('USER IN SERIALIZEUSER: ',user);
	done(null, user.email);
});

passport.deserializeUser((email, done)=> {
	console.log('name: ',email);
db.query(`select name,role,mjoind,email,verif from busers where email='${email}'`,(err,luser)=>{
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
return done(null, false, { message: 'wrong user or pwd'}); 
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
											  											  
}
