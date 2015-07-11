---
---
function initLinks() {
	$('div.post a:not(a[href*="blog.cincura.net"])').attr('target', '_blank');
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
	initImageBox();
	initSearch();
});