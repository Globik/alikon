var idpay1=gid('idpay1'),bparol=gid('bparol'),redIn=gid('redIn'),redIn2=gid('redIn2'),rddmount=gid('rddmount');
function show_parol(el){
bparol.type="text";
el.textContent=="show"?el.textContent="hide":el.textContent="show";
el.textContent!=="show"?bparol.type="text":bparol.type="password";
}
var g_psys_enabler=null;
var g_actual_rc;
/*
function bp_enabler(el){
try{
var f=el.value=="true"?true:false;
el.value=f?"false":"true";
idpay1.enabled.value=f?"false":"true";
el.textContent=f?"enable":"disable";
idpay1.submit.disabled=false;
}catch(e){alert(e);}}

function bp_ptype(el){
el.textContent=el.textContent=="single"?"hot":"single";
idpay1.ptype.value=idpay1.ptype.value=="single"?"hot":"single";
idpay1.submit.disabled=false;
//el.parentElement.parentElement.submit.disabled=false;
}
*/
var mura2=cr_event('savePayConfig');
idpay1.addEventListener('submit',send_pay_config,false);

function send_pay_config(ev){
	ev.preventDefault();
	/*
var d;
try{
d=new FormData(ev.target);
}catch(e){alert('FormData is not supported? '+e);}
if(!d)return;
vax(ev.target.method,ev.target.action,d,obusi,erl,true);//true means formdata, not an json set request header
*/
	//try{
	//alert(ev.target.benbl.value+' '+ev.target.paytype.value+' '+ev.target.name.value);
	//}catch(e){alert(e);}
//ev.preventDefault();
if(mura2){shell(ev,"What do you want? To save it?", mura2);}
}
function go_save_config(ev){
var d;
try{
d=new FormData(ev.target);
}catch(e){alert('FormData is not supported? '+e);}
if(!d)return;
vax(ev.target.method,ev.target.action,d,obusi,erl,true);//true means formdata, not an json set request header

//alert(ev.target.benbl.value+' '+ev.target.paytype.value+' '+ev.target.name.value);	
	//alert(ev.target)
}
//try{
var sura=cr_event('suzuki');//new Event('suzuki');
//}catch(e){alert("Custom event not supported in this browser.");}

function obusi(f){
if(!f.info && !f.info.enabled){return;}
console.warn('saved');
shell(false,"Saved! Wish you reload this payment system??","sayPizda")

g_psys_enabler=f.info.enabled=="true"?"YES!":f.info.enabled=="false"?"NO!":g_psys_enabler;
}

function pizda(n){
//alert('pizda:'+n)
if(n=="sayPizda"){reload_pay_sys();}
}

gid('newfucker').onclick=function(e){
if(sura){shell(e,"Wish you reload this payment system?",sura);}else{
alert("Custom event api is not supported in this browser");
}
}
if(sura){gid('newfucker').addEventListener('suzuki',reload_pay_sys,false);}
if(mura2){idpay1.addEventListener('savePayConfig',go_save_config,false)
								  }
//function dura(){alert('a?')}
var strty="pay_sys_reload";

function reload_pay_sys(){
var d={};
d.type=strty;
vax('post','/admin/uncache_what',d,omsuc,erl);
}

function omsuc(b){
console.log(miss(b))
try{
if(b.info.type==strty){
enablerMarker.textContent=g_psys_enabler;
//message_box("OK! Have been reloaded!");
galert("OK! Have been reloaded!")
}
}catch(er){message_box(er)}
}

function get_new_reedem_code(){
if(!bparol.value){message_box('fill in parol field');return;}
var d={};
d.parol=bparol.value;
vax('post','/api/create_redeem_code',d,onsuc,erl);
}


function onsuc(e){
if(!e.htmlbody){galert('no htmlbody attr found!');return;}
redIn.innerHTML=e.htmlbody;
rddmount.textContent=Number(rddmount.textContent) + 1;
}


