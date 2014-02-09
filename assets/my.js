---
---
function initLinks() {
	$('div.post a:not(a[href*="blog.cincura.net"])').attr('target', '_blank');
}

function initImageBox() {
	$('div.post a[href*="i.blog.cincura.net"]:has(img)').fancybox({
		openEffect: 'fade',
		closeEffect: 'fade',
		nextEffect: 'fade',
		prevEffect: 'fade'   
	});
}

function initCollapsable() {
	$('.collapsable .collapsable-header').each(function(i,e){
		e = $(e);
		e.click(function(){
			e.parent().children('.collapsable-item').slideToggle();
		});
		e.css('cursor', 'pointer');
	});
	$('.collapsable .collapsable-item').hide();
}

function initSearch() {
	$('#search').keypress(function(e){
		if (e.which == 13) {
			e.preventDefault();
			window.open('https://www.google.com/search?q='+$(e.target).val()+' site:'+'{{ site.url }}'.replace(/^https?:\/\//,''));
		}
	});
}

function initSyntaxHighlighting() {
	SyntaxHighlighter.defaults['tab-size'] = 2;
	SyntaxHighlighter.defaults['class-name'] = 'x2src';
	SyntaxHighlighter.autoloader(
		['applescript'										,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushAppleScript.js'],
		['actionscript3','as3'						,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushAS3.js'],
		['bash','shell'										,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushBash.js'],
		['coldfusion','cf'								,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushColdFusion.js'],
		['cpp','c'												,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushCpp.js'],
		['c#','c-sharp','csharp'					,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushCSharp.js'],
		['css'														,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushCss.js'],
		['delphi','pascal'								,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushDelphi.js'],
		['diff','patch','pas'							,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushDiff.js'],
		['erl','erlang'										,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushErlang.js'],
		['groovy'													,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushGroovy.js'],
		['java'														,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushJava.js'],
		['jfx','javafx'										,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushJavaFX.js'],
		['js','jscript','javascript'			,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushJScript.js'],
		['perl','pl'											,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushPerl.js'],
		['php'														,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushPhp.js'],
		['text','plain'										,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushPlain.js'],
		['py','python'										,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushPython.js'],
		['ruby','rails','ror','rb'				,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushRuby.js'],
		['sass','scss'										,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushSass.js'],
		['scala'													,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushScala.js'],
		['sql'														,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushSql.js'],
		['vb','vbnet'											,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushVb.js'],
		['xml','xhtml','xslt','html'			,'http://cdn.jsdelivr.net/syntaxhighlighter/3.0.83/scripts/shBrushXml.js']
	);
	SyntaxHighlighter.all();
}

// ============================================================================

$(document).ready(function() {
	initLinks();
	initImageBox();
	initCollapsable();
	initSearch();
	initSyntaxHighlighting();
});
