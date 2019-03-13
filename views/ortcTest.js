// https://github.com/webrtcHacks/first-steps-ortc/blob/gh-pages/index.html
var ortcTest=function(n){
	
return `<html>
<head><meta charset="utf-8"><title>ortc</title></head><body>
<h1>ortc</h1>
<video id="localv" autoplay muted>no video el</video>
<video id="remotev" autoplay>no video el</video>
<p>this shows how to send a mediastreamtrack with ortc</p>
<output id="out"></output>
<script>
var iceopt={"gatherPolicy":"all","iceServers":[]};
var out=gid("out");
function foo(){
	try{
var gatherer1=new RTCIceGatherer(iceopt);
var transport1=new RTCIceTransport(gatherer1);
var dtls1=new RTCDtlsTransport(transport1);

var gatherer2=new RTCIceGatherer(iceopt);
var transport2=new RTCIceTransport(gatherer2);
var dtls2=new RTCDtlsTransport(transport2);

var sender,receiver;
gatherer1.onlocalcandidate=function(evt){
out.innerHTML+='1 -> 2'+evt.candidate+'<br>';
if(evt.candidate)transport2.addRemoteCandidate(evt.candidate);	
}
gatherer2.onlocalcandidate=function(evt){
out.innerHTML+='2->1'+evt.candidate+'<br>';
if(evt.candidate)transport1.addRemoteCandidate(evt.candidate);	
}
transport1.start(gatherer1,gatherer2.getLocalParameters(),'controlling');
transport1.onicestatechange=function(){out.innerHTML+='ice transport 1 state change '+transport1.state+'<br>';}

transport2.start(gatherer2,gatherer1.getLocalParameters(),'controlling');
transport2.onicestatechange=function(){out.innerHTML+='ice transport 2 state change '+transport2.state+'<br>';}

dtls1.start(dtls2.getLocalParameters());
dtls1.ondtlsstatechange=function(){out.innerHTML+='dtls1 state change '+dtls1.state+'<br>';}

dtls2.start(dtls1.getLocalParameters());
dtls2.ondtlsstatechange=function(){out.innerHTML+='dtls2 state change '+dtls2.state+'<br>';}

navigator.mediaDevices.getUserMedia({video:true}).then(function(stream){
gid('localv').srcObject=stream;
var params=RTPReceiver.getCapabilities('video');
params.muxId=1001;
params.encodings=[{
ssrc:1001,
codecPayloadType:0,
fec:0,
rtx:0,
priority:1.0,
maxBitrate:2000000.0,
minQuality:0,
framerateBias:0.5,
resolutionScale:1.0,
framerateScale:1.0,
active:true,
dependencyEncodingId:undefined,
encodingId:undefined	
}];
params.codec.forEach(function(codec){
codec.payloadType=codec.preferredPayloadType;	
});
params.rtcp={cname:"",reducedSize:false,ssrc:0,mux:true};
outi('params ' +JSON.stringify(params));
receiver=new RTCRtpReceiver(dtls2,'video');
receiver.receive(params);
var remoteStream=new MediaStream();
remoteStream.addTrack(receiver.track);
gid('remotev').srcObject=remoteStream;
sender=new RTCRtpSender(stream.getVideoTracks()[0],dtls1);
sender.send(params);
}).catch(function(err){outi('error: '+err);alert(err);});
}catch(er){alert(er);}

function gid(id){
return document.getElementById(id);	
}
function outi(s){out.innerHTML+=s+'<br>';}
</script></body></html>`;
}
module.exports={ortcTest}
