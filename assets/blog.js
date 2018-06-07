var blog = (function() {
	function initLinks() {
		$('a').each(function(_, e) {
			e = $(e);
			var href = e[0].href;
			if (!isLocalLink(href)) {
				e.attr('target', '_blank');
				e.attr('rel', function(_, v) {
					return v !== undefined
						? v + ' ' + 'noopener'
						: 'noopener';
			  });
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
		var items = $('article a:has(img)');
		items.each(function(_, e) {
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
		}
	};
})();

var disqus_config = function() {
	this.page.url = '';
};

blog.initGeneral();
if (!(typeof is_404 !== 'undefined' && is_404)) {
	if (/^\/\d+-.+$/.test(window.location.pathname)) {
		blog.initPostPage();
	}
	else {
		blog.initContentPage();
	}
}