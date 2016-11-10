---
---
var blog = (function() {
	function initLinks() {
		// should I do only 'article' links?
		$('a').each(function(i, e) {
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

	function initImageBox() {
		var items = $('article a:has(img)');
		items.each(function(i, e) {
			e = $(e);
			e.attr('rel', 'gallery');
			e.attr('title', e.find('img').attr('title'));
		});
		items.fancybox({
			openEffect: 'fade',
			closeEffect: 'fade',
			nextEffect: 'fade',
			prevEffect: 'fade'
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

	function initTagsFilter() {
		var tags = $('#archive_tags select');
		var posts = $('#archive_posts span');
		tags.change(function() {
			var selected = tags.val();
			posts.each(function(i, e) {
				e = $(e);
				if (e.data('tags').indexOf(selected) != -1 || !selected) {
					e.show();
				}
				else {
					e.hide();
				}
			});
		});
	}

	function showArticleNicely() {
		if (isLocalLink(document.referrer)) {
			$(document).scrollTop($('article').offset().top);
		}
	}

	function initFullDisqus() {
		disqus_config = function() {
			this.page.url = 'http:{{ site.address }}' + post_url;
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
		return link.indexOf(window.location.host) != -1;
	}

	function isLocalImageLink(link) {
		return isLocalLink(link) && link.indexOf('/i/') != -1;
	}

	return {
		initGeneral: function() {
			initLinks();
			initImageTitles();
			initImageBox();
			initGA();
		},
		initContentPage: function() {
		},
		initArchivePage: function() {
			initTagsFilter();
		},
		initPostPage: function() {
			showArticleNicely();
			initFullDisqus();
		},
		initPostsListPage: function() {
			initDisqusCounts();
		}
	};
})();

var disqus_config = function() {
	this.page.url = '';
};

blog.initGeneral();
if (/^\/\d+-.+\/$/.test(window.location.pathname)) {
	blog.initPostPage();
}
else {
	blog.initContentPage();
	if (/^\/$/.test(window.location.pathname))
		blog.initPostsListPage();
	else if (/^\/archive\/$/i.test(window.location.pathname))
		blog.initArchivePage();
}