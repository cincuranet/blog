---
---
function initLinks() {
	$('div.post a:not(a[href*="blog.cincura.net"])').attr('target', '_blank');
}

function initLineNumbers() {
	$('div.highlight pre code').each(function(i, e) {
		e = $(e);
		var lines = e.html().split(/\n/);
		var length = lines.length;
		var spans = '';
		for (var i = 0; i < length; i++) {
			if ((i == 0 || i == length - 1) && lines[i] == '')
				continue;
			spans += '<span>' + (i + 1) + '</span>';
		}
		e.prepend('<span class="line-numbers">' + spans + '</span>');
	});
}

function initImageBox() {
	$('div.post a[href*="blog.cincura.net/i/"]:has(img)').attr('rel', 'gallery').fancybox({
		openEffect: 'fade',
		closeEffect: 'fade',
		nextEffect: 'fade',
		prevEffect: 'fade'
	});
}

function initSearch() {
	$('#search').keypress(function(e){
		if (e.which == 13) {
			e.preventDefault();
			var query = $(e.target).val();
			var site = '{{ site.url }}';
			window.open('https://www.google.com/search?q=' + query + ' site:' + site.replace(/^https?:\/\//,''));
		}
	});
}

// ============================================================================

$(document).ready(function() {
	initLinks();
	initLineNumbers();
	initImageBox();
	initSearch();
});