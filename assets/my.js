$(document).ready(function() {
	initLinks();
	initFancyBox();
	initCollapsable();
});
 
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