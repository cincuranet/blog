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

	function showArticleNicely() {
		if (/blog\.cincura\.net/.test(document.referrer)) {
			$(document).scrollTop($('article').offset().top);
		}
	}

	function initFullDisqus(postUrl) {
		disqus_shortname = '{{ site.disqus_shortname }}';
		disqus_url = '{{ site.disqus_base_url }}' + postUrl;

		var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
		dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
		(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
	}

	function initDisqusCounts() {
		disqus_shortname = '{{ site.disqus_shortname }}';

		var s = document.createElement('script'); s.async = true;
		s.type = 'text/javascript';
		s.src = '//' + disqus_shortname + '.disqus.com/count.js';
		(document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
	}

	return {
		initGeneral: function() {
			initLinks();
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

var disqus_shortname;
var disqus_url;