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
	SyntaxHighlighter.defaults['toolbar'] = false;
	SyntaxHighlighter.autoloader(
		['applescript'										,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushAppleScript.js'],
		['actionscript3','as3'						,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushAS3.js'],
		['bash','shell'										,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushBash.js'],
		['coldfusion','cf'								,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushColdFusion.js'],
		['cpp','c'												,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushCpp.js'],
		['c#','c-sharp','csharp'					,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushCSharp.js'],
		['css'														,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushCss.js'],
		['delphi','pascal'								,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushDelphi.js'],
		['diff','patch','pas'							,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushDiff.js'],
		['erl','erlang'										,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushErlang.js'],
		['groovy'													,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushGroovy.js'],
		['java'														,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushJava.js'],
		['jfx','javafx'										,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushJavaFX.js'],
		['js','jscript','javascript'			,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushJScript.js'],
		['perl','pl'											,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushPerl.js'],
		['php'														,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushPhp.js'],
		['text','plain'										,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushPlain.js'],
		['py','python'										,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushPython.js'],
		['ruby','rails','ror','rb'				,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushRuby.js'],
		['sass','scss'										,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushSass.js'],
		['scala'													,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushScala.js'],
		['sql'														,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushSql.js'],
		['vb','vbnet'											,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushVb.js'],
		['xml','xhtml','xslt','html'			,'{{ site.url }}/assets/syntaxhighlighter/scripts/shBrushXml.js']
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
