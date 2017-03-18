const koa=require('koa');
const Agenda=require('agenda');
const url=require('url');
const Pool=require('pg-pool');
var database_url='postgress://globik:null@localhost:5432/postgres';
var pars=url.parse(database_url);
var cauth=pars.auth.split(':');
var pconfig={
user:cauth[0],
password:cauth[1],
host:pars.hostname,
port:pars.port,
database: pars.pathname.split('/')[1],
ssl: false};

var app=koa();
var pool=module.exports=new Pool(pconfig);

pool.on('connect', client=>console.log('pool connected'));
pool.on('error', (err, client)=>console.log('error in pool: ', err.message));
pool.on('acquire', client=>console.log('pool acquired '));
var agenda=new Agenda({db:{address:pool}});

agenda.define('delete old users',function(job,done){
	console.log('defining job');
});

agenda.on('ready',function(){
	console.log('agenda is ready');
	agenda.every('3 seconds','delete old users');
	agenda.start();
});
agenda.start();
agenda.every('3 seconds','delete old users');

agenda.on('error',(e)=>{console.log(e);})
app.listen(process.env.PORT || 5000)
console.log('port 5000');