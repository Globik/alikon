const test_mouse=function(n){
return `<html><head><title>mouse touch</title>
<style>
#up,#up2,#down,#down2{
border:4px solid black;
padding:20px;
cursor:pointer;
line-height:2.5;
margin-top:300px;
-webkit-user-select:none;
-moz-user-select:none;
-ms-user-select:none;
user-select:none;	
background:none;
-webkit-appearance:none;
-moz-appearance:none;
appearance:none;
}
#out,#out2,h4,#out4{
-webkit-user-select:none;
-moz-user-select:none;
-ms-user-select:none;
user-select:none;	
background:none;
}
#up::selection,#up2::selection,#down::selection,#down2::selection,#out::slection,#out2::selection,h4::selection,#out4::selection{background:none;}
</style>
</head>
<body>
<h4>mouse down / up and touchstart / touchend</h4>
<span id="up" data-typ="up">up</span>
<output id="out"></output>
<span id="down" data-typ="down">down</span>

<h4>only touchstart / touchend</h4>
<span id="up2" data-typ="up">up</span>
<output id="out2"></output>
<span id="down2" data-typ="down">down</span>
<h4>type</h4>
<div id="out4"></div>

</body>
<script>
var m;var int=0;
var out4=gid('out4'),out2=gid('out2'),out=gid('out'),up=gid('up'),up2=gid('up2'),down=gid('down'),down2=gid('down2');
var s_timer=100;

function handler_plus(ev){
ev.preventDefault();
ev.stopPropagation();
out4.textContent=ev.type;
var typ=ev.target.getAttribute("data-typ");
console.log("typ: ",typ);
if(ev.type=="mousedown"){
m=true;
typ=="up"?evi_plus():evi_minus();	
}else if(ev.type=="mouseup"){
m=false;
}else if(ev.type=="touchstart"){
m=true;
typ=="up"?evi_plus():evi_minus();
}else if(ev.type=="touchend"){
m=false;	
}	
}
up.addEventListener('mousedown',handler_plus,false);
up.addEventListener('mouseup', handler_plus,false);
down.addEventListener('mousedown', handler_plus,false);
down.addEventListener('mouseup', handler_plus,false);

up.addEventListener('touchstart', handler_plus,false);
up.addEventListener('touchend', handler_plus,false);
down.addEventListener('touchstart', handler_plus,false);
down.addEventListener('touchend', handler_plus,false);

function evi_plus(){
if(m){
int++;
out.textContent=int;
out2.textContent=int;
setTimeout("evi_plus()",s_timer);

}else{return false;}
}


function evi_minus(){
if(m){
int--;
out.textContent=int;
out2.textContent=int;
setTimeout("evi_minus()",s_timer);

}else{return false;}
}

/* touch test */

up2.addEventListener('touchstart', handler_plus,false);
up2.addEventListener('touchend', handler_plus,false);

down2.addEventListener('touchstart', handler_plus,false);
down2.addEventListener('touchend', handler_plus,false);

function gid(id){return document.getElementById(id);}
</script>
</html>`;
}
module.exports={test_mouse}
