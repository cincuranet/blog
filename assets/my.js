---
---
var blog = (function() {
	function initLinks() {
		$('article a:not(a[href*="blog.cincura.net"])').attr('target', '_blank');
	}
	
	function initLineNumbers() {
		$('div.highlight pre code').each(function(i, e) {
			e = $(e);
			var lines = e.html().split(/\n/);
			var length = lines.length;
			var newLines = [];
			for (var i = 0; i < length; i++) {
				if ((i == 0 || i == length - 1) && lines[i] == '')
					continue;
				newLines.push('<span class="line-number">' + (newLines.length + 1) + '</span>' + lines[i]);
			}
			e.html(newLines.join('\n'));
		});
	}
	
	function initImageBox() {
		$('article a[href*="blog.cincura.net/i/"]:has(img)').attr('rel', 'gallery').fancybox({
			openEffect: 'fade',
			closeEffect: 'fade',
			nextEffect: 'fade',
			prevEffect: 'fade'
		});
	}
	
	function initSearch() {
		$('#search').keypress(function(e) {
			if (e.which == 13) {
				e.preventDefault();
				var query = $(e.target).val();
				var site = '{{ site.url }}';
				window.open('https://www.google.com/search?q=' + query + ' site:' + site.replace(/^https?:\/\//,''));
			}
		});
	}

	function tagsFolding() {
		$('.collapsable .collapsable-item').hide();
	
		var items = $('.collapsable[data-sort-key]');
		var anchor = items.first().parent();
		items = items.sort(function(x, y) {
			var xData = $(x).data('sort-key');
			var yData = $(y).data('sort-key');
			return xData.localeCompare(yData);
		});
		items.each(function(i, e) {
			e = $(e);
			anchor.append(e);
		});
	
		$('.collapsable .collapsable-header').each(function(i,e) {
			e = $(e);
			e.click(function() {
				e.parent().children('.collapsable-item').slideToggle();
			});
		});
	
		var hash = window.location.hash.substring(1);
		if (hash) {
			$('a[name="' + hash + '"]').parent().click();
		}
	}	
	
	return {
		initGeneral: function() {
			initLinks();
			initLineNumbers();
			initImageBox();
			initSearch();
		},
		initTagsPage: function() {
			tagsFolding();
		},
		initPostPage: function() {
		}	
	};
})();