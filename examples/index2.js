const http=require('http');
const hostname='127.0.0.1';
const port=3000;
console.log('process.env.database_url: ', process.env.DATABASE_URL);
const server=http.createServer((req,res)=>{
res.statusCode=200;
res.setHeader('Content-Type','text/plain');
res.end('Hello World\n');
});
server.listen(port/*,hostname*/,()=>{
console.log('Server running at ',process.env.PORT || port);
});