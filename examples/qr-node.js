var {Encoder,Levels}=require('qr-node');

Encoder.encode('http://example.com',null,{background_color:'#76eec6',
foreground_color:'#ff0000'
,level:Levels.HIGH, dot_size:12,margin:8}).then(data=>{
console.log('data: ','data:image/png;base64,'+data.toString('base64'))
}).catch(e=>{console.log('error: ',e)})
// -s -m dot_ size and margin default 3 and 4