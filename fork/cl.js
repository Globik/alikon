<html>
<head>
    <meta charset="utf-8">
    <title>webrtc offer</title>
<style>#out{border: 1px solid green;}</style>
</head>
<body>
	<h3>Впиши в форму свой ник</h3>
	<form name="nick">
	<input type="text" name="yourNick" value="Bob"  placeholder="your nick">
	<input type="submit" value="Set your nick">
	</form>
	<div>
	<h4>Users:</h4>
	<div id="allUsers"></div>
    </div>
    <button onclick="test_target();">test target to me from me</button>
	<div id="chatbox"></div>
	<div id="offer"></div>
        <button onclick="start();">Позвонить</button><hr>
        <audio id="audioOffer" autoplay controls></audio><hr>
        <output id="out1"></output>
    
    <div id="answer">
        <a href="/offer.html" target="_blank">go to offer.html</a><hr>
        <h1>Answer</h1>
        <h3>отправь ответ. </h3>
        <h4>Убедись, что вебсокет открыт.</h4>
        <!-- <button onclick="start();">Позвонить</button> --><hr><audio id="audio2" autoplay controls></audio><hr>
        <output id="out2"></output>
    </div>
    
    <script>
		//var your_nick;//your nick for a websocket
        document.getElementById('answer').style.display = 'none';
        document.getElementById('offer').style.display = 'none';
        var ws_uri;
        var ws;
        var userid = generateId();//??
        var whoAmI; //'';// your nick??
        
        
        
        var servers = {iceServerUrl: [{url: "stun:stun.ekiga.net"}]};
document.forms.nick.onsubmit=function(){
let d={};
if(this.yourNick.value){
let d={};
d.nick=this.yourNick.value;
d.message_type="nick";
psend(d);
}else{alert("What the nick you have?");}
return false;//prevents default event in form element		
}
        pc=new RTCPeerConnection(/*servers*/null);
       // console.log(window.location.protocol);
       // console.log(window.location);
        if(window.location.protocol=="https:"){
		ws_uri="wss:";	
		}else{
		ws_uri="ws:";	
		}
        ws=new WebSocket(ws_uri+"//"+window.location.hostname+":"+window.location.port);
    	ws.onopen=function(){console.log("Websocket opened!");}
    	ws.onclose=function(){console.log("Websocket closed!");}
    	ws.onerror=function(error){console.error("Websocket error "+error);}
    	ws.onmessage=function(event){
    	    console.log('1. Зашли в onmesage');
    	    
    	    var msgFromServer;
		    
		    try {
		        msgFromServer = JSON.parse(event.data);
		        
		    } catch (e) {
				console.error(e);
		        return;
		        
		    };
		    if(msgFromServer.message_type==="nick"){
				whoAmI=msgFromServer.nick;
				console.log("Your nick is ", whoAmI);
			}else if(msgFromServer.message_type==="join"){
				console.log("join");
				let nicky=msgFromServer.nick;
				allUsers.innerHTML+="<div data-nick="+nicky+" onclick=\"call_me(this);\">"+nicky+"</div>"
			}else if(msgFromServer.message_type==="target"){
			console.log("Target\n", event.data);	
			}
		    
		    if (msgFromServer.message_type === 'No offer') {
		        console.log('Офера пока нет на сервере');
		        document.getElementById('offer').style.display = 'block';
		    };
		    
		    if (msgFromServer.message_type === 'Offers online') {
		        console.log('Оферы онлайн', msgFromServer.offerSdp, ' ', msgFromServer.offerId);
		        document.getElementById('answer').style.display = 'block';
		        setAnswerSettingsFromAnotherOffer(msgFromServer);
		    };
		    
		    if (msgFromServer.message_type === 'Answer for offer') {
		        console.log("Answer for offer");
		       if (msgFromServer.offerId == userid) {
                    console.log("Answer for offer 2");
                	if(!msgFromServer.answerSdp) console.warn("What the fuck? No sdp?");
                	pc.setRemoteDescription(msgFromServer.answerSdp).then(function(){
                	console.log("есть конект АНСВЕР - ОФЕР");
                	},on_error);
		       }
		    };
		    
		    if(msgFromServer.message_type=="candidate-answer") {
    			console.warn("candidate in socket");
    		} else {
    			//console.warn("Unknown type: ", msgFromServer.message_type);	
    		};
    		
    		if(msgFromServer.message_type=="candidate-offer" && whoAmI != 'offer') {
    		    console.warn("candidate in socket");

        		if(pc)pc.addIceCandidate(msgFromServer.candidate).then(function(){console.log("added candidate success")},
        		function(err){console.log("failed adding candidate: ",err);})
        		} else {
				//console.warn("Unknown type");
				};
        		
        	
        	//console.log(msgFromServer);
    		
    	};
    	// what this? todo=> remove wsSend
    	var wsSend = function(data) {
    	    if(!ws.readyState) {
    	        setTimeout(function () {
    	            wsSend(data);
    	        }, 100);
    	    } else {
    	        ws.send(data)
    	    }
    	}
    	
    // best psend(obj)
