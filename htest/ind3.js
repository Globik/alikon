//var pg=require('pg');
var Pool=require('pg-pool');
var url=require('url');
var koa=require('koa');
//var database_url='postgres://globik:null@localhost:5432/postgres';

var pars=url.parse(database_url);
var cauth=pars.auth.split(':');
console.log('user auth[0] ', cauth[0]);
console.log('pwd auth[1] ', cauth[1]);
console.log('host: ',pars.hostname);
console.log('port: ',pars.port);
console.log('db name: ',pars.pathname.split('/')[1]);
var pconfig={
user:cauth[0],
password:cauth[1],
host:pars.hostname,
port:pars.port,
database: pars.pathname.split('/')[1],
ssl:true
};var app=koa();
var port=process.env.PORT || 5000;

//var database_url='postgres://qqrmvxoiwrogtz:827e8b@ec2-54.compute-1.amazonaws.com:5432/ddhjhroi69bm6i';
var database_url=process.env.DATABASE_URL;
//var database_url='postgres://qqrmvxoiwrogtz:827ac1c006e9dee0dcd6c172a9c8277e8bf0cc8756b19f079ff56ef873c903c9@ec2-54-163-233-89.compute-1.amazonaws.com:5432/ddhjhroi69bm6i'
//host "217.118.83.202", user "host "217.118.83.202", user "qqrmvxoiwrogtz", database "ddhjhroi69bm6i", SSL off", database "ddhjhroi69bm6i", SSL off
//console.log('DATABASE_URL: ', process.env.DATABASE_URL);

var pconfig3={
user: "qqrmvxoiwrogtz",
host: "217.118.83.202",
database: "ddhjhroi69bm6i", 
ssl: false,
port:5432
};
//var pconfig={user:'globik', database:'postgres', password:null, host:'localhost', port:5432};
var pool=new Pool(pconfig);

app.use(function*(next){
try{
var start=new Date;
yield next;
var ms=new Date - start;
console.log('%s %s - %s ',this.method,this.url,ms);
}catch(err){
this.status=err.status || 500;
this.body=err.message;
this.app.emit('error',err,this);
}
});
app.use(function*(){
var kik=[];
try{
var resu=yield pool.query('select*from lab');
console.log('resultat: ',resu.rows);
resu.rows.forEach(function(el,i){
console.log('res2: ',el,i);
kik.push(el.name);
});

}catch(e){
console.log('Error in app.use request to db: ', e.stack.split('\n')[0]);

this.throw(e.stack.split('\n')[0], 500);
}
this.body="Hello World(koa.js)! "+kik.join(',');
});
app.listen(port);
console.log('Server is running on port ',port);
pool.on('error',(error, client)=>{
//console.log('Error in pool: ',error);
console.log('Client in pool on error: ');
});

pool.on('connect', client =>{console.log('Established pgsql-connection!!: ');
});

pool.on('acquire', client =>{console.log('pgsql-Acquired! : ');});

app.on('error',(err)=>{console.log('Error in app.on error: ',err.stack.split('\n')[0]);});
/*

Connection info string:
   "dbname=ddhjhroi69bm6i host=ec2-54-163-233-89.compute-1.amazonaws.com port=5432 user=qqrmvxoiwrogtz password=827ac1c006e9dee0dcd6c172a9c8277e8bf0cc8756b19f079ff56ef873c903c9 sslmode=require"
Connection URL:
   postgres://qqrmvxoiwrogtz:827ac1c006e9dee0dcd6c172a9c8277e8bf0cc8756b19f079ff56ef873c903c9@ec2-54-163-233-89.compute-1.amazonaws.com:5432/ddhjhroi69bm6i


*/
