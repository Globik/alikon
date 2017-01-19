
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
	console.log('PASSWORD: ', password);
process.nextTick( ()=> {
	console.log('USERNAME: ', email);
db.query(`select*from busers where email='${email}' and pwd=crypt('${password}',pwd)`,(err, user)=>{
if (err) { console.log('ERROR: ',err);
		  return done(err); }
if (!user.rows[0]) { 
return done(null, false, { message: 'wrong user or pwd'}); 
}
	//send to serialize function
	return done(null,user.rows[0]);
});
}) }
));
passport.use('local-signup',new LocalStrategy({usernameField:'email',passReqToCallback:true},
(req,email,password,done)=>{
process.nextTick(()=>{
	db.query(`insert into busers(email,pwd,name) values('${req.body.email}',crypt('${req.body.password}',gen_salt('bf',8)),'${req.body.username}') 
returning name,role,mjoind,email,verif`, (err,useri)=>{
if (err) return done(err);
return done(null,useri.rows[0],{message:"OK saved a new user"});
})
})
}
))
											  											  
}