const test_btc_input2=function(n){
return `
<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">	
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="shortcut icon" type="image/ico" href="/images/w4.png"> 
<title>checked btc input</title>
<style>
*{box-sizing:border-box;}
body{pag:0;}

/* #spanout{display:none;}	*/

#tableBtcAmount{/*color:blue;*/}

#dropBtc{
position:absolute;
background:silver;
display:none;
z-index:1;
margin-top:3px;
height:auto;width:25%;	
border:2px solid brown;
}


.btclab{
display:block;
position:relative;
border:2px solid black;
margin-top:3px;
text-align:center;
color:green;
}

.keypad-lbl{
/*color:red;*/
border:0.1em solid black;
display:inline-block;
width:52px;height:56px;	
text-align:center;
margin-top:3px;
margin-bottom:3px;
padding-top:13px;
vertical-align:middle;
font-size:20px;
cursor:pointer;
}

.keypad-lbl.act-key{
color:brown;
background:red;
}


#dropBtc::selection,.keypad-lbl::selection,#spanout::selection,label[for=dropcheck]::selection, 
.blaReset::selection, .blaBackspace::selection, .btclab::selection, button::selection{background:none;}
table{
border:1px solid green;
}
td{
border:1px solid black;
width:30px;
max-width:30px;
min-height:30px;
overflow:hidden;
height:30px;
font-size:21px;
text-align:center;
font-weight:bold;
}

hr{height:6px;background:black;}

td div{
display:block;
/*background:lightblue;*/
width:28px;
height:28px;
/*transform:translateY(13px)	rotate(45deg) scale(2,1.1);*/
transform:translateY(29px);
transition:translate 4s;
}
td div.boo{
/*transform:translateY(0);*/


animation-name:example;
animation-duration:0.4s;
animation-duration-count:1;
animation-fill-mode:both;	
}

@keyframes example{
	/*
from{transform:translateY(29px);}
to{transform:translateY(1px);}	
*/
0%{transform:translateY(29px);}
25%{transform:translateY(-20px);}
50%{transform:translateY(20px);}
75%{transform:translateY(-5px);}
100%{transform:translateY(1px);}
}


@keyframes example2{
/*
from{transform:translateY(1px);}
to{transform:translateY(-12px);}	
*/

0%{transform:translateY(1px);}
25%{transform:translateY(-4px);}
50%{transform:translateY(8px);}
75%{transform:translateY(6px);}
100%{transform:translateY(-29px);}
}

td div.boo.pissoff{
color:red;
animation-name:example2;
animation-duration:0.2s;
animation-duration-count:1;
animation-fill-mode:backwards;
}

/*
.me{display:inline-block;background:pink;border:2px solid yellow; width:50%;height:50px;}
*/
.treg{
display:block;
position:relative;
width:22px;
/*margin:0 auto;*/
height:0;
border-top:10px solid transparent;
border-right:15px solid rgba(122,2,122,0.4);
border-bottom:10px solid transparent;

}

.treg:after{
content:"";
position:absolute;
height:8px;
width:14px;
top:-4px;
left:22px;
background:rgba(122,2,122,0.4);	

}
.resetting{
display:block;
position:relative;
margin-top:3px;
border:2px solid green;
height:110px;
}

.blaReset,.blaBackspace{
display:block;
position:absolute;
text-align:center;

height:auto;
vertical-align:bottom;
font-size:20px;
line-height:1.2;
padding:6px 9px 9px 9px;
margin:6px 5px 0 5px;
/* top right bottom left*/
}
.blaReset{
top:0;
left:0;
border:1px solid red;	
}
.blaBackspace{
top:0;
right:0;
border:1px solid orange;	
}

/*
.treg:before{
position:absolute;
top:13px;
left:2px;
color:black;
content:"backspace";
font-weight:bold;
font-size:0.7em;	
letter-spacing:0.1em;
}*/


.resi{
display:block;

position:relative;
width:40px;
height:40px;
border-radius:50%;
border:4px solid green;	
ransform:rotate(1deg);
margin:16px auto;
}

.resi:before{
content:"";
position:absolute;
top:-11px;
left:10px;
/*left:0.231em;*/
width:4px;
height:26px;
background:green;
border-left:0.25em solid silver;
border-right:0.25em solid silver;	
}
/*
.resi:after{
content:"reset";
position:absolute;
top:36px;
right:-6px;
color:black;
font-size:1.em;
letter-spacing:0.1em;
font-weight:bold;	
}*/

@media screen and (max-width:690px){
body{background:lightgray;}
#dropBtc{
width:97.5%;
width:calc(100% - 16px);
}
.keypad-lbl{
width:85px;height:75px;
padding:20px;
font-size:24px;
}
.blaReset,.blaBackspace{
font-size:24px;
/*line-height:1.2;*/
/*padding:18px 18px 18px 18px;*/
padding:20px;
margin:15px 20px 0 20px;
/* top right bottom left*/	
}

}
</style>
</head>
<body>
<button onclick="bibka();">bibka</button> | <button onclick="check_transform();">check transform</button><br><br>
<b>btc_minimum=0.0263;</b>&nbsp;&nbsp;<b>btc_maximum=300;</b><br><br>
<label for="dropcheck">keypad</label><input id="dropcheck" type="checkbox" value="7"  onchange="nu(this);"/>
<table id="tableBtcAmount">
	
<caption style="background:pink;">cap</caption>
<!-- [1 - 8] -->
<td><div></div></td>
<td><div></div></td>
<td><div></div></td>
<td><div></div></td>
<td><div></div></td>
<td><div></div></td>
<td><div></div></td>
<td><div></div></td>
<!-- data-typ = [init, back, ins, reset, extrem]-->
<tfoot style="background:red;"><td colspan="10"><span id="spanout" data-typ="init"></span></td></tfoot>
</table>

<section id="dropBtc">
<!-- position: absolute -->
<div class="btclab">
<label class="keypad-lbl" data-zif="0" onclick="transfer_zif(0);">0</label>
<label class="keypad-lbl" data-zif="1" onclick="transfer_zif(1);">1</label>
<label class="keypad-lbl" data-zif="2" onclick="transfer_zif(2);">2</label>
<label class="keypad-lbl" data-zif="3" onclick="transfer_zif(3);">3</label>
<label class="keypad-lbl" data-zif="4" onclick="transfer_zif(4);">4</label>
<label class="keypad-lbl" data-zif="5" onclick="transfer_zif(5);">5</label>
<label class="keypad-lbl" data-zif="6" onclick="transfer_zif(6);">6</label>
<label class="keypad-lbl" data-zif="7" onclick="transfer_zif(7);">7</label>
<label class="keypad-lbl" data-zif="8" onclick="transfer_zif(8);">8</label>
<label class="keypad-lbl" data-zif="9" onclick="transfer_zif(9);">9</label>
<label class="keypad-lbl" data-zif="." onclick="transfer_zif('.');">.</label>
</div>

<div class="resetting">
<label class="blaReset" title="reset" onclick="transfer_reset(this);">clear</label>
<label class="blaBackspace" title="backspace" onclick="transfer_back(this);">back</label>
</div>
</section> 

<div>a dummy div</div>

<style>
#conti{border:1px solid green;display:block;position:relative;height:auto;margin-top:5px;}
.cziff{display:inline-block;border:1px solid red;position:relative;height:30px;width:30px;margin:2px;
	text-align:center;
	vertical-align:bottom;
	overflow:hidden;
	}
.ziff{
display:block;border:1px solid blue;position:absolute;top:0px;left:-1px;width:30px;

font-weight:600;font-size:23px;
}
.ziff span{vertical-align:middle;}
</style>
<div id="conti"><div class="cziff">
<div class="ziff">0</div></div><div class="cziff"><div class="ziff">1</div></div>
</div>
<output id="outi"></output>
<button onclick="get_dialog();">dialog</button>
<dialog id="figa" style="visibility:hidden;">
<!-- in the old android browsers the inner html between dialog tags must to be hidden(and in IE?) -->
<h1>dialog</h1>
<button onclick="this.parentNode.close();">close</button>
</dialog>
<script>
var is_transformly=false;
var cl_del_zif = "pissoff";
var cl_ins_zif = "boo";
var cl_act_key ="act-key";
var max_cells = 8;//11;
var spanout=gid("spanout");
spanout.textContent="";
var outi=gid("outi");
var dropBtc=gid("dropBtc");
var sik=gid("tableBtcAmount");

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



function on_btc_keyboard(event){
var keyname=event.key;
if(keyname=='Control'){
console.log("Control");
return;	
}
if(event.ctrlKey){
//console.log('combination of ctrlKey ',keyname);	
}else{
//console.log("key pressed ", keyname);
//console.log("code: ", JSON.stringify(event));	
if(keyname==0 || keyname==1 || keyname==2
|| keyname==3 || keyname==4 || keyname==5
|| keyname==6 || keyname==7 || keyname==8
|| keyname==9 || keyname=='.'){
//nett_zif(keyname);
transfer_zif(keyname);	
//nett_zif(keyname);
}else if(keyname=='Backspace'){
transfer_back(keyname);
}else{console.log("What the fuck?",keyname);}
}	
}


function nett_zif(n){
var eli=el_query('[data-zif="'+n+'"]');
if(eli){
//eli.style.color="brown";	
class_adi(eli, cl_act_key);
}
}

//document.addEventListener('keydown', on_btc_keyboard,false);

function ad_event(obj,name,funci){
obj.addEventListener(name,funci,false);
}
function rem_event(obj,name,funci){obj.removeEventListener(name,funci);}


var awevent=new CustomEvent('forinput',
 {bubbles:true, detail:{text:function(es){return es.target.textContent;},
typ:function(es){return es.target.getAttribute("data-typ");}}});


function add_keypad_events(){
if(keypad_ev)return;
for(var i = 0; i < tdel.length; i++){
tdel[i].addEventListener('animationend', on_btc_ziffer, false);
}
spanout.addEventListener('forinput', on_forinput, false);
ad_event(document, "keydown", on_btc_keyboard);
keypad_ev=true;
}

function remove_keypad_events(){
if(!keypad_ev)return;
for(var i = 0; i < tdel.length; i++){
tdel[i].removeEventListener('animationend', on_btc_ziffer);	
}	
spanout.removeEventListener('forinput', on_forinput);
rem_event(document, "keydown", on_btc_keyboard);
keypad_ev=false;
}

function on_btc_ziffer(ev){
if(!ev.animationName){alert("ev.animationName [animationend] doesn't work in this browser?");return;}
if(ev.animationName == "example2"){
ev.target.textContent = "";
class_remove(ev.target, cl_del_zif);
class_remove(ev.target, cl_ins_zif);
}else if(ev.animationName == "example"){
var el4=el_query('[data-zif="'+ev.target.textContent+'"]');
if(el4){
class_remove(el4, cl_act_key);	
}
}else{}
}


function ins_zif(text, i){
if(tdel[i] && tdel[i].firstChild){
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
if(is_transform()){
class_adi(tdel[index].firstChild, cl_del_zif);
}else{
class_remove(tdel[index].firstChild, cl_ins_zif);
tdel[index].firstChild.textContent = "";	
}
}	
}



//spanout.addEventListener('forinput', on_forinput, false);




function on_forinput(ev){
console.warn("forinput: ", ev.detail.text(ev));
var word = ev.detail.text(ev);
var leni = word.length;
console.log("leni: ", leni);
var typ=ev.detail.typ(ev);
if(typ == ins_str){
for(var i = 0; i < leni; i++){
ins_zif(word[i], i);
}
}else if(typ == back_str){
//console.log("backspace type 'del'", leni);
del_zif(leni);
}else if(typ == extrem_str){
console.warn("typ: ", typ);
var cells_txt_len = get_cells_leni();
console.log("length cells: ", cells_txt_len);
for(var i = 0; i < leni; i++){
change_zif(word[i], i);
}
var len_step = cells_txt_len - leni;
var fact_len = leni+ len_step;
for(var i = leni; i < fact_len; i++){
//console.warn("there is");
if(tdel[i].firstChild.textContent) del_zif(i);
}	
}else if(typ == reset_str){
del_all_zif();
}else{
console.warn("unknown type: ", typ);	
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
	console.error("clear_act_key() occured!");
	//.keypad-lbl.act-key
	/*
var eli2=document.querySelectorAll(".keypad-lbl."+cl_act_key);
for(var i=0;i<eli2.length;i++){
if(eli2[i]){
if(eli2[i].classList.contains(cl_act_key))class_remove(eli2[i], cl_act_key);	
}	
}	*/
var eli2=el_query(".keypad-lbl."+cl_act_key);
if(eli2){
class_remove(eli2, cl_act_key);	
}
}


function transfer_zif(el){
//console.log("here is "+el);

nett_zif(el);
if(el =="."){
t_pointsign+=1;
if(keypad_max){
//clear_act_key();	
return;
}
}
if(spanout.textContent == btc_maximum.toString()){
console.warn("already maximum btc");
//if(!keypad_max){
clear_act_key(el);
sik.style.color="red";
//}
return;	
}
if(keypad_max || keypad_min)return;
var lenis=spanout.textContent.length;

if(lenis >= max_cells-1){
if(current_number < btc_minimum){
console.log("in cells less then btc minimum. Show min val");//0.05 BTC??	
set_text(spanout, btc_minimum , extrem_str);
clear_act_key(el);
sik.style.color = "green";
return;
}
}

if(lenis >= max_cells){
//alert("kuda?");
console.log("kuda?");
var fixed_num = current_number.toFixed(4);
console.log("toFixed=> ", fixed_num);
set_text(spanout, fixed_num, extrem_str);
clear_act_key(el);
sik.style.color="green";
return;
}
set_text(spanout, spanout.textContent+el/*.textContent*/, ins_str);
sik.style.color = "blue";

var num=fetch_number(spanout.textContent);
console.log('num: ',num);
current_number = num;
if(isNaN(num)){
clear_act_key(el);
set_text(spanout, "", reset_str);

t_pointsign = 0;
return;	
}
if(num > btc_maximum){
keypad_max = true;
set_text(spanout, btc_maximum, extrem_str);
clear_act_key(el);
sik.style.color = "green";
}
if(num < btc_minimum){
console.warn("btc_minimum");
sik.style.color = "orange";
}
}


function transfer_back(el){
var a=spanout.textContent;
if(!a){console.warn("nothing to be backspaced!");alert("nothing to be backspaced!");return;}
var b=a.slice(0,-1);
set_text(spanout, b, back_str);
keypad_max=false;
keypad_min=false;
}

function transfer_reset(el){
if(!spanout.textContent){alert("Nothing to reset!");return;}	
set_text(spanout, "", reset_str);
t_pointsign=false;
keypad_max=false;
keypad_min=false;
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
function bibka(){
try{
var a=document.querySelector("#dropcheck:checked");
alert(a);
}catch(e){alert(e);}	
}
function check_transform(){
var div=document.createElement("div");
div.setAttribute("style","transform:translateY(-10px);");

document.body.appendChild(div);
var ws=!!(div.style["transform"]);
alert(ws);
div.parentNode.removeChild(div);
div=null;
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
function nu(el){
console.log("checked ",el.checked);
if(!el.checked){
console.log(el.checked);
remove_keypad_events();
dropBtc.style.display="none";	
}else{
console.log(el.checked);
dropBtc.style.display="block";
add_keypad_events();	
}
}
function get_dialog(){
figa.style.visibility="visible";
figa.showModal();	
}
function closeg(){
	//alert(1);
gid("figa").close();
gid("figa").style.display="hidden";	
}
function eltag_to_arr(n_td){
var n_td_arr=Array.prototype.slice.apply(n_td);
return n_td_arr;	
}
function set_text(el,content, typ){
el.setAttribute("data-typ", typ);
//alert(el.getAttribute("data-typ"));
el.textContent=content;	
el.dispatchEvent(awevent);
}
</script>
</body>
</html>`;
}
module.exports={test_btc_input2}
