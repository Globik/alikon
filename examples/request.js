var request=require('request');
//richtig:
var uri2=`https://appi:${process.env.TMAILGUNAPIKEY}@api.mailgun.net/v3/${process.env.TMAILGUN_DOMAIN}/stats/total?event=delivered`;
var uri3=`https://appi:${process.env.TMAILGUNAPIKEY}@api.mailgun.net/v3/${process.env.TMAILGUN_DOMAIN}/messages`;

var uri4='https://api:key-4a36b59263e3b48b86d3979bf0d2a12f@api.mailgun.net/v3/appb17d1ae4924645aab6a69471af346072.mailgun.org/stats/total?event=delivered';
var uri5='https://api:key-4a36b59263e3b48b86d3979bf0d2a12f@api.mailgun.net/v3/appb17d1ae4924645aab6a69471af346072.mailgun.org/messages';


request.get(uri4,function(er,resp,body){
if(er) console.log('er: ', er);
console.log('body: ', body);
});
/*
request.post(uri5,{form:{from:'me<ag1@yandex.ru>',to:'gru5@yandex.ru',subject:'For subject222',text:'text'}},(err,res,body)=>{
if(err) console.log('err: ', err);
	console.log('body: ', body);
});
*/