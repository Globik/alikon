//paginator.js
'use strict';
var paginator=n=> `
page: ${n.locals.page}<br>
pages: ${n.locals.total_pages}<br>
total: ${n.locals.total_articles}<br>
<div class="pagination-container"> ${getPaginator(n)}</div>`;
 module.exports={paginator};
   function getPaginator(n){
var s=``,page=n.locals.page;
var pag=n.locals.rang_page.get(page);
if(pag){
	
(n.locals.prev ? s+=`<a href="${psaki(n)}"><div class="num">prev</div></a>`:``)
pag.forEach(d=>{(page==d ? s+=`<div class="pactive">${d}</div>`:
s+=`<a href="${(page>=2 && d==1 ? `/articles`:`/articles/${d}`)}"><div class="num">${d}</div></a>`)
});
(n.locals.next ? s+=`<a href="/articles/${page+1}"><div class="num">next</div></a>`:``)
}
return s;} 
function psaki(n){let s=``,page=n.locals.page;if(page==2){s+="/articles";}
else{s+=`/articles/${page-1}`;}return s;}