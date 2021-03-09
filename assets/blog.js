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
		});

		$('a[rel~="bookmark"]').click(function(event) {
			event.preventDefault();
		});
	}

	function initImageTitles() {
		$('article img[alt]').attr('title', function() { return $(this).attr('alt'); });
	}

	function initImageBox() {
		var items = $('article a:has(img)');
		items.each(function(_, e) {
			e = $(e);
			var link = e.attr('href');
			if (getLinkFileExtensions(link).match(/(jpg|jpeg|gif|png|svg)/)) {
				e.attr('data-img-gallery', '');
				e.attr('data-fancybox', 'gallery');
				e.attr('title', e.find('img').attr('title'));
			}
		});
	}

	function initExpand() {
		$('[data-expand]').each(function(_, e) {
			e = $(e);
			var target = e.data('expand');
			e.click(function(event) {
				event.preventDefault();
				$('#' + target).toggle();
			});
			e.click();
		});
	}

	function showArticleNicely() {
		if (isLocalLink(document.referrer)) {
			$(document).scrollTop($('article').offset().top);
		}
	}

	function isLocalLink(link) {
		return link.indexOf(window.location.host) != -1;
	}

	function getLinkFileExtensions(link) {
		var part = link.split(/(\?|#)/)[0];
		var split = part.split('.');
		return split.length != 1
			? split[split.length - 1]
			: '';
	}

	return {
		initGeneral: function() {
			initLinks();
			initImageTitles();
			initImageBox();
		},
		initContentPage: function() {
			initExpand();
		},
		initPostPage: function() {
			showArticleNicely();
		}
	};
})();

blog.initGeneral();
if (typeof is_post !== 'undefined' && is_post) {
	blog.initPostPage();
}
else {
	blog.initContentPage();
}
