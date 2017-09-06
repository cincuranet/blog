var blog = (function() {
	function initLinks() {
		$('a').each(function(i, e) {
			e = $(e);
			var href = e[0].href;
			if (!isLocalLink(href)) {
				e.attr('target', '_blank');
			}
			else if (isLocalImageLink(href)) {
				e.attr('target', '_blank');
				e.click(function() {
					ga('send', 'event', 'I-Link', 'click', href); 	
				});
			}
		});
		
		$('a[rel~="bookmark"]').click(function(e) {
			e.preventDefault();			
		});
	}

	function initImageTitles() {
		$('article img[alt]').attr('title', function() { return $(this).attr('alt'); });
	}

	function initImageBox() {
		$.fancybox.defaults.loop = false;
		var items = $('article a:has(img)');
		items.each(function(i, e) {
			e = $(e);
			e.attr('data-img-gallery', '');
			e.attr('data-fancybox', 'gallery');
			e.attr('title', e.find('img').attr('title'));
		});
	}

	function showArticleNicely() {
		if (isLocalLink(document.referrer)) {
			$(document).scrollTop($('article').offset().top);
		}
	}

	function initFullDisqus() {
		disqus_config = function() {
			this.page.url = disqus_url;
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
		},
		initContentPage: function() {
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
}