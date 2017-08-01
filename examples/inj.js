const Pool=require('pg-pool')
const url=require('url')
const configDB=require('../config/database.js')
const database_url=configDB.pg_url;
const pars=url.parse(database_url)
const cauth=pars.auth.split(':')
//var pgn=require('pg-native');
var pgn=require('pg').native.Client;
const pconfig={
user:cauth[0],
password:cauth[1],
host:pars.hostname,
port:pars.port,
database:pars.pathname.split('/')[1],
ssl:false,
Client:pgn
}
const pool=new Pool(pconfig)
var name='globik';
var n="';drop table fick; --";
var st=`select*from busers where name='${n}'`;
var st2="select*from busers where name='"+n+"'";
var st3='select*from busers where name=$1';
console.log(st2)
pool.query(st3,[name]).then(res=>{
console.log('result: ',res.rows[0])
}).catch(e=>{console.log('err: ',e)})

function dos(ni){
return `select from busers where name='${ni}'`;
}