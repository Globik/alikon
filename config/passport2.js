
var LocalStrategy = require('passport-local').Strategy;

module.exports=function(db,passport){

passport.serializeUser(function(user, done) {
	console.log('USER IN SERIALIZEUSER: ',user);
	done(null, user.email);
});

passport.deserializeUser(function(email, done) {
	console.log('name: ',email);
db.query(`select name,role,mjoind,email,verif from busers where email='${email}'`,function(err,luser){
if(err){return done(err);}
	//console.log('DESERIAL_USER: ', luser);
	//for this.req.user in global haupt_page.html rendering
	/*
	let user={};
	user.name=luser.rows[0].name;
	user.role=luser.rows[0].role;
	user.mjoind=luser.rows[0].mjoind;
	user.email=luser.rows[0].email;
	user.verif=luser.rows[0].verif;
	user.id=luser.rows[0].id
	*/
	
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
return done(null, false, { message: 'wrong user or pwd ' + email}); 
}
/*	
if (user.rows[0] && user.rows[0].pwd != password) { 
	return done(null, false, { message: 'Invalid password' });} 
	*/
//console.log('User in pass local: ', user.rows[0]);
	//send to serialize function
	return done(null,user.rows[0]);
});
}) }
));


//node index
passport.use('local-signup',new LocalStrategy({
usernameField:'email',passReqToCallback:true},
function(req,email,password,done){
	console.log('!!! SIGN UP !!!! : ', email,password);
process.nextTick(function(){
	
db.query(`select email from busers where email='${req.body.email}'`,function(err,user){
	console.log('UUUSERNAME: ',user.rows[0]);
if (err) return done(err);
if(user.rows[0]){
	//if(user.email == req.body.email){return done(null,false,{message:'fuck'})}
	console.log('is taken');
	console.log('user',user.rows[0].email);//null
	console.log('req in db section', req.body.email);//email
	console.log('username :',email);//email
return done(null,false,{message:"Уже есть пользователь с таким имэйлом"});
}
 
 
else{
console.log('pwd in pwd: ',password);
console.log('user in passp',email)//by email
console.log('req : '+req.body)
db.query(`insert into busers(email,pwd,name) values('${req.body.email}',crypt('${req.body.password}',gen_salt('bf',8)),'${req.body.username}')`,
		 function(err,user){
	if(err) return done(err);
	console.log('new user',user);
return done(null,user.rows[0],{message:'ОК - вносим в базу данных'});
}) 
}
})

})
}))

}

/*
create table busers(id serial primary key,
email text not null,
pwd text not null, 
role text not null,
verif boolean not null default false,
name text not null,
mjoind timestamp not null default now()::timestamp);

2variant:

create table busers(
id serial primary key,
email text check(email~*'^.+@.+\..+$'),
pwd text not null check(length(pwd)<512),
role text not null,
verif boolean not null default false,
name text not null,
mjoind timestamp not null default now()::timestamp);
CREATE TABLE

insert into busers(email,pwd,role,verif,name) 
values(
'ag@example.ru',
crypt('password',gen_salt('bf',8)),
'superadmin',
true,
'nickname');
INSERT 0 1

3 variant:
create extension if not exists pgcrypto;
create table busers(
email text primary key check(email~*'^.+@.+\..+$'),
pwd text not null check(length(pwd)<512),
role text not null default 'not_memeber',
verif boolean not null default false,
name text not null,
mjoind timestamp not null default now()::timestamp);
CREATE TABLE
insert into busers(email,pwd,role,verif,name) values('aex.ru',crypt('',gen_salt('bf',8)),'sun',true,'k');
INSERT 0 1

*/