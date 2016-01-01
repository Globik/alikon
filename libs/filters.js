var esc2_html = n => n.replace(/</g,"&lt;").replace(/>/g,"&gt;");
var esc_atrs=s=> s.replace(/(\w+)="(.*?)"/g,`<span class=brown>$1</span>=<span class=green>"$2"</span>`);
var html_pretty = ns => {return ns.replace(/&lt;(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^(&gt;)\s]+))?)*)\s*(\/?)&gt;/g,
(s,p1,p2,p3,ofs) =>{
return `<span class=orange>&lt;</span>
<span class=blue>${p1}</span>${esc_atrs(p2)}<span class=violet>${p3}</span><span class=orange>></span>`;})
.replace(/((&lt;)\/(\w+)(&gt;))/g,`<span class="orange">$2</span>
<span class=violet>/</span><span class=blue>$3</span>
<span class=orange>$4</span>`).replace(/\b(disabled)\b/g,`<span class=red>$1</span>`).replace(/(&lt;\!--[\S\s]*?--&gt;)/g,`<span class=green>$1</span>`).replace(/\n/g,'');
}
var esc_html= n => n.replace(/([\'])/g,`&apos;`)
.replace(/([\"])/g,`&quot;`)
.replace(/(<(.*?)>)/g,(str,p1,p2,ofs,s)=> `&lt;${p2}&gt`);
var js_pretty= tex =>{
return tex.
replace(/\b(function|var|if|in|of|return)\b/g,`<span class='blue'>$1</span>`)
.replace(/\b(i|k|l|m)\b/g,`<span class='one-fit'>$1</span>`)
.replace(/("[^"]*")/g,`<span class='dbqw'>$1</span>`)
.replace(/(\d+|\.\d+|\d+\.\d*)/g,`<span class='zifra'>$1</span>`)
.replace(/(\/\/.*|\/\*[^]*?\*\/)/g,`<span class='comments'>$1</span>`)
.replace(/(\{|\}|\]|\[|\|)/g,`<span class='figskobki'>$1</span>`)
.replace(/(new)\s+(.*)(?=\()/g,`<span class='constructor'><b>$1</b> $2</span>`)
.replace(/\.(push|length|getElementById|getElementsByClassName|innerHTML|textContent|querySelector)/g,
`<span class='attribute'>.$1</span>`)
.replace(/(&apos;[\s\S]*?&apos;)/g,`<span class="kavichki">$1</span>`)
.replace(/(&quot;[^"]*?&quot;)/g,`<span class="dbquot">$1</span>`)
}
var css_pretty= n =>
 n.replace(/(\/\*[\s\S]*?\*\/)/gm,`<span class="orange">$1</span>`)
.replace(/(\.[\w\-_]+)/g,`<span class="yellow">$1</span>`)
.replace(/(\#[\w\-_]+)/g,`<span class="blue">$1</span>`)
.replace(/\b(pre|textarea)\b/g,`<span class="green">$1</span>`)
.replace(/(\{|\}|\]|\[|\|)/g,`<span class='figskobki'>$1</span>`)
.replace(/(:[\w\-_]+)/g,`<span class="brown">$1</span>`)
.replace(/(\d+|\.\d+|\d+\.\d*)/g,`<span class='blue'>$1</span>`);
var advec=me =>{
	'use strict';
	const shortcodename="$REKLAMA";
	var qu=me.includes(shortcodename);
	if(qu){
	let reg=new RegExp(`\\${shortcodename}`,`g`);
var ba=me.replace(reg,`Some box:<sector class='reklamabox' itemscope itemtype="http://schema.org/WPAdBlock">
<meta itemprop="name" content="Adsense for pagetitle"/>
<meta itemprop="name" content="Support Atariku by using Adsense and other advertisments."/>
<div class="reklamabox">My AD block.</div></sector>`);	
return ba;
	}
}
var aprec=se => { 'use strict';
	let shortcodename='$REKLAMA';
	let reg=new RegExp(`\\${shortcodename}`,`g`);
var ba=se.replace(reg,`Some box:<sector role='note' class='reklamabox' itemscope itemtype="http://schema.org/WPAdBlock">
<meta itemprop="name" content="Adsense for pagetitle"/>
<meta itemprop="name" content="Support Atariku by using Adsense and other advertisments."/>
<div class="reklamabox">My AD block.</div></sector>`);
var ab=ba.replace(/<pre class="(.*?)">([\s\S]*?)<\/pre>/g,(str,p1,p2,ofs,s) => {
if(p1=="pre-code-js"){return `<pre class="pre-code-js">${js_pretty(esc_html(p2))}</pre>`;}
else if(p1=="pre-code-css"){return `<pre class="pre-code-css">${css_pretty(p2)}</pre>`}
else if(p1=="pre-code-html"){return `<pre class="pre-code-html">${html_pretty(esc2_html(p2))}</pre>`}
else{return "";}
});
return ab;
}

module.exports={esc2_html,html_pretty,esc_html,js_pretty,css_pretty,aprec,advec};