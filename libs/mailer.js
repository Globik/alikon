var api_key, domain=null;
if(process.env.DEVELOPMENT=="yes"){
api_key=process.env.TMAILGUNAPIKEY;
console.log('mailgun api key: ', api_key);
domain=process.env.TMAILGUN_DOMAIN;
console.log('mailgun domain: ', domain);
}else{
	api_key = process.env.MAILGUN_API_KEY;
	domain = process.env.MAILGUN_DOMAIN;
}
const mailgun = require('mailgun-js')({apiKey: api_key, domain:domain});

let txt_sub = n =>{ return n;};
var rtxt= n=>{
const TEXT1=`You are receiving this couz u(or someone else) have requested the reset of the password for your account.
Please click on the following link, or paste this into your browser to complete the process:
<a href="https://alikon.herokuapp.com/reset/${n.token}">https://alikon.herokuapp.com/reset/${n.token}</a>
If u did not request this, please ignore this email and yr pwd will remain unchanged.`;
	return TEXT1;
};
var rhtml= n=>{
	const TEXT2=`<html lang="en"><body>
U a receiving this couz u(or someone else) have requested the reset of the pwd
for yr account. PLease click on the following link, or paste this into yr browser
to complete the process:
<a href="https://alikon.herokuapp.com/reset/${n.token}"/>https://alikon.herokuapp.com/${n.token}{n</a>
If u did not request this, please ignore this email and yr pwd will remain unchainged`;
	return TEXT2;
}
var rtxt_valis_good=n=>{return `bla bla bla yr pwd is changed sucessfully`;};
var rhtml_valis_good=n=>{return `<html><body><strong>bla bla bla</strong> yr pwd is changed successfully.</body></html>`;}
//email verification
const email_ver= n =>{return `Please verificate yr email. Go to <a href="https://alikon.herokuapp.com/email_validation/${n.token}">
https://alikon.herokuapp.com/email_validation/${n.token}</a>. Tschuess`;}

const email_ver_html= n =>{return `<html><body><strong>Please</strong> verificate yr email. Go to <a href="https://alikon.herokuapp.com/email_validation/${n.token}">
https://alikon.herokuapp.com/email_validation/${n.token}</a>. Tschuess</body></html>`;}

const email_ok= n=>{return `Your email is successfully verificated. Go to us <a href="https://alikon.herokuapp.com">alikon</a>`;}
const email_ok_html=n=>{return `<html><body><strong>Your email</strong> successfully verificated. Go to us <a href="https://alikon.herokuapp.com">alikon</a></body></html>`;}

function email_requisit(to, sub, btext, html){
	return {to:to, subject:sub, from:"gru5@yandex.ru", text:btext, html:html};
}

function send_email(el){
if(el.token_type=="reset"){return	email_requisit(el.email, "Password "+el.token_type, txt_sub(rtxt({token:el.token})),
	txt_sub(rhtml({token:el.token})));
}else if(el.token_type=="reseted"){
	return email_requisit(el.email, "Password "+el.token_type, txt_sub(rtxt_valis_good({})),
						 txt_sub(rhtml_valis_good({})));
}else if(el.token_type=="validation"){
return email_requisit(el.email, "Your Email "+el.token_type, txt_sub(email_ver({token:el.token})), txt_sub(email_ver_html({token:el.token})));
}
	else if(el.token_type=="validated"){
	return email_requisit(el.email, "Your Eamil is "+el.token_type, txt_sub(email_ok({})), txt_sub(email_ok_html({})));
	}else{console.log('Unknown type of token_type');}
}

function msg_handler(msg){
		console.log('msg: ', msg);
		console.log('send_email: ', send_email(msg));
		mailgun.messages().send(send_email(msg), mail_guner);
		}


		function mail_guner(error, body){
			if(error) console.log('mailgun err: ', error);
			console.log('body: ', body);
		}

module.exports={msg_handler};