function check_balance_rc(el){
if(!el.value){message_box('redeem code not provided.');return;}
var enc=el.getAttribute('data-enc')
var d={}
if(enc=='true'){
if(!bparol.value){message_box('fill in parol field!');return;}
d.parol=bparol.value;
}
d.rc=el.value;d.enc=enc;
//alert(d.parol+' '+d.enc+' '+d.rc);
vax('post','/admin/check_balance_rc',d,on_bal,erl);
el.parentElement.parentElement.classList.add('greeny');//tr

}

function on_bal(e){
rem('greeny');
message_box(e.b.address);
}


function rem(d){
var l=document.querySelector('.'+d);
if(l)l.classList.remove(d);
}

function make_rc_active(el){
var a=el.parentNode.parentNode;//parentElement.parentElement;
//alert(a.getAttribute('data-rdid'))
if(!a){message_box('No id found!');retrun;}
//alert(a.getAttribute('data-type'));
var ab=a.getAttribute('data-type');
if(ab && ab=="a"){
message_box("it's already acive.");return;
	}
var b=el.parentNode.nextSibling.nextSibling.nextSibling.firstChild.nextSibling.firstChild;
	//alert('car: '+car.textContent);
if(!b){message_box('No form element found! It looks like you have an old browser.');return;}
var c=b.f.value;
var rdid=a.getAttribute('data-rdid');
var cadr=el.parentElement.nextSibling.nextSibling.nextSibling.nextSibling.firstChild.nextSibling.textContent;
if(!rdid || !c){mesage_box('no id or no type of redeem provided!');return;}
if(c=='a'){
if(cadr=='no'){message_box('No cold address provided!');return;}
}
var d={};
d.rd_id=rdid;
d.rd_t=c;
d.cold_adr=cadr;
	//alert(miss(d));
vax('post','/make_rc_active',d,onl,erl);
a.classList.add('greeny');
}

function onl(e){alert(miss(e))}

function erl(e){message_box(e);rem('greeny')}

function geti(){
vax('get','/mid/Bob',null,onl,erl)
}
function save_cold(el){
var tbody=el.parentNode.parentNode;//parentElement.parentElement;
if(!tbody){message_box('no parent found');return;}
var rdid=tbody.getAttribute('data-rdid');
var cadr1=el.parentElement.nextSibling.nextSibling.nextSibling.nextSibling.firstChild.nextSibling;
if(!cadr1){message_box('no cadr1 found.');return;}
var cadr=cadr1.textContent;
//alert(rdid+' '+cadr);
if(!rdid || !cadr){message_box('no id or cold address provided!');return;}
if(cadr=='no'){message_box('no cold address provided!');return;}
var d={};
d.rd_id=rdid;
d.cold_adr=cadr;
	//alert(miss(d));
vax('post','/admin/api/saveColdAdr',d,svd_cold_adr,erl)
el.parentElement.parentElement.classList.add('greeny');
}

function svd_cold_adr(d){
rem('greeny');
if(d && d.info=='ok')galert('A new cold address is successful updated!')
}

function showMore(){
var d={};d.show=true;
vax('post','/admin/more_reedem',d,show2,erl)
}
function show2(e){
if(!e.htmlbody){message_box('no htmlbody attr found!');return;}
redIn2.innerHTML=e.htmlbody;
}

function delete_redeem(el){
var v=el.parentNode.parentNode;//parentElement.parentElement;
var id=v.getAttribute('data-rdid');
//alert(id)
var typ=v.getAttribute('data-type');
if(!id || !typ){message_box('id or type is not provided. Sorry.');return;}
if(typ=='a'){message_box("It's active. Make it passive and then you can delete it.");return;}
var d={};
d.rdid=id;
d.typ=typ;
//alert(d.rdid+' '+d.typ)
vax('post','/admin/api/delete_redeem',d,on_rd_del,erl);
v.classList.add('greeny');
/*
setTimeout(function(){
on_rd_del({del:"37"})
},4000)
*/
}
function on_rd_del(e){
if(!e.del){message_box("Attribute 'del' not found!");rem("greeny");return;}
var vel=document.querySelector('section[data-rdid="'+e.del+'"]');
if(!vel){message_box("Id "+e.del+" not found.");rem("greeny");return;}
vel.remove();
galert("OK!");
rddmount.textContent=Number(rddmount.textContent) - 1;
}