exports.setupJobs=function(data){
var sampleJob=require('./jobs/sample-job.js');
var Agenda=require('Agenda');
var agenda=new Agenda({db:{address:'localhost:27017/todo'}});
sampleJob.showMessage(agenda,data);
agenda.every('5 seconds','show message');
agenda.start();
}
//collection from mongodb: db.agendaJobs.find()