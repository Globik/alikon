//var pg_local_url='postgress://globik:null@localhost:5432/postgres';
const pg_local_url='postgress://globik:globik@localhost:5432/postgres';
//var pg_url=process.env.DATABASE_URL;
var tf=null;
if(process.env.DEVELOPMENT==='yes'){tf=true;}
module.exports={'localurl':'mongodb://127.0.0.1:27017/todo',
'url':process.env.MONGOHQ_URL,
				deva:tf,
pg_url: pg_local_url, pg_local_heroku_url:process.env.DATABASE_URL
};

/*
after postgresql  installation  createuser ... ; createdb ...
try  
psql -h localhost -d dbname
if no // globik=$(whoami)
1) sudo -u globik psql 
2) alter role globik unencrypted password 'globik'
need export also PGPASSWORD if so from the shell
*/