function psend(obj){
if(ws){
let a;
try{
a=JSON.stringify(obj);
ws.send(a);
}catch(e){console.error(e);}	
}
	
}
function call_me(el){
let b=el.getAttribute("data-nick");
if(!b)return;
if(!whoAmI)return;
let d={}
d.to=b;
d.from=whoAmI;
d.sdp="fakeSdp";
d.message_type="target";
psend(d);
}
function test_target(){
if(!whoAmI){alert("who are you?");return;}
let d={};
d.to=whoAmI;
d.from=whoAmI;
d.message_type="target";
d.msg="Hi there!";
d.sdp="takeSDP";
psend(d);	
}
    	
    	function generateId() {
    	    var now = Date.now();
    	    console.log(now);
    	    return now;
    	}
    	
    	
    	
    	wsSend(JSON.stringify({
            message_type:'do_we_have_offer_on_server',
    	    user_id: userid
    	}));
    	
    	
    	// RTCPeer - GO!!!!
    	var pc=null;
    	var localStream;
    	//var audio2=document.getElementById("audio2");
    	var offeroptions={offerToReceiveAudio:1, offerToReceiveVideo:0, voiceActivityDetection:false};
	
    	function start(){
        	//const servers=null; // STUN сервера должны быть по идее
        	whoAmI = 'offer';
        	
        	var servers = {
                                            iceServerUrl: [
                                                    {url: "stun:stun.ekiga.net"}
                                            ]
                                    };
        	pc=new RTCPeerConnection(servers);
        
        	pc.onicecandidate = function(e) {     	// SEND CANDIDATE FROM OFFER
        		if(e.candidate){
        			console.log("CANDIDATE-send-form-offer:\n", e.candidate);
        			//if(ws)
        			ws.send(JSON.stringify({
        			    
        			    message_type:"candidate-offer",
        			    candidate:e.candidate
        			    
        			}));
        		}
        	}
        
        	navigator.mediaDevices.getUserMedia({audio:true,video:false}).then(gotStream).catch(function(e){console.log(e.name, e)})
        }

        function gotStream(stream){
        	console.log("received local stream");
        	localStream=stream;
        	const audioTracks=localStream.getAudioTracks();
        
        	if(audioTracks.length>0){
        		console.warn(audioTracks[0].label);	
        	}
        
        	localStream.getTracks().forEach(function(track){pc.addTrack(track, localStream)});
        	console.log("adding local stream to pc");
        	pc.createOffer(offeroptions).then(gotdesc, on_error);	
        }
        
        function gotdesc(obj){
        //console.log("offer sdp\n",obj.sdp)
        	pc.setLocalDescription(obj).then(function(){
        		console.log("send offer to answer.html");	
        		if(ws)ws.send(JSON.stringify({
        		    
        		    message_type: 'I am offer',
        		    user_id: userid,
        		    type:"offer",
        		    sdp: pc.localDescription
        		    
        		}))       // SEND SDP FROM OFFER
        	}, on_error)
        }
        
        function on_error(err){console.error(err);}
            	
        
        
        
        // Устанавливаем SDP на Ансвера от Офера с другого компьютера
        function setAnswerSettingsFromAnotherOffer(dataFromOffer) {
            whoAmI = 'answer';
            
            var servers = {
	                                    iceServerUrl: [
	                                            {url: "stun:stun.ekiga.net"}
	                                    ]
	                            };
	                            
		    pc=new RTCPeerConnection(servers);
		    
		    pc.onicecandidate=function(e){
    			if(e.candidate){
    				console.log("CANDIDATE:\n", e.candidate);
    				if(ws)ws.send(JSON.stringify({
    				    
    				    message_type:"candidate-answer",
    				    candidate:e.candidate
    				    
    				}));	// SEND CANDIDATE FROM ANSWER TO OFFER
    			}
    		}
    
    		pc.ontrack=got_remote_stream;
    
    		async function boo(){
    			// Приняли и установили ОФЕР
    			await pc.setRemoteDescription(dataFromOffer.offerSdp);
    			
    			// Создали свой АНСВЕР и установили его себе
    			let desc=await pc.createAnswer();
    			await pc.setLocalDescription(desc);	
    			
    			// Сгенерировали свой ID
    			var answerId = generateId();
    			
    			// Заджейсонили свой АНСВЕР
    			;      // Не хватает type: 'answer'
    			
    			if(ws)setTimeout(function(){ws.send(JSON.stringify({    // SEND SDP FROM ANSWER TO OFFER
    			        
    			        message_type: "I am answer",
    			        answerId: answerId,
    			        answerSdp: pc.localDescription, 
    			        offerId: dataFromOffer.offerId
    			    
    			}));},1000); 
    		}
    		
    		boo().then(function(){})
    	}
    	
    	
    	function got_remote_stream(e){
    		console.warn("got_remote_stream");	
    		if(audio2.srcObject !==e.streams[0]){
    			audio2.srcObject=e.streams[0];
    			console.log("receive remote stream");	
    		}	
        }
        
        
            	//wsSend('1');
    </script>
</body>
</html>
    
