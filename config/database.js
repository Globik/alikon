var pg_local_url='postgress://globik:null@localhost:5432/postgres';
var dev_mode=process.env.DEVELOPMENT;
var tf;var pg_url;var ssl;
if(dev_mode==='yes'){tf=true;ssl=false}else{tf=false;ssl=true}
if(tf===true){pg_url=pg_local_url;}else{pg_url=process.env.DATABASE_URL;}
module.exports={'localurl':'mongodb://127.0.0.1:27017/todo',
'url':process.env.MONGOHQ_URL,
				deva:tf,
pg_local_url/*:'postgress://globik:null@localhost:5432/postgres'*/,
pg_url, pg_local_heroku_url:process.env.DATABASE_URL,
				ssl
};
