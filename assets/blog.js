---
---
var blog = (function() {
	function initLinks() {
		// should I do all links?
		$('article a, a').each(function(i, e) {
			e = $(e);
			if (!isLocalLink(e[0].href)) {
				e.attr('target', '_blank');
			}
			else if (isLocalImageLink(e[0].href)) {
				e.attr('target', '_blank');
			}
		});
	}

	function initImageTitles() {
		$('article img[alt]').attr('title', function() { return $(this).attr('alt'); });
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
		$('article a:has(img)').each(function(i, e) {
			e = $(e);
			e.attr('rel', 'gallery');
			e.fancybox({
				openEffect: 'fade',
				closeEffect: 'fade',
				nextEffect: 'fade',
				prevEffect: 'fade'
			});
		});
	}

	function initSearch() {
		$('#search').keypress(function(e) {
			if (e.which == 13) {
				e.preventDefault();
				var query = $(e.target).val();
				var site = '{{ site.address }}'.replace(/^\/\//, '');
				window.open('https://www.google.com/search?q=' + query + ' site:' + site);
			}
		});
	}

	function initGA() {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-113043-8', 'cincura.net');
		ga('send', 'pageview');
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

		$('.collapsable .collapsable-header').each(function(i, e) {
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

	function showArticleNicely() {
		if (isLocalLink(document.referrer)) {
			$(document).scrollTop($('article').offset().top);
		}
	}

	function initFullDisqus(postUrl) {
		disqus_config = function () {
			this.page.url = 'http:{{ site.address }}' + postUrl;
		};

		var d = document, s = d.createElement('script');
		s.src = '//blogcincuranet.disqus.com/embed.js';
		s.setAttribute('data-timestamp', +new Date());
		(d.head || d.body).appendChild(s);
	}

	function initDisqusCounts() {
		$('body').append('<script id="dsq-count-scr" src="//blogcincuranet.disqus.com/count.js" async></script>');
	}

	function isLocalLink(link) {
		return link.indexOf('{{ site.address }}') != -1;
	}

	function isLocalImageLink(link) {
		return isLocalLink(link) && link.indexOf('/i/') != -1;
	}

	return {
		initGeneral: function() {
			initLinks();
			initImageTitles();
			initLineNumbers();
			initImageBox();
			initSearch();
			initGA();
		},
		initTagsPage: function() {
			tagsFolding();
		},
		initPostPage: function(postUrl) {
			showArticleNicely();
			initFullDisqus(postUrl);
		},
		initPostsListPage: function() {
			initDisqusCounts();
		}
	};
})();

var disqus_config = function () {
	this.page.url = '';
};