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
			window.open('https://www.google.com/search?q='+$(e.target).val()+' site:'+'{{ site.url }}'.replace(/^https?:\/\//,''));
		}
	});
}

// ============================================================================

$(document).ready(function() {
	initLinks();
	initImageBox();
	initSearch();
});
