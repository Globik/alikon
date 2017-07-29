//busers.js
const head=require('./head'),
    header_menu=require('./header_menu'),
	admin_main_menu=require('./admin_main_menu'),
    footer=require('./footer'),
	login_proto=require('./login_proto.js');
const {js_help}=require('../libs/helper.js');
var warnig=false;	  
var haupt_ban=false;

const busers = n=>{
let {model,showmodule:{mainmenu,profiler}}=n;
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- busers.js -->
<head>${head.head({title:`${model !==null ?model.name:'no user'}. Live video.`,/*js:['/js/video_chat.js'],*/ csslink:"/css/main2.css"/*,js:[""]*/,cssl:["/css/video_chat.css","/css/login2.css"]})}
</head>
<body>${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : '')}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:'')}
<main id="pagewrap"> 

<div id="media-wrapper"><div id="media-header"><b>${model?model.name:''}</b>${n.owner?'&nbsp;&nbsp;<div id="online-detector"></div>':''}</div>
<div id="video-container">
<div id="video-wrapper" class="${model && model.src ? '':`${n.owner?'owner-offline':'offline'}`}">
<video id="local_video" poster="${model && model.src ? model.src:''}" autoplay controls>HTML5 video element not supported.</video>
</div>
<div id="undervideo">
${n.owner ?'<button class="start" id="video_starter" onclick="get_vid(this);">start video</button>':''}<button id="connect_starter" class="start" onclick="do_conn(this);">connect</button>${!n.owner ?'<button class="start" onclick="tip();">send tip</button><button class="start" onclick="go_private();">private room</button>':''}
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
<a href="#" class="close" style="text-decoration:none;"><span class="before" style="">X</span></a><div style="clear:both;"></div>
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
<input type="hidden" id="modelName" value="${model?model.name:''}"/>
<input type="hidden" id="modelId" value="${model.id}"/>
<input type="hidden" id="owner" value='${n.owner}'/>
<input type="hidden" id="modelTokens" value="${model.items}"/>

<!-- You -->
<input type="hidden" id="buser" value="${buser ? true : false}"/>
<input type="hidden" id="shortid" value="${n.shortid}"/>
<input type="hidden" id="yourName" value="${buser ? buser.name : ''}"/>

<input type="hidden" id="yourId" value="${buser ? buser.id : ''}"/>
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


<!--
<div>
<button onclick="get_room();">privat</button> <span id="tokpermin">10</span> tokens/min<br><br>
</div> -->

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
<input type="hidden" id="loginstr" value='${login_proto.login_proto({})}'/>

<a href="#" class="overlay" id="vorlogery"></a>
<output id="vorlogin" class="popi">
<a href="#" class="close" style="text-decoration:none;"><span class="before" style="">X</span></a><div style="clear:both;"></div>
<div id="vorlogincontainer"></div>
</output>

${js_help(["/js/video_chat.js","/js/login.js"])}
</main><footer id="footer">${footer.footer({})}</footer>
</body>
</html>`;
}
module.exports={busers};