---
---
let blog = (function() {
	function initLinks() {
		for (const e of document.querySelectorAll('a')) {
			let href = e.href;
			if (isLocalLink(href))
				continue;
			e.setAttribute('target', '_blank');
			let rel = e.getAttribute('rel');
			rel = rel !== null
				? rel + ' ' + 'noopener'
				: 'noopener'
			e.setAttribute('rel', rel);
		}

		for (const e of document.querySelectorAll('article a')) {
			let href = e.href;
			if (isLocalLink(href))
				continue;
			e.insertAdjacentHTML('beforeend', '<span class="fa-solid fa-arrow-up-right-from-square external-link-icon" aria-hidden="true"></span>');
		}

		for (const e of document.querySelectorAll('a[rel~="bookmark"]')) {
			let href = e.href;
			e.addEventListener('click', async event => {
				event.preventDefault();
				event.stopPropagation();
				await navigator.clipboard.writeText(href);
			});
		}

		for (const e of document.querySelectorAll('h3[data-title]')) {
			let text = e.innerText.trim();
			e.addEventListener('click', async event => {
				event.preventDefault();
				event.stopPropagation();
				await navigator.clipboard.writeText(text);
			});
		}
	}

	function initImageTitles() {
		for (const e of document.querySelectorAll('article img[alt]')) {
			let alt = e.getAttribute('alt');
			e.setAttribute('title', alt);
		}
	}

	function initImageBox() {
		let cssSimpleBox = document.createElement('link');
		cssSimpleBox.rel = 'stylesheet';
		cssSimpleBox.href = '/assets/lightbox/lightbox.v__{{ blog.file_hash "/assets/lightbox/lightbox.css" }}.css';
		cssSimpleBox.media = 'screen';
		document.head.appendChild(cssSimpleBox);

		let items = new Array();
		for (const e of document.querySelectorAll('article a')) {
			let img = e.querySelector('img');
			if (img === null)
				continue;
			let href = e.href;
			if (getLinkFileExtensions(href).match(/(jpg|jpeg|gif|png|svg)/) === null)
				continue;
			let title = img.getAttribute('title');
			e.setAttribute('title', title);
			e.setAttribute('data-gallery', '');
			items.push(e);
		}
		new SimpleLightbox({elements: items});
	}

	function initExpand() {
		for (const e of document.querySelectorAll('[data-expand]')) {
			let target = document.querySelector('#' + e.getAttribute('data-expand'));
			e.addEventListener('click', event => {
				event.preventDefault();
				event.stopPropagation();
				if (target.style.display === 'none') {
					target.style.display = '';
				}
				else {
					target.style.display = 'none';
				}
			});
			e.click();
		}
	}

	function showArticleNicely() {
		if (document.referrer !== '' && isLocalLink(document.referrer)) {
			let article = document.querySelector('article');
			article.scrollIntoView();
		}
	}

	function isLocalLink(link) {
		try {
			const url = new URL(link, window.location.href);
			return url.origin === window.location.origin;
		}
		catch {
			return false;
		}
	}

	function getLinkFileExtensions(link) {
		let part = link.split(/(\?|#)/)[0];
		let split = part.split('.');
		return split.length !== 1
			? split[split.length - 1]
			: '';
	}

	return {
		init: (isPost) => {
			initLinks();
			initImageTitles();
			initImageBox();
			if (isPost) {
				showArticleNicely();
			}
			else {
				initExpand();
			}
		}
	};
})();

let isPost = typeof blog_isPost !== 'undefined' && blog_isPost;
blog.init(isPost);
