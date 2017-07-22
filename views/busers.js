//busers.js
const head=require('./head'),
    header_menu=require('./header_menu'),
	admin_main_menu=require('./admin_main_menu'),
    footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;

const busers = n=>{
let {model,showmodule:{mainmenu,profiler}}=n;
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- busers.js -->
<head>${head.head({title:`${model.name}. Live video.`, csslink:"/css/main2.css"/*,js:[""]*/,cssl:["/css/video_chat.css"]})}
<style>
#orlogincontainer {overflow-y:scroll;}
#vorlogin{margin:0;padding:0;}
#vorlogin h4{background:yellow;margin:0;}
#mform{
display:block;
width: 100%;
padding-left:6%;
padding-right:6%;

}
.email, .password, .username,.submit{
width:100%;
	padding-top:10px;
	padding-bottom:20px;
	position:relative;
   display:block;
		}


#mform input[type=password], #mform input[type=email], #mform input[type=text]{
width:100%;
display:block;
padding-top:10px;
padding-bottom:10px;
margin-top: 4px;
border: 1px solid #ccc;
		}
#mform input[type=submit]{
width: 60%;
display:block;
color:red;
padding-top:10px;
padding-bottom:10px;
cursor: pointer;	
background: /*rgb(61, 157, 179)*/ brown;
font-family: Courier,sans-serif;
font-weight:bold;
ont-size: 0.9rem;
color: rgb(25,25,39);
border: 1px solid rgb(28, 108, 122);		
}
#bott, .bott{
display: block; 
width:100%; 
position:relative;
padding-top:0px;
padding-left: 6%;
padding-right:6%;
padding-bottom:0px;
		}

/* social icons 
.soc-desc1{
display:block;
position:absolute;
}
		
.soc-desc{
position:relative;
display:block;
height: auto;
width: 100%;

text-align:center;
}
*/
.soc-desc.fb{background: #4c74c4;background:linear-gradient(to bottom right, #4c74c4, #3b5998);}
.soc-desc.vk{background:#45668e;}
				
.span-social{line-height: 5;}

</style>

</head>
<body>${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : '')}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:'')}
<main id="pagewrap"> 

<div id="media-wrapper"><div id="media-header"><b>${model.name}</b>${n.owner?'&nbsp;&nbsp;<div id="online-detector"></div>':''}</div>
<div id="video-container">
<div id="video-wrapper" class="${n.imgsrc && n.imgsrc !=='no'?'':`${n.owner?'owner-offline':'offline'}`}">
<video id="local_video" poster="${n.imgsrc && n.imgsrc !=='no'?n.imgsrc:''}" autoplay controls>HTML5 video element not supported.</video>
</div>
<div id="undervideo">
${n.owner ?'<button class="start" id="video_starter" onclick="get_vid(this);">start video</button>':''}<button id="connect_starter" class="start" onclick="do_conn(this);">connect</button>${!n.owner ?'<button class="start" onclick="get_one();">send tip</button><button class="start" onclick="go_private();">private room</button>':''}
</div>
</div>
<div id="chat-container">
<div id="chat"></div>
<div id="underchat">
<form name="publish">
<input type="text" name="message" placeholder="Type a message!" maxlength="190"/><input type="submit" class="subm-state" value="send"/>
</form>
</div>
</div>
</div>
<a href="#" class="overlay" id="resultativ"></a>
<output id="pop" class="popi">
<a href="#" class="close"></a>
<p><a href="/tipping/purchase_tokens">purchase tokens</a></p>
<p>You have <span id="yourTokens2"></span> tokens.</p>
<p class="ptokenstosend">Tokens to send:&nbsp;&nbsp;<span class="ok" id="tokTosend"></span></p>
	<p><span id="outi"></span></p>
<div id="container_ziffer">
	<div class="zbox" style=""><span>0</span></div>
	<div class="zbox"><span>1</span></div>
	<div class="zbox"><span>2</span></div>
	<div class="zbox"><span>3</span></div>
	<div class="zbox"><span>4</span></div>
	<div class="zbox"><span>5</span></div>
	<div class="zbox"><span>6</span></div>
	<div class="zbox"><span>7</span></div>
	<div class="zbox"><span>8</span></div>
	<div class="zbox"><span>9</span></div>
	<div class="zbox back" style="flex-grow:4;width:auto;"><span>backspace</span></div>
	<div style="clear:both"></div>
</div>
<p>
<button onclick="send_tokens();" class="">send&nbsp;&nbsp;<span class="btnok">&check;</span><span class="btnnotok">&times;</span></button>
</p>
</output>
<!-- model -->
<input type="hidden" id="modelName" value="${model.name}"/>
<input type="hidden" id="modelId" value="${model.id}"/>
<input type="hidden" id="modelEmail" value="${model.id}"/>
<input type="hidden" id="owner" value='${n.owner}'/>
<input type="hidden" id="modelTokens" value="${model.items}"/>

<!-- You -->
<input type="hidden" id="buser" value="${buser ? true : false}"/>
<input type="hidden" id="shortid" value="${n.shortid}"/>
<input type="hidden" id="yourName" value="${buser ? buser.name : ''}"/>

<input type="hidden" id="yourId" value="${buser ? buser.id : ''}"/>
<input type="hidden" id="yourEmail" value="${buser ? buser.id:''}"/>
<input type="hidden" id="yourTokens" value="${buser ? buser.items:''}"/>


<div class="firstchild" id="camera-container">
<div class="camera-box">
<!--
<div><h4>local video</h4><video id="localvideo" autoplay muted style="width:250px;height:250px;border:2px solid green;"></video></div>
<div><h4>remote video</h4><video id="remotevideo" autoplay style="width:250px;height:250px;border:2px solid red;"></video></div>
-->
<button id="hangupbtn">Hung Up</button>
</div>
</div>



<div>

<button onclick="get_room();">privat</button> <span id="tokpermin">10</span> tokens/min<br><br>

</div>
<button onclick="vor_login();">log in</button>
Time: <span id="mer">00:00:00</span><br><br>

<hr><output id="out"></output>

<input type="checkbox" id="plan_b_check" >planB<br>

<span id="state_span"></span>


<div id="remote_container"></div>	

<br><b>WebRTC errors:</b><br>
<span id="rtcerror"></span><br>
<br><span id="wso"></span>

<span id="pid"></span>
<span id="timeinfo"></span>

<script src="/js/video_chat.js"></script>

<a href="#" class="overlay" id="vorlogery"></a>
<output id="vorlogin" class="popi">
<a href="#" class="close"></a>
<div id="vorlogincontainer"></div>
</output>
<script>
function vor_login(){
var xhr=new XMLHttpRequest();
xhr.open('get','/vor_login');
xhr.onload=function(evi){
if(xhr.status==200){
vorlogincontainer.innerHTML=JSON.parse(this.response).content;
window.location.href="#vorlogery";
}else{
console.log(this.response);
}
}
xhr.onerror=function(e){console.error(e);}
xhr.send();
}
</script>
</main><footer id="footer">${footer.footer({})}</footer>
</body>
</html>`;
}
module.exports={busers};