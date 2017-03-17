var koa=require('koa');
var PgBoss=require('pg-boss');
const database_url='postgress://globik:null@localhost:5432/postgres'
var boss=new PgBoss(database_url);
var PS=require('../libs/pg-subpub.js');
var app=koa();
boss.start().then(ready).catch(err=>console.log(err));

function ready(){
boss.subscribe('workbanner', (job,done)=>{
console.log(job.name,job.id,job.data);
done().then(()=>console.log('confirmed done'))
})
}	
/*
// trying simulate a router call. Within router path 
boss.connect().then(()=>{
// how many connections can one establish? 10? 20? 100?
console.log('Is connected');
boss.publish('work',{message:'sendPost'},{startIn:"6 seconds"}).then(jobid=>{
console.log(jobid);
boss.disconnect().then(()=>{console.log('Disconnected');});
// boss.subscribe('work') in  the 'ready' function does not work
//without boss.disconnect() - works great
});
});
*/
var ps=new PS(database_url);

ps.addChannel('events', msg=>{
console.log('msg: ', msg);

boss.publish('workbanner',{message:'ok banner start'},{startIn:msg.data.start}).then(jobid=>{
	console.log(jobid);
boss.publish('workbanner',{message:'nochbanner delete'},{startIn:msg.data.endi}).then(jobid=>{
	console.log(jobid);

})
})

							 
});
app.listen(process.env.PORT || 5000)
console.log('port 5000');