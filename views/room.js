// room.js based on busers.js
const onroomstr="Press connect button to broadcast yourself. To stop broadcast press disconnect button. Or you can  just stop video right now.";
const onowneroff="To broadcast yourself please enable your webcam and press start video button.\nThen connect button.";
const usoff="The member you are trying to view is currently offline. Please wait or choose another member to view.";
const you_ban="You are banned.";
const us_ban="This user is banned.";
const str_langsam_stop="We are sorry, but no more activity is acceptable. Site is closing for a profilactic works in a pair of hours.";
const str_emergency_stop="Emergency stop all activities on this site. We are sorry";
const html_head=require('./html_head'),
    html_nav_menu=require('./html_nav_menu'),
	html_admin_nav_menu=require('./html_admin_nav_menu.js'),
   html_footer = require('./html_footer'),
	login_proto=require('./login_proto.js');
const {js_help}=require('../libs/helper.js');
var warnig=false,haupt_ban=false;

const room = n=>{
let {model,showmodule:{mainmenu,profiler}}=n;
const buser=n.user;
return `<!DOCTYPE html><html lang="en"><!-- busers.js -->
<head>${html_head.html_head({title:model.name?model.name:'no_name',
csslink:"/css/main2.css"/*,js:[""]*/,cssl:["/css/video_chat.css","/css/login2.css"],luser:buser})}
<style>
video::cue{
background-image:linear-gradient(to bottom,black,black);
color:white;
}
video::cue(b){color:green;}
video::cue(a){color:blue;}
::cue-region {
color:yellow;
background:red;
}
video::cue(v[voice="fred"]){color:blue;background:red;border:5px solid green;border-radius:5px;}
</style>
</head>
<body>${warnig?'<div id="warnig">Warnig</div>':''}
<nav class="back">${html_nav_menu.html_nav_menu({buser,mainmenu,profiler})}</nav>
${haupt_ban?'<div id="haupt-banner"><div id="real-ban">Banner</div></div>':''}
${buser && buser.brole=='superadmin'?html_admin_nav_menu.html_admin_nav_menu(n):''}

<main id="pagewrap"> 
<div id="media-header">
 <b>${model?model.name:''}&nbsp;</b>${n.owner?'<div id="online-detector"></div>':''} 
${model?(model.bstatus=='yes'?'<span id="banned">banned</span>':''):''}&nbsp;&nbsp;
<span style="cursor:pointer;color:black;" onclick="hol_stoper();"><b>stoper</b></span>
</div>
<div id="media-wrapper">
<div id="video-container">
<div id="topvideo">&nbsp;<span id="complain" data-ownerid="${model?model.id:''}" onclick="get_complain(this);">report abuse</span>&nbsp;
${n.model.ab_cnt?`<span onclick="get_one_abuse();" class="ab_cnt_span" title="sum of complains">${n.model.ab_cnt}</span>`:''}
&nbsp;<b>viewers: </b><span id="rview">0</span>  ${n.owner?'<span id="tokens_panel">0</span>':''}
</div>
<div id="video-wrapper" class="${model && model.src ? '':`${n.owner?'owner-offline':'offline'}`}${model.bstatus=='yes'?' banned':''}" data-onroom="${onroomstr}" 
data-owneroffline="${onowneroff}" data-usoff="${usoff}" data-banned="${model?(model.bstatus=='yes'?(n.owner?you_ban:us_ban):''):''}">
<video id="local_video" poster="${model && model.src ? model.src:''}" autoplay controls>HTML5 video element not supported.
<track src="/vtt/test2.vtt" default>
</video>
</div>
<div id="undervideo">
${n.owner?'<button class="start" id="video_starter" onclick="get_vid(this);">start video</button>':''}<button id="connect_starter" class="start" onclick="do_conn(this);">connect</button>${!n.owner ?'<button class="start" onclick="tip();">send tip</button><button class="start" onclick="go_private();">private room</button>':''}
</div>
</div>

<div id="chat-container">
<div id="topchat"><span onclick="chat_gear();" style="cursor:pointer;" title="chat options">gear</span>&nbsp;<b>chaters: </b>
<span id="rchaters">0</span></div>
<div id="chat"></div>
<div id="underchat">
<form name="publish">
<input type="text" name="message" placeholder="Type a message!" maxlength="190"/><input type="submit" class="subm-state" value="send"/>
</form>
</div>
</div>
</div><div style="clear:both;">.</div>
${n.owner?`<br>you have <span id="modelTokens2">${model.items}</span> tokens</span><br>`:''}
<a href="#." class="overlay" id="resultativ"></a>
<output id="pop" class="popi"><div class="wrap-close"><a href="#." class="close"></a></div>
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
<!-- global -->
<input type="hidden" id="is_banned" value="${model?model.bstatus:''}"/>
<input type="hidden" id="class_us_ban" value="${us_ban}"/>
<input type="hidden" id="class_you_ban" value="${you_ban}"/>
<input type="hidden" id="inkognito" value="${n.inkognito}"/>
<input type="hidden" id="langsam_stop" value="${n.langsam_stop}"/>
<input type="hidden" id="str_langsam_stop" value="${str_langsam_stop}"/>
<input type="hidden" id="emrgency_stop" value="false"/>
<input type="hidden" id="str_emergency_stop" value="${str_emergency_stop}"/>
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


<!-- Custom Events -->
<input type="hidden" id="myevent" value="false"/>

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
<br><button onclick="suka1();">do event</button><br>
Time: <span id="mer">00:00:00</span><br><br>
<button onclick="vor_login();">log in</button>
<hr><output id="out"></output>

<input type="checkbox" id="plan_b_check">planB<br>
<span id="state_span"></span>
<div id="remote_container"></div>	

<br><b>WebRTC errors:</b><br>
<span id="rtcerror"></span><br>
<br><span id="wso"></span>

<span id="pid"></span>
<span id="timeinfo"></span>
<input type="hidden" id="loginstr" value='${login_proto.login_proto({})}'/>

<a href="#." class="overlay" id="vorlogery"></a>
<output id="vorlogin" class="popi">
<div class="wrap-close"><a href="#." class="close"></a></div>
<div id="vorlogincontainer"></div>
</output>

<a href="#." class="overlay" id="chatnastroi"></a>
<output id="chat-gear" class="popi">
<div class="wrap-close"><a href="#." class="close"></a></div>
<form name="canchat">
<div><strong>Don't accept chat users who's:</strong></div>
<input type="radio" name="chataccess" id="canchat_guest" value="1"/>&nbsp;<label>a guest</label><br>
<input type="radio" name="chataccess" id="canchat_logged" value="2"/>&nbsp;<label>a non-tokens user or a guest</label><br>
<hr>
<input type="checkbox" name="soundenable" id="soundenableid" checked value="1"/>&nbsp;<label id="soundenablelabelid">sound enabled</label><br>
<input type="submit" value="save"/>
</form>
</output>

<a href="#." class="overlay" id="get_complaini"></a>
<output id="complaini" class="popi">
<div class="wrap-close"><a href="#." class="close"></a></div>

<div><h3>Report Abuse</h3>
<h4>Choose a category:</h4>
<select id="complaini-selector" dropdown=true>
<option value="Broadcaster is underage">Broadcaster is underage</option>
<option value="Broadcaster is advertising">Broadcaster is advertising</option>
<option value="Broadcaster is abusive">Broadcaster is abusive</option>
<option value="Broadcaster is intoxicated">Broadcaster is intoxicated</option>
<option value="Broadcaster is using a toy that is too large">Broadcaster is using a toy that is too large</option>
<option value="Broadcaster is asking for offline payments">Broadcaster is asking for offline payments</option>
<option value="Broadcaster is broadcasting in public">Broadcaster is broadcasting in public</option>
<option value="Broadcaster is broadcasting in service uniform">Broadcaster is broadcasting in service uniform</option>
<option value="Broadcaster is sleeping">Broadcaster is sleeping</option>
<option value="Broadcaster is wrong gender">Broadcaster is wrong gender</option>
<option value="Other">Other</option>
</select>
</div>
<div>
<h4>Additional Comments:</h4>
<textarea id="txar-complain" placeholder="Your complain here"></textarea>
</div>
<div>
<button onclick="send_abuse();">Report</button>
${buser && buser.role=='superadmin'?`<button onclick="ban_model();"
class="ban">ban</button><button id="banId" class="ban" 
data-ban_id="${model.buser_d.ban_id?model.buser_d.ban_id:''}" onclick="ban_out(this);">ban out</button>`:''}
</div>
</output>
<br><button onclick="message_box('Halli halo message box!');">message box</button><br>
<a href="#." class="overlay" id="one_abuse"></a>
<output id="one_abuse_id" class="popi">
<div class="wrap-close"><a href="#." class="close"></a></div>

<ul>
<li><b>What?: </b>${n.model.ab_slc?n.model.ab_slc:''}
<li><b>Comment: </b>${n.model.ab_cmt?n.model.ab_cmt:''}
<li><b>Created at: </b>${n.model.ab_at?n.model.ab_at:''}
<li><b>Last modified: </b>${n.model.ab_l_mod?n.model.ab_l_mod:''}
<li><b>Count: </b>${n.model.ab_cnt?n.model.ab_cnt:''}
</ul>
<button data-ab_slc="${n.model.ab_slc?n.model.ab_slc:''}" data-ab_cmt="${n.model.ab_cmt?n.model.ab_cmt:''}" 
onclick="ban_model2(this);" class="ban">ban</button><button class="ban" value="${n.model.abus_id?n.model.abus_id:''}" onclick="not_ban(this);">skip it</button>
</output>

<a href="#." class="overlay" id="stoper"></a>
<output id="stoper_id" class="popi">
<div class="wrap-close"><a href="#." class="close"></a></div>
<button class="ban" id="smartStopBtn" data-zus="${n.langsam_stop}" title="Smart enable/disable all streams">${n.langsam_stop?'cancel smart':'smart stop'}</button>
<button class="ban" id="dirtyStopBtn" title="Dirty enable/disable all streams">${n.langsam_stop?'cancel smart':'dirty stop'}</button>
</output>

<br><button onclick="sendtome();">send to me</button><br>
<br><button onclick="send_btc_cb();">send btc cb</button><br>
<br><button onclick="gh();">hash</button><br>
<button onclick="maudio();">audio</button>
<h3>Dumping:</h3>

<div style="border:2px solid green;" id="dfucker"></div>
${js_help(["/js/video_chat.js","/js/login.js"])}
${js_help(["/js/admin_videochat.js"])}

</main><footer id="footer">${html_footer.html_footer({})}</footer>
</body>
</html>`;
}
module.exports={room};