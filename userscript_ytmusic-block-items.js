// ==UserScript==
// @name			YTM Hide channels, albums and songs
// @namespace		https://alextecplayz.com
// @version			2025-11-30
// @description		Adds a few buttons and an interface to hide and manage hidden items. Also comes with a bunch of channels and content that is hidden by default, including AI slop.
// @author			AlexTECPlayz
// @match			https://music.youtube.com/*
// @icon			https://music.youtube.com/img/favicon_144.png
// @grant			GM_setValue
// @Grant			GM.setValue
// @grant			GM_getValue
// @grant			GM.getValue
// @run-at			document-end
// @license			MIT
// @homepageURL		https://github.com/alextecplayz/userscripts
// @supportURL		https://github.com/alextecplayz/userscripts/issues
// @downloadURL		https://raw.githubusercontent.com/alextecplayz/userscripts/refs/heads/main/userscript_ytmusic-block-items.js
// @updateURL		https://raw.githubusercontent.com/alextecplayz/userscripts/refs/heads/main/userscript_ytmusic-block-items.js
// ==/UserScript==

(function() {
	'use strict';

	// ------ Content display types ------
	// this is the extendable array of content displayed to be hidden via YTM Hide
	const contentDisplayHandlers = [
		{
			name: 'GridAlbum',
			selector: 'ytmusic-two-row-item-renderer',
			getUrls: (item) => {
				return Array.from(item.querySelectorAll('a.yt-simple-endpoint'))
					.map(a => a.href)
					.filter(Boolean);
			},
			hideItem: (item) => {if (item && item.parentNode) {item.remove();}}
		},
		{
			name: 'ListRow',
			selector: 'ytmusic-responsive-list-item-renderer',
			getUrls: (item) => {
				return Array.from(item.querySelectorAll('a.yt-simple-endpoint'))
					.map(a => a.href)
					.filter(Boolean);
			},
			hideItem: (item) => {if (item && item.parentNode) {item.remove();}}
		}
	];

	// ------ Helpers ------
	// Helper: normalize URL by stripping scheme and domain prefix for comparison
	function normalizeUrl(url) {
		if (!url) return null;
		return url.replace(/^https?:\/\/music\.youtube\.com\//, '');
	}
	// Helper: convert relative URL back to full for UI display
	function toFullUrl(relativeUrl) {
		if (!relativeUrl) return '';
		if (relativeUrl.startsWith('http')) return relativeUrl;
		return 'https://music.youtube.com/' + relativeUrl;
	}
	// Helper: wait until element appears in DOM
	function waitForElement(selector, root = document) {
		return new Promise(resolve => {
			const el = root.querySelector(selector);
			if(el) return resolve(el);
			const observer = new MutationObserver(() => {
				const el = root.querySelector(selector);
				if(el) {
					resolve(el);
					observer.disconnect();
				}
			});
			observer.observe(root, {childList: true, subtree: true});
		});
	}
	// Helper: logging to both console and UI
	function logDebug(message) {
		console.log(message);
		const logElem = document.getElementById('ytm-hide-log');
		if (logElem) {
			if (logElem.value) logElem.value += '\n';
			logElem.value += message;
			logElem.scrollTop = logElem.scrollHeight;
			// save the log entry in sessionStorage
			sessionStorage.setItem('ytmHideLog', logElem.value);
		}
	}
	// Helper: restore log from sessionStorage
	function restoreLog() {
		const savedLog = sessionStorage.getItem('ytmHideLog') || '';
		const logElem = document.getElementById('ytm-hide-log');
		if (logElem) {
			logElem.value = savedLog;
			logElem.scrollTop = logElem.scrollHeight;
		}
	}

	// Add UI Save and Reset button listeners
	function attachButtonListeners() {
		const saveBtn = document.getElementById('ytm-hide-button-save');
		const resetBtn = document.getElementById('ytm-hide-button-reset');
		if (!saveBtn || !resetBtn) return;
		const textarea = document.getElementById('ytm-hide-list');

		saveBtn.addEventListener('click', async () => {
			if (!textarea) return;
			const lines = textarea.value.trim()
				.split('\n')
				.map(l => l.trim())
				.filter(Boolean);
			await setBlockList(lines);
			await applyBlocking();
			logDebug('Saved blocklist with ' + lines.length + ' entries.');
		});

		resetBtn.addEventListener('click', async () => {
			if (!textarea) return;
			textarea.value = '';
			await setBlockList([]);
			await applyBlocking();
			logDebug('Blocklist reset and UI cleared.');
		});
	}

	// ------ Main code ------
	async function initYTMHideSettingsUI() {
		if (document.getElementById('ytm-hide-settings')) return; // check if already initialized
		// --- YTM Hide hooks into the native YouTube Music interface, including settings page
		
		// Wait for settings page root
		const settingsRoot = await waitForElement('ytmusic-settings-page');
		if (!settingsRoot) return;
		// Get settings sidebar
		const sidebar = settingsRoot.querySelector('tp-yt-paper-listbox.category-menu');
		if (!sidebar) return;
		// Create sidebar button for YTM Hide
		if (!sidebar.querySelector('.ytm-hide-sidebar-item')) {
			const tabItemOuter = document.createElement('tp-yt-paper-item');
			tabItemOuter.className = 'category-menu-item style-scope ytmusic-settings-page ytm-hide-sidebar-item';
			tabItemOuter.setAttribute('style-target', 'host');
			tabItemOuter.setAttribute('role', 'option');
			tabItemOuter.setAttribute('tabindex', '-1');
			tabItemOuter.setAttribute('aria-disabled', 'false');
			tabItemOuter.setAttribute('aria-selected', 'false');
			tabItemOuter.id ='ytm-hide-sidebar-button';
			const tabItem = document.createElement('div');
			const titleSpan = document.createElement('p');
			titleSpan.className = 'title style-scope ytmusic-settings-page';
			titleSpan.style.setProperty('color', 'var(--ctp-text)', 'important'); // this is for catppuccin
			titleSpan.textContent = 'YTM Hide';
			tabItem.appendChild(titleSpan);
			tabItemOuter.appendChild(tabItem);
			sidebar.appendChild(tabItemOuter);
			// sidebar button listener
			tabItemOuter.addEventListener('click', () => {
				// unselect other sidebar items
				sidebar.querySelectorAll('tp-yt-paper-item').forEach(item => {
					item.setAttribute('aria-selected', 'false');
					item.setAttribute('tabindex', '-1');
					item.classList.remove('iron-selected');
				});
				tabItemOuter.setAttribute('aria-selected', 'true');
				tabItemOuter.setAttribute('tabindex', '0');
				tabItemOuter.classList.add('iron-selected');
				mainViewItems.style.display = 'none';
				ytmHideContainer.style.display = 'block';
			});
			// Also handle clicks on other sidebar items to revert view
			sidebar.querySelectorAll('tp-yt-paper-item').forEach(item => {
				if (item !== tabItemOuter) {
					item.addEventListener('click', () => {
						ytmHideContainer.style.display = 'none';
						mainViewItems.style.display = 'block';
					});
				}
				tabItemOuter.classList.remove('iron-selected');
			});
		}
		// Get settings main view
		const mainView = settingsRoot.querySelector('ytmusic-setting-category-collection-renderer');
		const mainViewItems = settingsRoot.querySelector('ytmusic-setting-category-collection-renderer .items');
		if (!mainView) return;
		if (!mainViewItems) return;
		// Create child of main view, .items gets hidden when active
		const ytmHideContainer = document.createElement('div');
		ytmHideContainer.id = 'ytm-hide-settings';
		ytmHideContainer.style.padding = '16px';
		ytmHideContainer.style.display = 'none';
		// Create label
		const ytmHideSettingsLinklistLabel = document.createElement('div');
		ytmHideSettingsLinklistLabel.className = 'title style-scope ytmusic-setting-action-renderer';
		ytmHideSettingsLinklistLabel.textContent = 'List of hidden items';
		ytmHideContainer.appendChild(ytmHideSettingsLinklistLabel);
		// Create infobox
		const ytmHideSettingsLinklistInfobox = document.createElement('div');
		ytmHideSettingsLinklistInfobox.className = 'style-scope ytmusic-eom-settings-disclaimer-renderer';
		ytmHideSettingsLinklistInfobox.style.marginTop = '8px';
		ytmHideSettingsLinklistInfobox.style.padding = '20px 24px';
		ytmHideSettingsLinklistInfobox.style.background = 'rgba(255,255,255, .1)';
		ytmHideSettingsLinklistInfobox.style.borderRadius = '2px';
		ytmHideSettingsLinklistInfobox.style.display = 'flex';
		ytmHideSettingsLinklistInfobox.style.flexDirection = 'row';
		ytmHideSettingsLinklistInfobox.style.justifyContent = 'center';
		ytmHideSettingsLinklistInfobox.style.alignItems = 'center';
		ytmHideSettingsLinklistInfobox.style.fontFamily = 'Roboto,Noto Naskh Arabic UI,Arial,sans-serif';
		ytmHideSettingsLinklistInfobox.style.fontSize = '14px';
		ytmHideSettingsLinklistInfobox.style.lineHeight = 'var(--ytmusic-body-line-height)';
		ytmHideSettingsLinklistInfobox.style.fontWeight = '400';
		ytmHideSettingsLinklistInfobox.style.color = '#fff';
		//const InfoboxIconOuter = document.createElement('div');
		//InfoboxIconOuter.style.minWidth = '24px';
		//InfoboxIconOuter.style.paddingRight = '8px';
		//const InfoboxIcon = `<span class="yt-icon-shape style-scope yt-icon ytSpecIconShapeHost"><div style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 110 18.001A9 9 0 0112 3Zm0 3.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5ZM13 15v-5h-2.5a1 1 0 000 2h.5v3h-1a1 1 0 000 2h4a1 1 0 000-2h-1Z"></path></svg></div></span>`;
		//InfoboxIconOuter.innerHTML = InfoboxIcon.trim();
		const InfoboxString = document.createElement('span');
		InfoboxString.className = 'style-scope ytmusic-eom-settings-disclaimer-renderer yt-formatted-string';
		InfoboxString.textContent += 'Insert one link per line. Note that it must match the "https://music.youtube.com/" URL format. Currently accepted types are channels, ablums and song links.';
		InfoboxString.textContent += '';
		InfoboxString.textContent += 'Note that YTM Hide will try its best to hide the supported types, however under certain circumstances blocked items may not be hidden.';
		ytmHideSettingsLinklistInfobox.appendChild(InfoboxString);
		ytmHideContainer.appendChild(ytmHideSettingsLinklistInfobox);
		// Add scrollable box container for blocked links
		const settingsLinklistScrollbox = document.createElement('textarea');
		settingsLinklistScrollbox.style.marginTop = '8px';
		settingsLinklistScrollbox.style.maxHeight = '300px';
		settingsLinklistScrollbox.style.overflow = 'scroll';
		settingsLinklistScrollbox.style.border = '1px solid var(--ctp-text, var(--yt-spec-white-4))';
		settingsLinklistScrollbox.style.padding = '8px';
		settingsLinklistScrollbox.style.backgroundColor = 'var(--ctp-surface0, var(--yt-spec-black-1))';
		settingsLinklistScrollbox.style.color = 'var(--yt-primary-text-color, var(--yt-spec-white-2))';
		settingsLinklistScrollbox.id = 'ytm-hide-list';
		settingsLinklistScrollbox.rows = '15';
		settingsLinklistScrollbox.cols = '68';
		settingsLinklistScrollbox.placeholder = 'https://music.youtube.com/channel/UCgHOnya3uKm1fHiHyXeQK3w';
		settingsLinklistScrollbox.spellcheck = 'false';
		ytmHideContainer.appendChild(settingsLinklistScrollbox);
		// Add Save and Reset buttons
		const ytmHideButtonContainer = document.createElement('div');
		ytmHideButtonContainer.style.display = 'flex';
		ytmHideButtonContainer.style.flexDirection = 'row';
		ytmHideButtonContainer.style.gap = '16px';
		const ytmHideButtonSave = document.createElement('div');
		ytmHideButtonSave.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--enable-backdrop-filter-experiment';
		ytmHideButtonSave.appendChild(document.createTextNode('Save'));
		ytmHideButtonSave.style.background = 'var(--yt-spec-commerce-filled-hover)';
		ytmHideButtonSave.style.color = 'var(--ctp-crust)';
		ytmHideButtonSave.id = 'ytm-hide-button-save';
		const ytmHideButtonReset = document.createElement('div');
		ytmHideButtonReset.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--enable-backdrop-filter-experiment';
		ytmHideButtonReset.appendChild(document.createTextNode('Reset'));
		ytmHideButtonReset.style.background = 'var(--yt-spec-red-30)';
		ytmHideButtonReset.style.color = 'var(--ctp-crust)';
		ytmHideButtonReset.id = 'ytm-hide-button-reset';
		ytmHideButtonContainer.appendChild(ytmHideButtonSave);
		ytmHideButtonContainer.appendChild(ytmHideButtonReset);
		ytmHideContainer.appendChild(ytmHideButtonContainer);
		// Log output scrollbox
		const ytmHideLogScrollbox = document.createElement('textarea');
		ytmHideLogScrollbox.style.marginTop = '8px';
		ytmHideLogScrollbox.style.maxHeight = '300px';
		ytmHideLogScrollbox.style.overflow = 'scroll';
		ytmHideLogScrollbox.style.border = '1px solid var(--ctp-text, var(--yt-spec-white-4))';
		ytmHideLogScrollbox.style.padding = '8px';
		ytmHideLogScrollbox.style.backgroundColor = 'var(--ctp-surface0, var(--yt-spec-black-1))';
		ytmHideLogScrollbox.style.color = 'var(--yt-primary-text-color, var(--yt-spec-white-2))';
		ytmHideLogScrollbox.id = 'ytm-hide-log';
		ytmHideLogScrollbox.rows = '15';
		ytmHideLogScrollbox.cols = '68';
		ytmHideLogScrollbox.placeholder = 'The log for YTM Hide will show up here...';
		ytmHideLogScrollbox.spellcheck = 'false';
		ytmHideLogScrollbox.readOnly = 'true';
		ytmHideContainer.appendChild(ytmHideLogScrollbox);
		mainView.appendChild(ytmHideContainer);

		fillBlocklistUI();
		restoreLog();
	}

	document.addEventListener('iron-overlay-opened', async (e) => {
		// listen for internal YTM iron-overlay-opened event
		// and re-add Settings UI
		await initYTMHideSettingsUI();
		attachButtonListeners();
	});

	// right-click context menu listener, most helpful in getting browse/ for albums
	let lastRightClickedElement = null;
	document.addEventListener('contextmenu', (event) => {
		console.log('right click!');
		let el = event.target;
		while (el && el !== document) {
			if (el.href && el.href.includes('/browse/')) {
				lastRightClickedElement = el;
				console.log('lastrightclickedel: ', lastRightClickedElement);
				return;
			}
			el = el.parentElement;
			console.log('el: ', el)
		}
		lastRightClickedElement = null;
		console.log('lastrightclickedelement is null: ', lastRightClickedElement);
	}, { capture: true });

	document.addEventListener('yt-popup-opened', async (e) => {
		if (!lastRightClickedElement) return;
		const listbox = Array.from(document.querySelectorAll('tp-yt-paper-listbox')).find(el => el.id === 'items');
		if (!listbox) return;
		if (listbox.querySelector('#ytm-hide-add-playlist')) return;
		const playlistHref = lastRightClickedElement.getAttribute('href');
		const btn = document.createElement('div');
		btn.id = 'ytm-hide-add-playlist';
		btn.setAttribute('role', 'menuitem');
		btn.setAttribute('tabindex', '-1');
		btn.className = 'style-scope ytmusic-menu-popup-renderer';
		btn.style.height = '48px';
		btn.style.display = 'flex';
		btn.style.alignItems = 'center';
		const label = document.createElement('span');
		label.style.color = 'var(--ctp-text)';
		label.style.fontSize = '14px';
		label.style.margin = '0 8px';
		label.textContent = 'Add item to YTM Hide';
		btn.appendChild(label);
		btn.addEventListener('click', async () => {
			const blocklist = await getBlockList();
			const normHref = playlistHref.replace(/^https?:\/\/music\.youtube\.com\//, '').replace(/^\//, '');
			if (!blocklist.includes(normHref)) {
				blocklist.push(normHref);
				await setBlockList(blocklist);
				await applyBlocking();
				logDebug(`Added to YTM Hide: ${normHref}`);
			} else {
				logDebug(`Already in blocklist: ${normHref}`);
			}
		});

		listbox.appendChild(btn);

		// cleanup
		lastRightClickedElement = null;
	});

	document.addEventListener('yt-popup-opened', async (e) => {
		// listen for internal YTM yt-popup-opened event
		// and add option to attempt to blacklist artist
		// and options for album and song blacklisting
		// get right click menu
		const listboxes = document.querySelectorAll('tp-yt-paper-listbox');
		const listbox = Array.from(listboxes).find(el => el.id === 'items');
		if (!listbox) return;
		const listboxParent = listbox.parentElement;
		if (!listboxParent) return;
		listboxParent.style.maxHeight = 'unset';
		// get Artist button's <a> element
		const navItems = listbox.querySelectorAll('ytmusic-menu-navigation-item-renderer');
		let artistAnchor = null;
		for (const navItem of navItems) {
			const anchor = navItem.querySelector('#navigation-endpoint');
			const hrefAttr = anchor.getAttribute('href');
			if (hrefAttr && hrefAttr.startsWith('channel/')) {
				artistAnchor = anchor;
			}
		}
		if (!artistAnchor) return;
		const artistAnchorHref = artistAnchor.getAttribute('href');
		if (!artistAnchorHref || !artistAnchorHref.startsWith('channel/')) return;
		// create new menu elements

		// artist button
		if (!listbox.querySelector('#ytm-hide-add-item')) {
			const hideArtistBtn = document.createElement('div');
			hideArtistBtn.id = 'ytm-hide-add-item';
			hideArtistBtn.setAttribute('role', 'menuitem');
			hideArtistBtn.setAttribute('tabindex', '-1');
			hideArtistBtn.className = 'style-scope ytmusic-menu-popup-renderer';
			hideArtistBtn.style.height = '48px';
			hideArtistBtn.style.display = 'flex';
			hideArtistBtn.style.alignItems = 'center';
			const hideArtistBtnLabel = document.createElement('span');
			hideArtistBtnLabel.style.color = '#fff';
			hideArtistBtnLabel.style.color = 'var(--ctp-text)';
			hideArtistBtnLabel.style.fontFamily = 'Roboto,Noto Naskh Arabic UI,Arial,sans-serif';
			hideArtistBtnLabel.style.fontSize = '14px';
			hideArtistBtnLabel.style.lineHeight = 'var(--ytmusic-body-line-height)';
			hideArtistBtnLabel.style.fontWeight = '400';
			hideArtistBtnLabel.style.margin = '0 8px';
			hideArtistBtnLabel.textContent = 'Add artist to YTM Hide';
			hideArtistBtn.appendChild(hideArtistBtnLabel);

			// attach event listener
			hideArtistBtn.addEventListener('click', async () => {
				let blocklist = await getBlockList();
				const normHref = artistAnchorHref.replace(/^https?:\/\/music\.youtube\.com\//, '');
				if (!blocklist.includes(normHref)) {
					blocklist.push(normHref);
					await setBlockList(blocklist);
					await applyBlocking();
					logDebug(`Added to YTM Hide: ${normHref}`);
				} else {
					logDebug(`Already in blocklist: ${normHref}`);
				}
			});
			listbox.appendChild(hideArtistBtn);
		}
	});

	// Storage helpers using GM APIs if available, else fallback to localStorage
	async function getBlockList() {
		let val;
		if (typeof GM_getValue === 'function') {
			val = await GM_getValue('ytm_hide_blocklist', '');
			return val.split('\n').map(l => normalizeUrl(l.trim())).filter(Boolean);
		} else {
			val = localStorage.getItem('ytm_hide_blocklist') || '';
			return val.split('\n').map(l => normalizeUrl(l.trim())).filter(Boolean);
		}
	}

	async function setBlockList(lines) {
		const val = lines.map(line => normalizeUrl(line)).join('\n');
		if (typeof GM_setValue === 'function') {
			await GM_setValue('ytm_hide_blocklist', val);
		} else {
			localStorage.setItem('ytm_hide_blocklist', val);
		}
	}

	async function fillBlocklistUI() {
		const blocklist = await getBlockList();
		const textarea = document.getElementById('ytm-hide-list');
		if (!textarea) return;
		textarea.value = blocklist.map(toFullUrl).join('\n');
	}

	async function applyBlocking() {
		const blocklist = await getBlockList();
		if (!blocklist.length) return;

		contentDisplayHandlers.forEach(handler => {
			document.querySelectorAll(handler.selector).forEach(item => {
				const urls = handler.getUrls(item);
				if (urls.some(url => {
					const normUrl = normalizeUrl(url);
					return blocklist.includes(normUrl);
				})) {
					handler.hideItem(item);
					logDebug(`Hid item due to matched URL in: ${urls.join(', ')}`);
				}
			});
		});
	}

	async function init() {
		await applyBlocking();
		startObserver();
		await initYTMHideSettingsUI();
		attachButtonListeners();
	}

	const observer = new MutationObserver(async () => {
		await applyBlocking();
	});

	function startObserver() {
		observer.observe(document.body, {childList: true, subtree: true});
	}

	init();
})();