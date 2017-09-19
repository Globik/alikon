/*function message_box(n){
inbox.innerHTML='<b>'+n+'</b>';
window.location.href="#message_box";
//maudio();
	blastsound.play();
open_al();
}
*/
function shell(el,n,ml){
if(typeof HTMLDialogElement==='function'){
inbox3.innerHTML='<b>'+n+'</b>';dialogConfirm.showModal();
dialogConfirm.onclose=function(ev){
if(ev.target.returnValue=='true'){el.target.dispatchEvent(ml);
ev.target.returnValue=null;
}
}}else{
if(confirm(n)){el.target.dispatchEvent(ml);}
}
}
function bvid(i){return document.getElementById(i);}
function galert(n){
//alert('what the fuck');
let c=window.getComputedStyle(document.querySelector('.popi'),null).getPropertyValue('z-index');
inbox2.innerHTML='<b>'+n+'</b>';
if(c)bvid('alert_id').style.zIndex=c+1;
bvid('alert_id').classList.add('ak');
setTimeout(function(){
bvid('alert_id').classList.remove('ak');
},5000)
}
function open_al(){
bvid('message_box').onclick=function(e){
//setTimeout(function(){rem_hash();},0);
in_rem_hash();
}}
function in_rem_hash(){
setTimeout(function(){rem_hash();},0);
}

	
function rem_hash(){
if(history)history.pushState('',null,window.location.pathname);
}
var ax=null;
function getAudioContext(){
try{ax=new (window.AudioContext || window.webkitAudionContext);}catch(e){
console.error('audiocontext:  '+e);
ax=null;
}

}
getAudioContext();
/*
function maudio(){
if(ax==null)return;	
//var actx=new (window.AudioContext || window.webkitAudioContext);
let source=ax.createBufferSource();
	var xhr=new XMLHttpRequest();
	xhr.open('get','/sounds/KDE-Im-Contact-Out.ogg',true);
	xhr.responseType='arraybuffer';
	xhr.onload=function(){
	ax.decodeAudioData(xhr.response,function(buffer){
	source.buffer=buffer;
	source.connect(ax.destination);
		//source.loop=true;
		source.start(0);
	},function(e){console.error(e)})
	}
	xhr.send();
}
*/
/*
var WebAudioAPIManager=function(context){
this.context=context;
	this.bufferList={};
	this.playingSounds={};
}
*/
/*
WebAudioAPIManager.prototype={
addSound:function(url){
let r=new XMLHttpRequest();
r.open("GET",'/sounds/'+url,true);
r.responseType="arraybuffer";
var self=this;
r.onload=function(){
	console.log('ok, ajx came onload');
self.context.decodeAudioData(r.response,function(buffer){
if(!buffer){console.log('no buffer');return;}
	self.bufferList[url]=buffer;
	console.log('buf:',buffer);
	console.log('self.bufferList[url]: ',self.bufferList[url]);
})
}
r.onerror=function(){console.error('bufferloader xhr error')}
r.send();
},
	stopSoundWithUrl:function(url){
	if(this.playingSounds.hasOwnProperty(url)){
	for(var i in this.playingSounds[url]){
	if(this.playingSounds[url].hasOwnProperty(i))this.playingSounds[url][i].stop();
	}
	}
	}
}
var surl='/sounds/';
var WebAudioAPISound=function(url){
	if(ax==null)return;
this.url=url+'.ogg';
	console.warn(url+'.ogg')
window.webAudioAPIManager=window.webAudioAPIManager || new WebAudioAPIManager(ax);
	this.manager=window.webAudioAPIManager;
	console.log('this.manager: ',this.manager)
	this.manager.addSound(this.url)
};
WebAudioAPISound.prototype={

play:function(options){
	console.log('must playing',this.url);
var buffer=this.manager.bufferList[this.url];
	
	console.log('buffer: ',buffer);
	console.log('ku ku: ',this.manager.bufferList)
	for(var k in this.manager.bufferList){
		alert(k)
	console.log('kakashka ',k, ' ', this.manager.bufferList)
	}
	this.settings={loop:false,volume:0.5};
	for(var i in options){
	if(options.hasOwnProperty(i)){this.settings[i]=options[i];}
	}
	if(typeof buffer !=="undefined"){
	var source=this.makeSource(buffer);
		source.loop=this.settings.loop;
		source.start(0);
		if(!this.manager.playingSounds.hasOwnProperty(this.url)){
		this.manager.playingSounds[this.url]=[];
		this.manager.playingSounds[this.url].push(source);
		}
		console.log('playing?');
	}else{console.log('not buffer: ',buffer)}
},
	stop:function(){
	this.manager.stopSoundWithUrl(this.url);
	},
	makeSource:function(buffer){
	var sourced=this.manager.context.createBufferSource();
	var gainNode=this.manager.context.createGainNode();
		gainNode.gain.value=this.volume;
		sourced.buffer=buffer;
		sourced.connect(gainNode);
		gainNode.connect(this.manager.context.destination);
		return sourced;
	}
}
var blastsound=new WebAudioAPISound('KDE-Im-Contact-Out');
*/
var sounds={
l1:{src:"/sounds/KDE-Im-Contact-Out"},
l2:{src:"/sounds/KDE-Im-Low-Priority-Message"},
l3:{src:"/sounds/KDE-Im-Phone-Ring"}
}
function fogg(){
let b=!!(new Audio().canPlayType('audio/ogg;codecs="vorbis"'));
	console.warn('can play ogg: ', b);
	if(b){return true;}else{return false;}
}
fogg();
function loadSoundObj(obj){
let r=new XMLHttpRequest();
	r.open('GET',obj.src+'.ogg',true)
	r.responseType='arraybuffer';
	r.onload=function(){
	ax.decodeAudioData(r.response,function(buffer){
	obj.buffer=buffer;
	},function(err){console.error(err)})
	}
r.send();}
function loadSounds(obj){
	if(ax==null)return;
var len=obj.length,i;
	for(i in obj){
	if(obj.hasOwnProperty(i)){loadSoundObj(obj[i]);}
	}
} 
loadSounds(sounds);
function blaysound(buffer){
	if(ax==null)return;
	if(buffer){
		try{
let s=ax.createBufferSource();
	s.buffer=buffer;
	s.connect(ax.destination);
	s.start(0);
		}catch(e){console.error(e);return;}
	}
}

function playSound(buffer){
if(!fogg())return;
return blaysound(buffer);
}
function message_box(n){
//console.log('sounds: ',sounds)
inbox.innerHTML='<b>'+n+'</b>';
window.location.href="#message_box";
playSound(sounds.l1.buffer);
open_al();
}
