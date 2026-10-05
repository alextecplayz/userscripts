// ==UserScript==
// @name        Improve YT performance
// @namespace   Violentmonkey Scripts
// @version     1.0.0
// @match       *://www.youtube.com/*
// @grant       none
// @run-at		document-start
// @author      AlexTECPlayz
// @description	Improve YT performance by zapping away lots of HTML and disabling their JS events, so only the player and captions work.
// ==/UserScript==
(() => {
	'use strict';
	const targets = [
		// elements and IDs that get checked by the script
		'yt-tooltip', 'yt-page-navigation-progress', '#watch7-content', 'iron-iconset-svg', 'yt-ephemeral-actions', '#video-preview', 'snackbar-container', 'yt-guide-manager', '#frosted-glass', '#masthead-container', '#persistent-panel-container', 'tp-yt-app-drawer', 'ytd-mini-guide-renderer', '#microformat', '#cinematics-full-bleed-container', '#engagement-panel-scrim', '#survey', '#fixed-side-menu', '#single-column-container', '#secondary', '#below', '#cinematics-container', 'yt-playability-error-supported-renderers', '#thumbnail', 'ytd-permission-role-bottom-bar-renderer', 'ytd-third-party-manager',  'yt-playlist-manager', 'ytd-miniplayer', 'iron-media-query', '.player-container-background', '#panels-full-bleed-container', '.ytp-chrome-top', '.ytp-gradient-top', '.ytp-miniplayer-ui', '.html5-endscreen', '.ytp-gradient-bottom', '.ytp-fullscreen-grid', '#watch-page-skeleton', '.ytp-share-panel', '.ytp-playlist-menu', 'ytd-popup-container', 'yt-mdx-manager'
	];

	const eventTypes = [
		// events that get checked for said targets
		'click', 'dblclick', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'pointermove', 'touchstart', 'touchend', 'keydown', 'keyup', 'submit', 'input', 'change', 'focus', 'blur'
	]

	const tagNames = new Set(targets.filter(item => !item.startsWith('#') && !item.startsWith('.')).map(item => item.toLowerCase()));
	const ids = new Set(targets.filter(item => item.startsWith('#')).map(item => item.slice(1)));
	const classNames = new Set(targets.filter(item => item.startsWith('.')).map(item => item.slice(1)));

	function isTarget(element) {
		if (!(element instanceof Element)) {return false;}
		const hasTargetClass = [...classNames].some(className => element.classList.contains(className));
		return (tagNames.has(element.localName.toLowerCase()) || ids.has(element.id) || hasTargetClass);
	}

	function disableEvents(element) {
		element.style.setProperty('pointer-events', 'none', 'important');
		element.setAttribute('inert', '');
		for (const type of eventTypes) {
			element.addEventListener(type, event => {event.preventDefault(); event.stopImmediatePropagation();}, {capture: true, once: true,});
		}
	}

	function removeElement(element) {
		if (!element.isConnected) {return;}
		//disableEvents(element);
		element.remove();
	}

	function processNode(node) {
		if (!(node instanceof Element)) {return;}
		if (isTarget(node)) {removeElement(node); return;}
		const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
		const matches = [];
	}

	function cssEscape(value) {return CSS.escape(value);}

	function buildHideCSS() {
		// hides matched via CSS before the JS kicks in, so there's hopefully no visible change when the page loads
		const selectors = [];
		for (const target of targets) {
			if (target.startsWith('#')) { selectors.push(`[id="${cssEscape(target.slice(1))}"]`);
			} else if (target.startsWith('.')) { selectors.push(`.${CSS.escape(target.slice(1))}`);
			} else {selectors.push(target);}
		}
		return `${selectors.join(', ')} {display: none !important; visibility: hidden !important;}`;
	}

	function injectEarlyCSS() {
		const style = document.createElement('style');
		style.id = 'userscript-early-element-hider';
		style.textContent = buildHideCSS();
		if (document.documentElement) {document.documentElement.appendChild(style);} else {
			const observer = new MutationObserver(() => {
				if (document.documentElement) {document.documentElement.appendChild(style); observer.disconnect();}
			});
			observer.observe(document, {childList: true, subtree: true});
		}
	}

	function scan(root = document) {
		if (root === document) {for (const element of Array.from(document.documentElement?.children || [])) {processNode(element);}
		} else {processNode(root);}
	}

	function startObserver() {
		const observer = new MutationObserver(mutations => {
			for (const mutation of mutations) {for (const addedNode of mutation.addedNodes) {processNode(addedNode);}}
		});
		observer.observe(document, {childList: true, subtree: true,});
		scan();
	}

	injectEarlyCSS();
	startObserver();
})();
