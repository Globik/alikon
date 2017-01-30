var koa=require('koa');
var app=koa();
var port=process.env.PORT || 5000;
var passport=require('koa-passport');
var VkontakteStrategy=require('passport-vkontakte').Strategy;
const Router=require('koa-router');
const pub=new Router();
const bodyParser=require('koa-body');
//https://oauth.vk.com/authorize?response_type=code&scope=email&client_id=5848291

var vkid=5848291;
var vk_sec='PNQTiV3mgz0fiB7F3mTN';
app.use(passport.initialize());
pub.get('/', function*(){
	this.body='<html><body><a href="/auth/vkontakte">vkontakte</a></body></html>';
});

pub.get('/auth/vkontakte',    passport.authenticate('vkontakte'));
pub.get('/auth/vkontakte/cb', passport.authenticate('vkontakte',{successRedirect:'/',failureRedirect:'/login'}));
app.use(bodyParser());
app.use(pub.routes());

passport.use(new VkontakteStrategy({
clientID: vkid,
clientSecret: vk_sec,
callbackURL:'http://localhost:5000/auth/vkontakte/cb',
scope:['email'],
profileFields:['email']
},
function(accessToken,refreshToken, params, profile, done){
	process.nextTick(function(){
	console.log('vk Profile: ',profile);
		console.log('params!: ',params);
		console.log('accessToken: ',accessToken);
		console.log('refreshToken: ',refreshToken);
	
	})
}))
// https://oauth.vk.com/authorize?client_id=5848291&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=friends&response_type=token&v=5.52								   ))

								   app.listen(port);
console.log('Server is running on port ',port);