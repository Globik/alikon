const test_mouse=function(n){
return `<html><head><title>mouse touch</title>
<style>
#up,#up2,#down,#down2{
border:4px solid black;
padding:10px;
-webkit-user-select:none;
-moz-user-select:none;
-ms-user-select:none;
user-select:none;	
background:none;
-webkit-appearance:none;
-moz-appearance:none;
appearance:none;
}
#up::selection,#up2::selection,#down::selection,#down2::selection{background:none;}
</style>
</head>
<body>
<h4>mouse down / up</h4>
<span id="up">up</span>
<output id="out"></output>
<span id="down">down</span>

<h4>touch enter / leave</h4>
<span id="up2">up</span>
<output id="out2"></output>
<span id="down2">down</span>
<h4>type</h4>
<div id="out4"></div>
</body>
<script>
var m;var int=0;var out4=gid('out4'),out2=gid('out2'),out=gid('out'),up=gid('up'),up2=gid('up2'),down=gid('down'),down2=gid('down2');
var s_timer=100;
up.addEventListener('mousedown',function(){
out4.textContent=ev.type;
m=true;
evi_plus();	
},false)
up.addEventListener('mouseup',function(){
out4.textContent=ev.type;
m=false;	
},false);

function evi_plus(){
if(m){
out.textContent=int;
out2.textContent=int;
setTimeout("evi_plus()",s_timer);
int++;
}else{return false;}
}


function evi_minus(){
if(m){
out.textContent=int;
out2.textContent=int;
setTimeout("evi_minus()",s_timer);
int--;
}else{return false;}
}


down.addEventListener('mousedown',function(){
out4.textContent=ev.type;
m=true;
evi_minus();	
},false)
down.addEventListener('mouseup',function(){
out4.textContent=ev.type;
m=false;	
},false)

/* touch test */
up2.addEventListener('touchstart', function(ev){
out4.textContent=ev.type;
m=true;
evi_plus();	
},false)
up2.addEventListener('touchend', function(ev){
out4.textContent=ev.type;
m=false;	
},false);

down2.addEventListener('touchstart', function(ev){
out4.textContent=ev.type;
m=true;
evi_plus();	
},false)
down2.addEventListener('touchend', function(ev){
out4.textContent=ev.type;
m=false;	
},false);

function gid(id){return document.getElementById(id);}
</script>
</html>`;
}
module.exports={test_mouse}
