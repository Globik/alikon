// articles_page.js 
'use strict'; 
//let rel=require('../libs/hotreload.js');
var head=require('./head.js');
var header_menu=require('./header_menu.js');
var admin_main_menu=require('./admin_main_menu.js');
var articles_block=require('./articles_block.js');
var paginator=require('./paginator.js');
var article_editor=require('./article_editor.js');
var footer=require('./footer.js'); 

var articles_page=n=>{ 
let {buser,showmodule:{mainmenu,profiler}}=n;

return `<!DOCTYPE html>
<!-- articles_page.js -->
<html lang="en">
<head>${head.head({csslink:getCssLink(),csslink2:"/css/main2.css"})}</head>
<body><nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(n.buser ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap">
<section class="daper"><h1>Articles</h1>
${articles_block.articles_block(n)}
</section> 
${(n.locals.total_pages > 1 ? `<div id="pagination">${paginator.paginator(n)}</div>`: ``)}
	${article_editor.article_editor({buser})}
</main><footer id="footer">${footer.footer({boo:"By"})}</footer></body></html><!-- end articles_page.js -->`;}
module.exports={articles_page};
function getCssLink(){return `/css/articles-paginator.css`;}

function html(s,...v){
var res='';
for(let i=0;i<v.length;i++){
res+=s[i];
res+=v[i];
}
res+=s[s.length-1];
return res.replace(/\n/g,'');
}