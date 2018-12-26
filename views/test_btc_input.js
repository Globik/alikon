const test_btc_input=function(n){
return `<!DOCTYPE html><html lang="en">
<head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="shortcut icon" type="image/ico" href="/images/w4.png"> 
<title>btc input</title>
<style>
*{box-sizing:border-box;}
body{}
#dropBtc{
position:absolute;
background:silver;
display:none;
z-index:1;
margin-top:3px;
height:auto;
width:50%;	
border:2px solid brown;
}
#dropcheck:checked ~ #dropBtc{
display:block;
z-index:1;
}
.btclab{
display:block;
position:relative;
border:2px solid black;
margin-top:3px;
text-align:center;
}
.bla{
color:red;
border:0.1em solid black;
display:inline-block;
width:52px;
height:56px;	
text-align:center;
margin-top:3px;
margin-bottom:3px;
padding-top:13px;
vertical-align:middle;
font-size:20px;
cursor:pointer;
}
#dropBtc::selection,.bla::selection,#spanout::selection,label[for=dropcheck]::selection, 
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
td div{
display:block;
background:lightblue;
width:28px;height:28px;
transform:translateY(29px);
transition:translate 4s;
}
td div.boo{
animation-name:example;
animation-duration:0.4s;
animation-duration-count:1;
animation-fill-mode:both;	
}

@keyframes example{
0%{transform:translateY(29px);}
25%{transform:translateY(-20px);}
50%{transform:translateY(20px);}
75%{transform:translateY(-5px);}
100%{transform:translateY(1px);}
}


@keyframes example2{
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
adding:2px 4px 8px 20px;	
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

</style>
</head>
<body>
<a href="/">home</a> | <a href="/interfaces">interfaces lab</a>
<h1>BTC INPUT</h1>
<label for="dropcheck">menu</label><input id="dropcheck" type="checkbox" value="7"/>
<table id="tableBtcAmount">
<caption style="background:pink;">cap</caption>
<td><div data-zid="1"></div></td>
<td><div data-zid="2"></div></td>
<td><div data-zid="3"></div></td>
<td><div data-zid="4"></div></td>
<td><div data-zid="5"></div></td>
<td><div data-zid="6"></div></td>
<td><div data-zid="7"></div></td>
<td><div data-zid="9"></div></td>
<td><div data-zid="10"></div></td>
<td><div data-zid="11"></div></td>
<td><div data-zid="12"></div></td>
<tfoot style="background:red;"><td colspan="10"><span id="spanout"></span></td></tfoot>
</table>

<div id="dropBtc">
<div class="btclab">
<label class="bla" onclick="show_z(this);">0</label>
<label class="bla" onclick="show_z(this);">1</label>
<label class="bla" onclick="show_z(this);">2</label>
<label class="bla" onclick="show_z(this);">3</label>
<label class="bla" onclick="show_z(this);">4</label>
<label class="bla" onclick="show_z(this);">5</label>
<label class="bla" onclick="show_z(this);">6</label>
<label class="bla" onclick="show_z(this);">7</label>
<label class="bla" onclick="show_z(this);">8</label>
<label class="bla" onclick="show_z(this);">9</label>
<label class="bla" onclick="show_z(this);">.</label>
</div>

<div class="resetting">
<label class="blaReset" title="reset" onclick="show_reset(this);">clear</label>
<label class="blaBackspace" title="backspace" onclick="show_b(this);">back</label>
</div>

</div> 

<script>
var cl_del_zif = "pissoff";
var cl_ins_zif = "boo";
var max_cells = 11;
var spanout=gid("spanout");
var is_max = false;
var fake_max = 300;
var fake_num = 300.0001;
var tdel = eltag("td");

for(var i=0;i<tdel.length;i++){
tdel[i].addEventListener('animationend', on_btc_ziffer, false);
}



function on_btc_ziffer(ev){
if(!ev.animationName){alert("ev.animationName [animationend] doesn't work in this browser?");return;}
if(ev.animationName=="example2"){
ev.target.textContent="";
class_remove(ev.target, cl_del_zif);
class_remove(ev.target, cl_ins_zif);
}
}
function booreset(){
for(var i=0;i<tdel.length;i++){
if(tdel[i] && tdel[i].firstChild){
class_adi(tdel[i].firstChild, cl_del_zif);
}
}
}


function ins_zif(s,i){
if(tdel[i] && tdel[i].firstChild){
class_adi(tdel[i].firstChild, cl_ins_zif);
tdel[i].firstChild.textContent=s;
}
}

function del_all_zif(){
for(var i=0;i<tdel.length;i++){
if(tdel[i] && tdel[i].firstChild){
if(tdel[i].firstChild.textContent)class_adi(tdel[i].firstChild, cl_del_zif);
}}	
}



function del_zif(index){
if(tdel[index] && tdel[index].firstChild){
class_adi(tdel[index].firstChild, cl_del_zif);
}	
}

spanout.textContent="";
var t=0;
function show_z(el){
if(el.textContent=="."){
t+=1;
//if(t>=2)return;
if(is_max)return;
}
var lenis=spanout.textContent.length;
if(lenis >= max_cells){alert("kuda?");return;}

spanout.textContent+=el.textContent;
//ins_zif(el.textContent,spanout.textContent.length-1);
//if(spanout.textContent.length>0){

var num=fetch_number(spanout.textContent);
console.log('num: ',num);

if(isNaN(num)){
spanout.textContent="";
del_all_zif();
t=0;
return;	
}
if(num > fake_max){
is_max=true;
spanout.textContent=fake_max;
}
ins_zif(el.textContent,spanout.textContent.length-1);
if(num>fake_max){
var nh=fake_max.toString();
for(var i=0;i<nh.length;i++){
tdel[i].firstChild.textContent=nh[i];	
}
}

}
function show_b(el){
var a=spanout.textContent;
var b=a.slice(0,-1);
spanout.textContent=b;
del_zif(a.length-1);
is_max=false;
}
function show_reset(el){
if(!spanout.textContent){alert("Nothing to reset!");return;}
spanout.textContent="";	
del_all_zif();
t=false;
is_max=false;
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
</script>
</body>
</html>
`;	
}
module.exports={test_btc_input}
