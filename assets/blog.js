---
---
const blog = (function() {
	function initLinks() {
		for (const e of document.querySelectorAll('a')) {
			const href = e.href;
			if (isLocalLink(href))
				continue;
			e.setAttribute('target', '_blank');
			e.relList.add('noopener');
		}

		for (const e of document.querySelectorAll('article a')) {
			const href = e.href;
			if (isLocalLink(href))
				continue;
			e.insertAdjacentHTML('beforeend', '<span class="fa-solid fa-arrow-up-right-from-square external-link-icon" aria-hidden="true"></span>');
		}

		for (const e of document.querySelectorAll('a[rel~="bookmark"]')) {
			const href = e.href;
			e.addEventListener('click', async event => {
				event.preventDefault();
				event.stopPropagation();
				await navigator.clipboard.writeText(href);
			});
		}

		for (const e of document.querySelectorAll('h3[data-title]')) {
			const text = e.innerText.trim();
			e.addEventListener('click', async event => {
				event.preventDefault();
				event.stopPropagation();
				await navigator.clipboard.writeText(text);
			});
		}
	}

	function initImageTitles() {
		for (const e of document.querySelectorAll('article img[alt]')) {
			const alt = e.getAttribute('alt');
			e.setAttribute('title', alt);
		}
	}

	function initImageBox() {
		const items = [];
		for (const e of document.querySelectorAll('article a')) {
			const img = e.querySelector('img');
			if (img === null)
				continue;
			const href = e.href;
			if (getLinkFileExtensions(href).match(/(jpg|jpeg|gif|png|svg)/) === null)
				continue;
			const title = img.getAttribute('title');
			e.setAttribute('title', title);
			e.setAttribute('data-gallery', '');
			items.push(e);
		}

		if (items.length > 0) {
			const cssSimpleBox = document.createElement('link');
			cssSimpleBox.rel = 'stylesheet';
			cssSimpleBox.href = '/assets/lightbox/lightbox.v__{{ blog.file_hash "/assets/lightbox/lightbox.css" }}.css';
			cssSimpleBox.media = 'screen';
			document.head.appendChild(cssSimpleBox);
	
			const scriptSimpleBox = document.createElement('script');
			scriptSimpleBox.src = '/assets/lightbox/lightbox.v__{{ blog.file_hash "/assets/lightbox/lightbox.js" }}.js';
			scriptSimpleBox.onload = () => {
				new SimpleLightbox({ elements: items });
			};
			document.head.appendChild(scriptSimpleBox);
		}
	}

	function initExpand() {
		for (const e of document.querySelectorAll('[data-expand]')) {
			const target = document.querySelector('#' + e.getAttribute('data-expand'));
			e.setAttribute('aria-controls', target.id);
			e.setAttribute('aria-expanded', !target.classList.contains('hidden'));
			e.addEventListener('click', event => {
				event.preventDefault();
				event.stopPropagation();
				const hidden = target.classList.toggle("hidden");
				e.setAttribute('aria-expanded', !hidden);
			});
		}
	}

	function showArticleNicely() {
		if (document.referrer !== '' && isLocalLink(document.referrer)) {
			const article = document.querySelector('article');
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
		const part = link.split(/(\?|#)/)[0];
		const split = part.split('.');
		return split.length !== 1
			? split[split.length - 1]
			: '';
	}

	return {
		init: isPost => {
			initLinks();
			initImageTitles();
			if (isPost) {
				showArticleNicely();
			}
			else {
				initExpand();
			}
			initImageBox();
		},
		fetchData: async url => {
			try {
				const response = await fetch(url);
				if (!response.ok)
					return null;
				return await response.json();
			}
			catch {
				return null;
			}
		}
	};
})();

/* --- */

window.FontAwesomeConfig = {
  keepOriginalSource: false
};
{{ include "/assets/fa/js/all.min.js" }}
