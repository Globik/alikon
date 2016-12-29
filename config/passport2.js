//var crypto=require('crypto');
//var  scmp=require('scmp');
//var configDB=require('./database.js');
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


passport.use(new LocalStrategy({},(username, password, done) =>{
	console.log('PASSWORD: ', password);
process.nextTick( ()=> {
	console.log('USERNAME: ',username);
db.query(`select*from busers where name='${username}' and pwd=crypt('${password}',pwd)`, function(err, user) {
if (err) { console.log('ERROR: ',err);
		  return done(err); }
if (!user.rows[0]) { 
return done(null, false, { message: 'wrong user or pwd ' + username }); 
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
	/***usernameField:'email',***/
	
passReqToCallback:true},
function(req,username,password,done){
process.nextTick(function(){
	
db.query(`select ${req.body.email} from users`,function(err,user){
	console.log('UUUSERNAME: ',user);
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
db.query(`insert into users(username,email,pwd) values(${req.body.username},${req.body.email},${password}`,
		 function(err,user){
	if(err) return done(err);
	console.log('new user',user);
return done(null,user,{message:'ОК - вносим в базу данных'});
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