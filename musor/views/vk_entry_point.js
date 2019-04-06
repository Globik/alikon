const head=require('./head');
//${head.head({title:"hello vk group"})}
const vk_entry_point=(n)=>{
return `<!DOCTYPE html><html lang="en"><!-- vk_entry_point.js --><head>
<title>hello vk</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes">

<link rel="shortcut icon" type="image/ico" href="/images/w4.png"> 


</head><body>
<h1>Hello World!</h1><span> must be in vk</span></body></html>`;	
}
module.exports={vk_entry_point}
