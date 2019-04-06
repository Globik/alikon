exports.showMessage=function(agenda,data){
agenda.define('show message',function(job,done){
console.log(data);
//var string=data;
done();
});
}