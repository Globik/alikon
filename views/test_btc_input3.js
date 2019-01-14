function test_btc_input3(n){
	return `
<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">	
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="shortcut icon" type="image/ico" href="/images/w4.png"> 
<title>checked btc input v3</title>
<style>
*{box-sizing:border-box;}
body{}

#tableBtcAmount{
border-collapse:collapse;
margin-top:12px;
}
#tableBtcAmount tbody{color: rgba(6,39,2,0.9);}
#tableBtcAmount tbody.red{color:rgba(236,13,53,1);}
#tableBtcAmount tbody.green{color:/*green*/#1b6314;}
#tableBtcAmount tbody.orange{color:orange;}

.keypadInfo{
	/*
background:rgba(200,220,255,0.1);
background: linear-gradient(rgba(200,220,255,0.2),rgba(202,223,253,0.3));
*/ 
height:20px;
}

.span-btc-min,.span-btc-max{border:1px solid transparent;padding:6px 8px 6px 8px;line-height:2.5;}

.span-btc-min.min{border-color:#1b6314;color:#1b6314;}
.span-btc-max.max{border-color:rgba(236,13,53,1);color:rgba(236,13,53,1);}
#padinfo{
padding-left:9px;
color:rgb(23,10,23);
}
small{font-family:monospace;letter-spacing:1px;font-size:13px;}
#padinfo.red{color:rgba(236,13,53,1);}
#padinfo.green{color:#1b6314;}
#padinfo.orange{
/*color: rgb(254,255,255);*/
color:rgba(236,13,53,1);
}
#wraptable{
width:330px;
border:1px solid gray;
display:block;
height:50px;
position:relative;
margin-top:3px;
}
#wraptable.focus{
border-color:rgba(15,152,234,.75);
}

#dropBtc{
position:relative;
background:rgba(228,218,218,0.6);
display: none;
margin-top:0.06em;
margin-bottom: 2px;
padding-bottom:2px;
height:auto;
width: 330px;
border:1px solid rgba(15,152,234,.75);
}
@keyframes dropRed{
0%{border-color: inherit;}
25%{border-color: rgba(236,13,53,1);}
50%{border-color: inherit;}
75%{border-color: rgba(236,13,53,1);}
100%{border-color: inherit;}
}

#dropBtc.red{
animation-name: dropRed;	
animation-duration: 0.4s;
animation-duration-count:1;
/*nimation-fill-mode:backwards;*/
}

.btclab{
display:block;
position:relative;
/*border:2px solid black;*/
margin-top:3px;
text-align:center;
color:green;
}

.keypad-lbl, .keypadBackspace, .keypadReset{
display:inline-block;
border:1px solid rgba(0,0,0,0.9);	
height:54px;
font-size:20px;
margin-top:2px;
margin-bottom:2px;
padding-top:14px;
border-radius:1px;
cursor:pointer;
font-family:"Roboto",sans-serif;
/*
background:#991b1b;
background:linear-gradient(silver,gray);
*/ 
color: rgba(6,39,2,0.9);

text-shadow:-0.01em -1px 0px #0f13c1c7;
}

.keypad-lbl:hover, .keypadBackspace:hover, .keypadReset:hover{
background:linear-gradient(gray,silver);
}


.keypad-lbl{
width:52px;
}
.keypadReset,.keypadBackspace{
width:108px;
}


.keypadBackspace.act,.keypadReset.act,.keypad-lbl.act-key{
box-shadow:0 0 1px 2px white;	
background:linear-gradient(gray,silver);
border-color: black;/*#490e0e;*/
color:silver;
}




#dropBtc::selection,.keypad-lbl::selection,#spanout::selection,label[for=dropcheck]::selection, 
.keypadReset::selection, .keypadBackspace::selection, .btclab::selection, button::selection, #padinfo::selection{background:none;}


label[for="dropcheck"]{
cursor:pointer;
height:auto;
display:block;
margin-top:4px;
}


td::after{
content:"";
background:rgba(0,190,0,0.4);

display:block;
width:0%;
height:1px;
opacity:0.0;
transition: width 0.8s, opacity 0.8s;	
}

td.wboo::after{
width:100%;
opacity:0.4;
}

#tableBtcAmount td{
border-top:none;
border-left:none;
border-right:none;
overflow:hidden;
font-family:Sans-Serif;
font-size:21px;

margin:0;
padding:0;
}


#tableBtcAmount td div{
display:block;
/*background:lightblue;*/

width:13px;
height:24px;
transform:translateY(29px);
}
td div.boo{
animation-name:example;
animation-duration:0.1s;
animation-duration-count:1;
animation-fill-mode:both;	
}



@keyframes example{
0%{transform:translateY(29px);}
25%{transform:translateY(-29px);}
50%{transform:translateY(10px);}
75%{transform:translateY(-10px);}
100%{transform:translateY(0);}
}


@keyframes example2{

0%{transform:translateY(0);}
25%{transform:translateY(-4px);}
50%{transform:translateY(8px);}
75%{transform:translateY(4px);}
100%{transform:translateY(-29px);}
}

td div.boo.pissoff{
color:/*red*/rgba(236,13,53,1);
animation-name:example2;
animation-duration:0.1s;
animation-duration-count:1;
animation-fill-mode:backwards;
}


@keyframes kursi{
from{opacity:1;}
to{opacity:0;}
}

#cursi{
position:absolute;
display: none;
top:4px;
left:0px;
visibility:visible;
background:green;
order:1px solid transparent;
order-radius:50%;
width:1px;
height:40px;
animation-name:kursi;
animation-duration:1s;
/*animation-direction:alternate-reverse;*/
animation-iteration-count:infinite;
}

#placeholdi{
position:absolute;
display:block;
top:15px;left:3px;
ackground:violet;	
color:rgba(10,10,15,0.6);
}
#placeholdi.empty{
display:none;	
}
/*
.treg-down-container{
position:absolute;
right:0;
top:0;
width:44px;
height:47px;
background:red;
}
*/
.treg-down{
display:block;
position:absolute;
width:0;
height:0;
right:20px;
top:18px;

border-left:18px solid transparent;
border-right:18px solid transparent;
border-top:18px solid rgba(10,13,12,1.0);
transition: all .4s;
}

.treg-down.act{
border-top-color: #484444;
}

@media screen and (max-width:2000px){
#med::after{
content:"max-width: default? 2000px";	
}	
}


@media screen and (max-width:1024px){
#med::after{
content:"max-width: 1024px";	
}	
#wraptable{width:100%;}
#dropBtc{
width: 100%;
}
.keypad-lbl,.keypadReset,.keypadBackspace{
width:100px;height:100px;
padding:36px;
font-size:24px;
}
.keypadReset,.keypadBackspace{
width:204px;
}
}

@media screen and (max-width:480px){
body{background:pink;}	
#med::after{
content:"max-width:480px";	
}

}

@media screen and (max-width:320px){
body{}
#med::after{
content:"max-width:320px";	
}
.keypad-lbl,.keypadReset,.keypadBackspace{width:48%;}
#homo{font-size:10px;}
.span-btc-min,.span-btc-max{font-size:10px;letter-spacing:1px;}
}
</style>
</head>
<body>
<div id="med">@</div>
<form id="foget" action="/foo" method="get" name="dooo">
<fieldset><legend>choose</legend><b id="homo">Bitcoin</b><span class="span-btc-min"> minimum 0.0263</span>
<span class="span-btc-max">maximum 300</span><br>
<!-- <div style="background-color:red; color:red;width:330px;text-align:left;height:1px;"></div> -->
<label for="dropcheck"><input id="dropcheck" type="checkbox" hidden value="7"/><span><b>your btc amount:</b></span>
<div id="wraptable" style="">
<div id="cursi" style=""></div>
<div id="placeholdi">0.05 (BTC)</div>
<table id="tableBtcAmount">
	
<!-- <caption id="captEl" style="background:pink;margin-bottom: 1px;">0.05</caption> -->
<!-- [1 - 8] -->
<!-- <thead><tr><th colspan="8" style="text-align:left;background:pink;">btc</th></tr></thead> -->
<tbody style="">
<td><div></div></td>
<td><div></div></td>
<td><div></div></td>
<td><div></div></td>
<td><div></div></td>
<td><div></div></td>
<td><div></div></td>
<td><div></div></td>
</tbody>
<!-- data-typ = [init, back, ins, reset, extrem]-->
<tfoot style="display:none;"><td colspan="8">
<input type="text" id="spanout" name="btc" value="" data-typ="init"/> 
</td>
</tfoot> 
</table>
<!-- <div class="treg-down-container"> -->
<div id="tregDown" class="treg-down"></div>
<!-- </div> -->
</div>
</label>

<section id="dropBtc">
<!-- position: relative is besser -->
<section class="keypadInfo"><small id="padinfo">keypad</small></section>
<section class="btclab">
<label class="keypad-lbl" data-zif="0">0</label>
<label class="keypad-lbl" data-zif="1">1</label>
<label class="keypad-lbl" data-zif="2">2</label>
<label class="keypad-lbl" data-zif="3">3</label>
<label class="keypad-lbl" data-zif="4">4</label>
<label class="keypad-lbl" data-zif="5">5</label>
<label class="keypad-lbl" data-zif="6">6</label>
<label class="keypad-lbl" data-zif="7">7</label>
<label class="keypad-lbl" data-zif="8">8</label>
<label class="keypad-lbl" data-zif="9">9</label>
<label class="keypad-lbl" title="point" data-zif=".">.</label>
<label class="keypadReset" title="reset">clear</label>
<label class="keypadBackspace" title="backspace">back</label>
</section>
</section> 
</fieldset>
<input type="submit" value="ok"/>
</form>
<div>a dummy div</div>


<output id="outi"></output>
<button onclick="get_dialog();">dialog</button>
<dialog id="figa" style="visibility:hidden;">
<!-- in the old android browsers the inner html between dialog tags must to be hidden(and in IE?) -->
<h1>dialog</h1>
<button onclick="this.parentNode.close();">close</button>
</dialog>

<script>
var l_debug=1;//0 if a need to debug
var is_transformly=false;
var cl_del_zif = "pissoff";
var cl_ins_zif = "boo";
var cl_act_key ="act-key";
var max_cells = 8;
var spanout=gid("spanout");
spanout.value="";
var outi=gid("outi");
var dropBtc=gid("dropBtc");
var dropcheck=gid("dropcheck");
var sik=gid("tableBtcAmount");
var t_tbody=el_query('tbody');
var backSpace=el_queryd(dropBtc,".keypadBackspace");
var span_btc_min=el_query(".span-btc-min");
var span_btc_max=el_query(".span-btc-max");
var padinfo=gid("padinfo");
var keypad_lbl=elclass(dropBtc, 'keypad-lbl');


var backReset=el_query(".keypadReset");

var btc_maximum = 300;
var btc_minimum=0.0263;
var tdel = eltag("td");
var tdel2=eltag_to_arr(tdel);
var keypad_ev=false;
var keypad_default_btcsum=0.05;

var t_pointsign=0;
var keypad_max=false;
var keypad_min=false;
var current_number;

var back_str = "back";
var reset_str = "reset";
var ins_str = "ins";
var extrem_str = "extrem";

(function(){
if(typeof window.CustomEvent==="function")return false;
function CustomEvent(event,p){
var evt;
var pr=p || {bubbles:false,cancelable:false,detail:undefined};
evt=document.createEvent("CustomEvent");
evt.initCustomEvent(event,pr.bubbles,pr.cancelable,pr.detail);
return evt;	
}
CustomEvent.prototype=window.Event.prototype;
window.CustomEvent=CustomEvent;	
})();

function clog(n){
if(l_debug==0){
console.log(n);	
}	
}
function on_btc_keyboard(event){
var keyname=event.key;
if(keyname=='Control'){
clog("Control");
return;	
}
if(event.ctrlKey){
clog('combination of ctrlKey '+keyname);	
}else{
if(keyname==0 || keyname==1 || keyname==2
|| keyname==3 || keyname==4 || keyname==5
|| keyname==6 || keyname==7 || keyname==8
|| keyname==9 || keyname=='.'){
transfer_zif(keyname);
}else if(keyname=='Backspace'){
transfer_back(keyname);
}else{clog("What the fuck?"+keyname);}
}	
}


function nett_zif(n){
var eli=el_queryd(dropBtc,'[data-zif="'+n+'"]');
if(eli){
class_adi(eli, cl_act_key);
}
}

function ad_event(obj,name,funci){
obj.addEventListener(name,funci,false);
}
function rem_event(obj,name,funci){obj.removeEventListener(name,funci);}


var awevent=new CustomEvent('forinput',
 {bubbles:true, detail:{text:function(es){return es.target.value;},
typ:function(es){return es.target.getAttribute("data-typ");}}});

dropcheck.addEventListener('change', on_drop_btc,false);

function add_keypad_events(){
if(keypad_ev)return;
for(var i = 0; i < tdel.length; i++){
if(tdel[i])ad_event(tdel[i],'animationend',on_btc_ziffer);
}
for(var i = 0; i < keypad_lbl.length;i++){
if(keypad_lbl[i]){
ad_event(keypad_lbl[i],'click',transfer_zif);	
}	
}
if(backSpace)ad_event(backSpace,'click',transfer_back);
if(backReset)ad_event(backReset,'click',transfer_reset);
spanout.addEventListener('forinput', on_forinput, false);
ad_event(document, "keydown", on_btc_keyboard);
ad_event(dropBtc, "animationend", on_drop_red_btc);
keypad_ev=true;
}

function remove_keypad_events(){
if(!keypad_ev)return;
for(var i = 0; i < tdel.length; i++){
if(tdel[i])rem_event(tdel[i],'animationend', on_btc_ziffer);
}	
for(var i=0;i<keypad_lbl.length;i++){
if(keypad_lbl[i]){
rem_event(keypad_lbl[i],'click', transfer_zif);	
}	
}
spanout.removeEventListener('forinput', on_forinput);
rem_event(document, "keydown", on_btc_keyboard);
rem_event(dropBtc, 'animationend', on_drop_red_btc);
if(backSpace)rem_event(backSpace,'click', transfer_back);
if(backReset)rem_event(backReset,'click', transfer_reset);
keypad_ev=false;
}

function on_drop_red_btc(ev){
if(ev.animationName=="dropRed"){
clog("dropRed end!");
ev.target.className="";
}	
}

function on_btc_ziffer(ev){
if(!ev.animationName){alert("ev.animationName [animationend] doesn't work in this browser?");return;}
if(ev.animationName == "example2"){
ev.target.textContent = "";
class_remove(ev.target, cl_del_zif);
class_remove(ev.target, cl_ins_zif);
class_remove(backSpace, "act");
class_remove(backReset, "act");
}else if(ev.animationName == "example"){
var el4=el_query('[data-zif="'+ev.target.textContent+'"]');
if(el4){
class_remove(el4, cl_act_key);	
}
}else{}
}

function ins_zif(text, i){
if(tdel[i] && tdel[i].firstChild){
tdel[i].className="wboo";
class_adi(tdel[i].firstChild, cl_ins_zif);
tdel[i].firstChild.textContent = text;
}
}

function change_zif(new_content, index){
if(tdel[index] && tdel[index].firstChild){
tdel[index].firstChild.textContent = new_content;
}
}

function del_all_zif(){
for(var i = 0; i < tdel.length; i++){
if(tdel[i] && tdel[i].firstChild){

if(tdel[i].firstChild.textContent){
tdel[i].className="";
if(is_transform()){
class_adi(tdel[i].firstChild, cl_del_zif);
}else{
class_remove(tdel[i].firstChild, cl_ins_zif);
tdel[i].firstChild.textContent = "";	
}
}

}}
}



function del_zif(index){
if(tdel[index] && tdel[index].firstChild){
	tdel[index].className="";
if(is_transform()){
class_adi(tdel[index].firstChild, cl_del_zif);
}else{
class_remove(tdel[index].firstChild, cl_ins_zif);
tdel[index].firstChild.textContent = "";	
}
}	
}

var s_d=0;

function on_forinput(ev){
clog("forinput: "+ev.detail.text(ev));
var word = ev.detail.text(ev);
var leni = word.length;
clog("leni: "+leni);

var typ=ev.detail.typ(ev);
clog("type data: "+typ);
if(typ == ins_str){
if(leni==1){placeholdi.className="empty";}else if(leni==0){placeholdi.className="";}else{}
for(var i = 0; i < leni; i++){
ins_zif(word[i], i);
}
s_d+=13;
cursi.style.left=s_d+"px";
}else if(typ == back_str){
del_zif(leni);
if(leni==0){placeholdi.className="";}
s_d=s_d-13;
cursi.style.left=s_d+"px";
}else if(typ == extrem_str){
var cells_txt_len = get_cells_leni();
clog("length cells: "+ cells_txt_len);
for(var i = 0; i < leni; i++){
change_zif(word[i], i);
}
var len_step = cells_txt_len - leni;
var fact_len = leni + len_step;
for(var i = leni; i < fact_len; i++){
clog("there is"+ leni+" cursi: "+s_d);
if(tdel[i].firstChild.textContent) del_zif(i);
}

s_d=13*leni;
cursi.style.left=s_d+"px";
}else if(typ == reset_str){
del_all_zif();
if(leni==0)placeholdi.className="";
s_d=0;
cursi.style.left=s_d+"px";
}else{
clog("unknown type: "+typ);	
}
}

function get_cells_leni(){
var sc=0;
for(var i=0;i<max_cells;i++){
if(tdel[i] && tdel[i].firstChild){
if(tdel[i].firstChild.textContent){
sc++;	
}	
}	
}
return sc;	
}

function clear_act_key(){
if(is_transform()){
var eli2=el_queryd(dropBtc, ".keypad-lbl."+cl_act_key);
if(eli2){
class_remove(eli2, cl_act_key);	
}
}
}

//document.body.onclick=function(){alert("document click!");}
function transfer_zif(el){
var sa;
if(el.target){
sa=el.target.getAttribute("data-zif");
if(!sa)return;
el.stopPropagation();
}else{
sa=el;
if(!sa)return;	
}
var el=sa;
if(is_transform())nett_zif(el);
if(el =="."){
t_pointsign+=1;
if(keypad_max){
clear_act_key();	
return;
}
}

if(spanout.value==btc_maximum.toString()){
clog("already maximum btc");
clear_act_key(el);
t_tbody.className="red";
class_adi(span_btc_max,"max");
class_remove(span_btc_min, "min");
padinfo.className="red";
padinfo.textContent="Oops. It's a maximum.";
dropBtc.className="red";
return;	
}
if(keypad_max || keypad_min)return;
var lenis=spanout.value.length;

if(lenis >= max_cells-1){
if(current_number < btc_minimum){
clog("in cells less then btc minimum. Show min val");//0.05 BTC??	
set_text(spanout, btc_minimum , extrem_str);
padinfo.textContent="It's a minimum!";
clear_act_key(el);
t_tbody.className= "green";
class_adi(span_btc_min, "min");
class_remove(span_btc_max, "max");
return;
}
}

if(lenis >= max_cells){
if(!current_number)return;
var fixed_num = current_number.toFixed(4);
clog("toFixed=> "+ fixed_num);
set_text(spanout, fixed_num, extrem_str);
padinfo.textContent="Fixed to "+ fixed_num + " bitcoins.";
clear_act_key(el);
t_tbody.className="green";
class_remove(span_btc_min, "min");
class_remove(span_btc_max, "max");
return;
}
padinfo.textContent="...";
set_text(spanout, spanout.value + el, ins_str);

var num=fetch_number(spanout.value);
clog('num: '+num);
current_number = num;
if(isNaN(num)){
clear_act_key(el);
padinfo.textContent="Oops, not a valid one. Try again."
set_text(spanout, "", reset_str);
t_tbody.className="";
dropBtc.className="red";
t_pointsign = 0;
return;	
}
if(num > btc_maximum){
keypad_max = true;
set_text(spanout, btc_maximum, extrem_str);
clear_act_key(el);
}
if(num < btc_minimum){
clog("btc_minimum");
t_tbody.className="orange";
}
}

function inform_padinfo(n){
dropBtc.className="red";
padinfo.className="orange";
padinfo.textContent=n;	
}

function transfer_back(el){
if(el.target){el.stopPropagation();}
var a=spanout.value;
if(!a){
inform_padinfo("Nothing to be backspaced.");
return;
}
var b=a.slice(0,-1);
if(is_transform()){
class_adi(backSpace, "act");
}
set_text(spanout, b, back_str);
clear_padinfo("...");
}

function clear_padinfo(n){
class_remove(span_btc_min, "min");
class_remove(span_btc_max, "max");
t_tbody.className="";
padinfo.textContent=n;
padinfo.className="";
t_pointsign=false;
keypad_max=false;
keypad_min=false;	
}

function transfer_reset(el){
if(el.target){
el.stopPropagation();	
}
if(!spanout.value){
inform_padinfo("Nothing to clear.");
return;
}	
if(is_transform()){class_adi(backReset,"act");}
set_text(spanout, "", reset_str);
clear_padinfo("keypad");
}

function check(){
console.log(Number(spanout.textContent))	
}
function fetch_number(str){
try{
var anum_s=Number(str);	
return anum_s;
}catch(er){alert(er);return undefined;}
}
function gid(id){
return document.getElementById(id);	
}

function eltag(td){
return dom_tagi("tableBtcAmount", td);	
}

function eltagi(str){
return document.getElementsByTagName(str);	
}

function elclass(elid, n){
return elid.getElementsByClassName(n);	
}
function dom_tagi(id,s){
var el_n=gid(id);
if(!el_n)return null;
var el_nu=el_n.getElementsByTagName(s);
if(!el_nu)return null;
return el_nu;	
}
function class_adi(node,clas){
if(!node){alert("wrong node el in class_adi()?");console.error("wrong node el?");return;}
if(node.classList){node.classList.add(clas);}	
}

function class_remove(node,clas){
if(!node){alert("wrong node el in class_remove()?");console.error("wrong node el?");return;}
if(!node.classList){console.error("no classList in el?");return;}
node.classList.remove(clas);
}

function is_transform(){
return is_transformly;
}

function is_transi(){
var div=document.createElement("div");
div.setAttribute("style","transform:translateY(-10px);");
document.body.appendChild(div);
var ws=!!(div.style["transform"]);
is_transformly=ws;
div.parentNode.removeChild(div);
div=null;
}
is_transi();

function el_query(n){
return document.querySelector(n);	
}
function el_queryd(elid, n){
return elid.querySelector(n);	
}

function on_drop_btc(el){
clog("checked ", el.target.checked);
if(!el.target.checked){
remove_keypad_events();
dropBtc.style.display="none";	
wraptable.className="";
cursi.style.display="none";
class_remove(tregDown, "act");
}else{
dropBtc.style.display="block";
wraptable.className="focus";
cursi.style.display="block";
add_keypad_events();	
class_adi(tregDown,"act");
}
el.stopPropagation();
}



function get_dialog(){
figa.style.visibility="visible";
figa.showModal();	
}
function closeg(){
gid("figa").close();
gid("figa").style.display="hidden";	
}
function eltag_to_arr(n_td){
var n_td_arr=Array.prototype.slice.apply(n_td);
return n_td_arr;	
}
function set_text(el,content, typ){
el.setAttribute("data-typ", typ);	
el.value=content;
el.dispatchEvent(awevent);
}
</script>
</body>
</html>




`;
}
module.exports={test_btc_input3}
