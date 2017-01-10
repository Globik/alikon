var der=require('diskspace');
var ds=require('fd-diskspace');
var ser=(1024*1024*1024);
der.check('C', function (err, total, free, status)
{
	console.log('Total: ',total/ser);
console.error('free space: ',free/ser);
});

ds.diskSpace(function(err,res){
if(err) console.log(err);
//console.log('res: ',res);
console.log('free: ',res.total.free/ser);
console.log('size: ',res.total.size/ser);
console.log('used: ',(res.total.used/ser).toFixed(0));
console.log('percent: ',res.total.percent);
});
/*
res.total:{free,size,used,percent}

*/