//busers.js
var head=require('./head'),
    header_menu=require('./header_menu'),
	admin_main_menu=require('./admin_main_menu'),
    footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;

var busers = n=>{
var {buser,model,showmodule:{mainmenu,profiler}}=n;
	//console.log('BUSER: ',buser);
return `<!DOCTYPE html><html lang="en"><!-- busers.js -->
<head>${head.head({title:"User", csslink:"/css/main2.css"})}</head>
<body>${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap"> 
<style>
.modrtc{width:30%;display:inline-block;background:green;padding:10px;}
.overlay {
    background-color: rgba(0, 0, 0, 0.2);
    bottom: 0;
	left:0;
	right: 0;
    top: 0;
    cursor: default;
    opacity: 1.0;
    position: fixed;
    visibility: hidden;
    z-index: 1;
    transition: opacity .5s;
}

.overlay:target {
visibility: visible;
opacity: 1;
}

.popi {
color:gray;
background-color: rgba(0,0,0,.7);
border: 3px solid rgba(255,255,255,0.4);
left: 50%;
top: 50%;
width:50%;
opacity:0;
padding: 15px;
position: fixed;
text-align: justify;
height:50%;

min-height:50px;
visibility: hidden;
z-index: 30;
-o-transform: translate(-50%,-50%);
-ms-transform: translate(-50%,-50%);
-moz-transform: translate(-50%,-50%);
-webkit-transform: translate(-50%,-50%);
transform: translate(-50%, -50%);
border-radius: 10px;
	/*box-shadow: 0 1px 1px 2px rgba(0, 0, 0, 0.4) inset;*/
transition: opacity .5s, top .5s;
}
.overlay:target+.popi {
opacity: 1;
visibility: visible;
	}
.close {
    background-color: rgba(0, 0, 0, 0.8);
    height: 30px;
    line-height: 30px;
    position: absolute;
    right: 0;
    text-align: center;
    text-decoration: none;
    top: 15px;
    width: 30px;
 border-radius: 15px;
}
.close:before {
    color: rgba(255, 255, 255, 0.9);
    content: "X";
    font-size: 24px;
    text-shadow: 0 -1px rgba(0, 0, 0, 0.9);
}
.close:hover {
 background-color: rgba(64, 128, 128, 0.8);
}
@media screen and (max-width: 650px) {
.popup{color:red;left:50%;top:50%;width:91%;height:70vmin;}
overlay:target+.popi{left:0;}
}
	
</style>
<div class="modrtc">
<h4>Model</h4>
<b>As </b> <span id="modelName">${model.name}</span><br>
<b>Email:</b> <span id="modelEmail">${model.email}</span><br>
<b>Tokens: </b> <span id="modelTokens">${model.items}</span><br>
</div>
<div class="modrtc">
<h4>You</h4>
<b>As</b> <span id="yourName">${buser ? buser.name:'a Guest'}</span><br>
<b>Email: </b><span id="yourEmail">${buser ? buser.email:""}</span><br>
<b>Tokens: </b><span id="yourTokens">${buser ? buser.items:''}</span><br>
</div><br>
<div>
<button onclick="get_one();">send tips</button><br><br>
<button onclick="get_room();">privat</button> <span id="tokpermin">10</span> tokens/min<br><br>

</div>
Time: <span id="mer">00:00:00</span><br><br>
<hr><output id="out"></output>

<a href="#" class="overlay" id="resultativ"></a>
<output id="pop" class="popi">
<a href="#" class="close"></a>
<p>Output <a href="/tipping/purchase_tokens">purchase tokens</a></p>
<p>You have <span id="yourTokens2"></span> tokens.</p>
<p><input id="tokTosend" type="number" value="1" placeholder="1"/></p>
<button onclick="send_tokens();">send</button>
</output>

<script>
var init=0;
var startDate,clocker;
yourTokens2.textContent=yourTokens.textContent;

function send_tokens(){
if(yourName.textContent !=="a Guest"){
if(yourName.textContent!=modelName.textContent){
if(yourTokens.textContent !=0){
var data={};
data.from=yourEmail.textContent;
data.to=modelEmail.textContent;
data.amount=tokTosend.value;
data.type=1;
//var xhr=new XMLHttpRequest();
//xhr.open('post','/api/set_transfer');
//xhr.setRequestHeader('Content-Type','application/json','utf-8');
//xhr.onload=function(e){
//if(xhr.status==200){
//var mata=JSON.parse(this.response);
//modelTokens.textContent=Number(modelTokens.textContent)+mata.info.amount;
//yourTokens.textContent-=mata.info.amount;
//rechnet(this.response);
//out.innerHTML=this.response;
//}else{
//out.innerHTML=this.response+this.status;
//}}
//xhr.onerror=function(e){out.innerHTML=this.response + ' '+ e}
//out.innerHTML=JSON.stringify(data);
if(tokTosend.value<=Number(yourTokens.textContent)){
//xhr.send(JSON.stringify(data));
to_xhr(JSON.stringify(data),true);
}else{out.innerHTML="Not enouth tokens!";}
}else{out.innerHTML="Not enough tokens!";}
}}else{out.innerHTML='Please <a href="/login">log in</a>';}
}

function rechnet(n){
	var mata=JSON.parse(n);
	//modelTokens.textContent=Number(modelTokens.textContent)+mata.info.amount;
    modelTokens.textContent=Number(modelTokens.textContent)+Number(mata.info.amount);
    yourTokens.textContent-=mata.info.amount;
	yourTokens2.textContent-=mata.info.amount;
    //out.innerHTML=this.response;
//from rechnet2
        //modelTokens.textContent=Number(modelTokens.textContent)+Number(mata.info.amount);//(tokpermin.textContent);
		//yourTokens.textContent-=tokpermin.textContent;
		//yourTokens2.textContent=yourTokens.textContent;
	}
	
function get_room(){
	if(init==0){
	if(yourName.textContent !=="Guest"){
	if(yourName.textContent!=modelName.textContent){
    if(yourTokens.textContent !=0){
	startDate=new Date();
	starttime();
	}else{
out.innerHTML="Not enough tokens!";}
}
}else{out.innerHTML='Please <a href="/login">log in</a>';}	
	init=1;}else{
	init=0;
	clearTimeout(clocker);
	}
	}
	
	function starttime(){
	var thisd=new Date();
	var t=thisd.getTime()-startDate.getTime();
		var ms=t%1000;
		t-=ms;
		ms=Math.floor(ms/10);
		t=Math.floor(t/1000);
		var s=t%60;
		t-=s;
		t=Math.floor(t/60);
		var m=t%60;
		t-=m;
		t=Math.floor(t/60);
		var h=t%60;
		if(h<10) h='0'+h;
		if(m<10) m='0'+m;
		if(s<10) s='0'+s;
		//if(ms<10) ms='0'+ms;
		if(init==1) mer.textContent=h+':'+m+':'+s;//+'.'+ms;
		clocker=setTimeout("starttime()",1000);
		if(s==10){
		console.log("kuuu");
		var sraka={};
			
		//modelTokens.textContent=Number(modelTokens.textContent)+Number(tokpermin.textContent);
		//yourTokens.textContent-=tokpermin.textContent;
		//yourTokens2.textContent=yourTokens.textContent;
			
			sraka.from=yourEmail.textContent;
            sraka.to=modelEmail.textContent;
            sraka.amount=tokpermin.textContent;
            sraka.type=2;
			var si=JSON.stringify(sraka);
			to_xhr(si,true);
		if(yourTokens.textContent<=Number(tokpermin.textContent)){
		clearTimeout(clocker);
		out.innerHTML="Seance is over"
		}
		}
		}

function to_xhr(n,bool){
var xhr=new XMLHttpRequest();
xhr.open('post','/api/set_transfer');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.onload=function(e){
if(xhr.status==200){
out.innerHTML=this.response;
if(bool) rechnet(this.response);
}else{
out.innerHTML=this.response+this.status;
}}
xhr.onerror=function(e){out.innerHTML=this.response + ' '+ e};
xhr.send(n);
}

function get_one(){
window.location.href="#resultativ";
	}

</script>
</main><footer id="footer">${footer.footer({})}</footer>
</body>
</html>`;
}
module.exports={busers};