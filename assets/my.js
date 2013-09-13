function initLinks() {
	$('a:not(a[href*="blog.cincura.net"])').attr('target', '_blank');
}

function initFancyBox() {
	$('a[href*="i.blog.cincura.net"]:has(img)').fancybox({
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

// ============================================================================

$(document).ready(function() {
	initLinks();
	initFancyBox();
	initCollapsable();
});

// ----------------------------------------------------------------------------

SyntaxHighlighter.defaults['tab-size'] = 2;
SyntaxHighlighter.defaults['class-name'] = 'x2src';
SyntaxHighlighter.autoloader(
	['applescript'										,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushAppleScript.js'],
	['actionscript3','as3'						,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushAS3.js'],
	['bash','shell'										,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushBash.js'],
	['coldfusion','cf'								,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushColdFusion.js'],
	['cpp','c'												,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushCpp.js'],
	['c#','c-sharp','csharp'					,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushCSharp.js'],
	['css'														,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushCss.js'],
	['delphi','pascal'								,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushDelphi.js'],
	['diff','patch','pas'							,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushDiff.js'],
	['erl','erlang'										,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushErlang.js'],
	['groovy'													,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushGroovy.js'],
	['java'														,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushJava.js'],
	['jfx','javafx'										,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushJavaFX.js'],
	['js','jscript','javascript'			,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushJScript.js'],
	['perl','pl'											,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushPerl.js'],
	['php'														,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushPhp.js'],
	['text','plain'										,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushPlain.js'],
	['py','python'										,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushPython.js'],
	['ruby','rails','ror','rb'				,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushRuby.js'],
	['sass','scss'										,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushSass.js'],
	['scala'													,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushScala.js'],
	['sql'														,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushSql.js'],
	['vb','vbnet'											,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushVb.js'],
	['xml','xhtml','xslt','html'			,'http://alexgorbatchev.com/pub/sh/3.0.83/scripts/shBrushXml.js']
);
SyntaxHighlighter.all();

// ============================================================================
