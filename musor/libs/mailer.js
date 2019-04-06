var api_key, domain=null;
const page_url="https://alikon.herokuapp.com";
const company="Alikon";
const support_email="support@alikon.com";
const main_email="gru5@yandex.ru";
const company_address="13 - 13bis Rue de l'Aubrac, 75012 Paris, France";
var dated=new Date().getFullYear();
console.log('dated: ', dated);
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
const TEXT1=`
Forgot your password?

We've received a request to reset the password for this email address.

To reset your password please click on this link or cut and paste this URL into your browser(link expires in 24 hours):
<a href="${page_url}/reset/${n.token}">${page_url}/reset/${n.token}</a>

This link takes you to a secure page where you can change your password.

If you don't want to reset your password, please ignore this message. Your password will not be reset.

For general inquires or to request support with your account, please email ${support_email}

This message was sent by ${company}. Visit ${page_url} to learn more.
If you received this email by mistake or believe it is spam, please forward it to support@mailgun.com .`;
	return TEXT1;
};
var rhtml= n=>{
	const TEXT2=`<html lang="en"><body>
Forgot your password?
<br><br>
We've received a request to reset the password for this email address.
<br><br>
To reset your password please click on this link or cut and paste this URL into your browser(link expires in 24 hours):
<a href="${page_url}/reset/${n.token}">${page_url}/reset/${n.token}</a>
<br><br>
This link takes you to a secure page where you can change your password.
<br><br>
If you don't want to reset your password, please ignore this message. Your password will not be reset.
<hr>
For general inquires or to request support with your account, please email ${support_email}<br><br>

<small style="background:pink;">This message was sent by ${company}. 
Visit <a href="${page_url}">${page_url}</a> to learn more.
If you received this email by mistake or believe it is spam, please forward it to support@mailgun.com .</small>
</body></html>`;
	return TEXT2;
}
var rtxt_valis_good=n=>{return `Your password has been changed!`;};
var rhtml_valis_good=n=>{return `<html><body>Your password has been changed!</body></html>`;}

/***** *********************************************************** */
//email address validation

const email_ver= n =>{return `We just need to validate your email address to activate your ${company} account. Simply click the following button: `;}

const email_ver_html= n =>{return `<html><body><h3>Activate Your Account</h3>
<p>We just need to activate your email address to activate your ${company} account. Simply click the following button:<br><br>
<a href="${page_url}/email_validation/${n.token}"><button style="background:orange">Activate my account</button></a><br><br>
If the link doesn't work, copy this URL into your browser:<br>
<a href="${page_url}/email_validation/${n.token}">${page_url}/email_validation/${n.token}</a><br><br>
Welcome aboard!<br><br>The ${company} Crew
</p><small>This email was sent to you by ${company} because you sign up for an ${company} account. Please let us know if you feel
that this email was sent to you by error.</small><br><br><small>(c) ${dated} ${company} | ${company_address}</small><br><br>
<small><a href="${page_url}">Privacy Policy</a> | <a href="${page_url}">Sending Policy</a> | 
<a href="${page_url}">Terms of Use</a></small>
</body></html>`;}

const email_ok= n=>{return `Your email is successfully verificated. Go to us <a href="${page_url}">${company}</a>`;}
const email_ok_html=n=>{return `<html><body><strong>Your email</strong> successfully verificated. Go to us <a href="${page_url}">${company}</a></body></html>`;}

function email_requisit(to, sub, btext, html){
	return {to:to, subject:sub, from:`${main_email}`, text:btext, html:html};
}

function send_email(el){
if(el.token_type=="reset"){return	email_requisit(el.email, "Password "+el.token_type, txt_sub(rtxt({token:el.token})),
	txt_sub(rhtml({token:el.token})));
}else if(el.token_type=="reseted"){
	return email_requisit(el.email, "Password "+el.token_type, txt_sub(rtxt_valis_good({})),
						 txt_sub(rhtml_valis_good({})));
}else if(el.token_type=="validation"){

return email_requisit(el.email, "Your Email "+el.token_type, txt_sub(email_ver({token:el.token})),
					  txt_sub(email_ver_html({token:el.token})));
	
}
	else if(el.token_type=="validated"){
	return email_requisit(el.email, "Your Email is "+el.token_type, txt_sub(email_ok({})), txt_sub(email_ok_html({})));
	}else{console.log('Unknown type of token_type');}
}

function msg_handler(msg){
		console.log('msg: ', msg);
		console.log('send_email: ', send_email(msg));
	if(!msg.email.endsWith("@fb.com") && !msg.email.endsWith("@vk.com"))
		mailgun.messages().send(send_email(msg), mail_guner);
		}


		function mail_guner(error, body){
			if(error) console.log('mailgun err: ', error);
			console.log('body: ', body);
		}

module.exports={msg_handler};