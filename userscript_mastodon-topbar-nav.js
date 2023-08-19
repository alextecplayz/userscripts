// ==UserScript==
// @name         Mastodon top bar navigation
// @namespace    github.com/openstyles/stylus
// @version      1.0.0
// @description  Top bar navigation for Mastodon in non-advanced mode. Feed is wider. UI is square.
// @author       AlexTECPlayz
// @match        *://*techhub.social/*
// @match        *://*mastodon.social/*
// @match        *://*mstdn.social/*
// @match        *://*mastodon.world/*
// @match        *://*mas.to/*
// @match        *://*mastodon.online/*
// @match        *://*mastodonapp.uk/*
// @match        *://*universeodon.com/*
// @match        *://*social.vivaldi.net/*
// @match        *://*c.im/*
// @match        *://*mstdn.party/*
// @match        *://*det.social/*
// @match        *://*ohai.social/*
// @match        *://*toot.community/*
// @match        *://*masto.nu/*
// @match        *://*ieji.de/*
// @match        *://*nerdculture.de/*
// @match        *://*toot.io/*
// @match        *://*mstdn.plus/*
// @match        *://*persiansmastodon.com/*
// @match        *://*stranger.social/*
// @match        *://*cupoftea.social/*
// @match        *://*famichiki.jp/*
// @match        *://*fairy.id/*
// @match        *://*convo.casa/*
// @match        *://*expressional.social/*
// @match        *://*opalstack.social/*
// @match        *://*toot.funami.tech/*
// @match        *://*cr8r.gg/*
// @match        *://*sakurajima.moe/*
// @match        *://*sself.co/*
// @match        *://*mstdn.dk/*
// @match        *://*beekeeping.ninja/*
// @match        *://*tooters.org/*
// @match        *://*mstdn.business/*
// @match        *://*masto.ai/*
// @match        *://*hachyderm.io/*
// @match        *://*defcon.social/*
// @match        *://*bark.lgbt/*
// @match        *://*tech.lgbt/*
// @match        *://*meow.social/*
// @match        *://*yiff.life/*
// @match        *://*mastodon.art/*
// @match        *://*comfy.social/*
// @match        *://*mamot.fr/*
// @match        *://*fedi.software/*
// @match        *://*fightforthefuture.org/*
// @match        *://*social.network.europa.eu/*
// @match        *://*tube.network.europa.eu/*
// @match        *://*wikimedia.social/*
// @match        *://*social.overheid.nl/*
// @match        *://*mastodon.green/*
// @match        *://*botany.social/*
// @match        *://*wetdry.world/*
// @match        *://*mastodon.xyz/*
// @match        *://*social.openrights.org/*
// @match        *://*aus.social/*
// @match        *://*mastodon.gamedev.place/*
// @match        *://*chaosfem.tw/*
// @match        *://*mas.to/*
// @match        *://*floss.social/*
// @match        *://*mastodon.au/*
// @match        *://*mastodon.sdf.org/*
// @match        *://*mozilla.social/*
// @match        *://*wikis.world/*
// @match        *://*fosstodon.org/*
// @match        *://*mastodon.matrix.org/*
// @match        *://*raspberrypi.social/*
// @match        *://*framapiaf.org/*
// @match        *://*infosec.exchange/*
// @match        *://*dice.camp/*
// @match        *://*social.growyourown.services/*
// @match        *://*neat.computer/*
// @match        *://*ubuntu.social/*
// @match        *://*social.lol/*
// @match        *://*s.awoo.social/*
// @match        *://*med-mastodon.com/*
// @match        *://*bitbang.social/*
// @match        *://*digipres.club/*
// @match        *://*treehouse.systems/*
// @match        *://*indieweb.social/*
// @match        *://*queer.party/*
// @match        *://*social.theboxcollective.org/*
// @match        *://*kitty.social/*
// @match        *://*campaign.openworlds.info/*
// @match        *://*oldbytes.space/*
// @run-at      document-end
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.textContent = `
    body:not(.layout-multiple-columns) {
    @media only screen and (min-width: 1175px) {
		.navigation-panel {
			display: flex !important;
    		flex-direction: row !important;
    		justify-content: center;
    		align-items: start;
    		padding: 0rem;
    		top: 0;
    		left: 0;
		}

		.navigation-panel__logo {
			display: none;
		}

		.navigation-panel a {
    		margin-top: 0rem;
            margin-bottom: 0rem;
            margin-left: 0.5rem;
            margin-right: 0.5rem;
    		text-decoration: none !important;
  		}

        .navigation-bar {
        	margin: -1rem;
        	position: unset;
            z-index: 2;
        }

		.column-link {
			font-size: 14px;
  			padding: 10px;
		}

		.column-link--transparent.active {
			background-color: #8c8dff;
			color: #fff;
		}

		.getting-started__trends {
			display: none;
		}

		.columns-area__panels__pane {
			min-width: 585px;
			display: unset;
		}

		.columns-area__panels__main {
			min-width: 600px;
			max-width: 180vh;
			position: absolute;
			top: 0;
		}

		.search {
            margin: 0.35rem;
		}

        .compose-panel {
        	display: none;
            width: 100%;
            margin: 0rem;
            height: unset;
        }

		.compose-panel .navigation-bar {
			top: 0;
  			right: 0;
  			position: absolute;
  			margin-top: -0.5rem;
		}

        .compose-panel .compose-form {
        	display: flex;
            flex-direction: row;
            min-height: unset;
            min-width: unset;
            padding: 0rem;
            margin: 0rem;
            justify-content: center;
        }

		.compose-panel .link-footer {
			display: none;
		}

		.columns-area__panels__pane__inner {
			display: unset;
		}

        .topnav-container {
        	display: flex;
        	width: 100%;
        	justify-content: space-evenly;
            position: sticky;
            top: 0;
            z-index: 10;
            background-color: rgba(25, 27, 34, 0.5);
        }

        .tabs-bar__wrapper {
            padding-top: 60px;
            top: 0;
            z-index: 2;
        }

        .compose-button {
        	display: block;
            padding: 10px;
        }

        .compose-button__button {
        	font-size: 14px;
        	padding: 11.5px;
        	text-decoration: none !important;
            margin: 0rem;
        	background-color: #6364ff;
        	color: #fff;
            border: none;
        }

        .compose-button__button:hover {
            background-color: #8c8dff;
        }

        .compose-container {
        	display: block;
        	background-color: transparent;
            position: relative;
            z-index: 3;
            margin-bottom: -2.5rem;
        }

        .columns-area__panels {
        	display: block;
        }

        .compose-form {
        	display: flex;
        	flex-direction: row;
        }

        .compose-form__autosuggest-wrapper {
        	display: flex;
        }

        .autosuggest-textarea {
        	display: flex;
            flex-direction: row;
            width: unset;
        }

        .compose-form .autosuggest-textarea__textarea {
           min-height: 1px;
           border-radius: 0px;
        }

        .autosuggest-textarea__textarea {
           min-height: 1px;
           border-radius: 0px;
           width: 100%;
           height: auto;
           padding-top: 0.35rem;
        }

        .compose-form .autosuggest-input, .compose-form .autosuggest-textarea, .compose-form .spoiler-input {
           width: unset;
        }

        .compose-form .compose-form__publish .compose-form__publish-button-wrapper {
           padding-top: 0rem;
        }

        .compose-panel .compose-form__autosuggest-wrapper {
           border-radius: 0px;
        }

        .compose-form .compose-form__buttons-wrapper {
           border-radius: 0px;
        }

        .compose-form__publish-button-wrapper {
           padding-top: unset;
           padding-left: 0.5rem;
        }

        .button.button--block {
           height: 100%;
           border-radius: 0px;
        }

        .character-counter {
           line-height: 27px;
        }

        .compose-form .emoji-picker-dropdown {
           padding: 0.5rem;
        }

        .status-card__image-image {
           border-radius: 0px !important;
        }
	}
	}`;

    document.head.appendChild(style);

    var newContainer_Topbar = document.createElement("div");
    var newContainer_Compose = document.createElement("div");
    newContainer_Topbar.classList.add("topnav-container");
    newContainer_Compose.classList.add("compose-container");

    var observer;

    var topnavContainer = document.querySelector(".topnav-container");

    function setStickyPosition() {
    if (!topnavContainer) return;
    var scrollY = window.scrollY || window.pageYOffset;
    var threshold = 1;

    if (scrollY >= threshold) {
        topnavContainer.style.position = 'fixed';
        topnavContainer.style.top = '0';
    } else {
        topnavContainer.style.position = 'static';
    }
    }

    function removeDivsByClass(className) {
        var elementsToRemove = document.querySelectorAll('.' + className);
        elementsToRemove.forEach(function(element) {
            element.remove();
        });
    }

    function addComposeButton() {
        var composePanel = document.querySelector(".topnav-container");
        if (composePanel) {
            var composeButtonDiv = document.createElement("div");
            composeButtonDiv.classList.add("compose-button");

            var composeButton = document.createElement("button");
            composeButton.textContent = "Compose";
            composeButton.classList.add("compose-button__button");

            composeButton.addEventListener("click", function() {
                var composeForm = document.querySelector(".compose-panel");
                if (composeForm) {
                    if (composeForm.style.display === "block") {
                        composeForm.style.display = "none";
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });
                    } else {
                        composeForm.style.display = "block";
                    }
                }
            });

            composeButtonDiv.appendChild(composeButton);

            composePanel.appendChild(composeButtonDiv);
        }
    }

    function moveElements() {
        if (newContainer_Topbar.parentNode) {
            return;
        }

        newContainer_Topbar.innerHTML = '';
        newContainer_Compose.innerHTML = '';

        var elementsToMove_Topbar = document.querySelectorAll(".navigation-panel, .search, .navigation-bar");
        var elementsToMove_Compose = document.querySelectorAll(".compose-panel");
        elementsToMove_Topbar.forEach(function(element) {
            newContainer_Topbar.appendChild(element);
        });
        elementsToMove_Compose.forEach(function(element) {
            newContainer_Compose.appendChild(element);
        });

        var mainContent = document.querySelector(".tabs-bar__wrapper");
        if (mainContent) {
            mainContent.parentNode.insertBefore(newContainer_Topbar, mainContent);
            mainContent.parentNode.insertBefore(newContainer_Compose, mainContent);
            if (observer) {
                observer.disconnect();
            }

            removeDivsByClass('ui__header');
            removeDivsByClass('link-footer');
            removeDivsByClass('navigation-panel__logo');
            removeDivsByClass('columns-area__panels__pane--start');
            removeDivsByClass('columns-area__panels__pane--navigational');
            removeDivsByClass('logo-resources');
            removeDivsByClass('navigation-panel__sign-in-banner');

            var searchPanel = newContainer_Topbar.querySelector(".search");
            var navigationPanel = newContainer_Topbar.querySelector(".navigation-panel");
            var navigationBar = newContainer_Topbar.querySelector(".navigation-bar");

            newContainer_Topbar.appendChild(newContainer_Topbar.querySelector(".navigation-panel"));
            newContainer_Topbar.appendChild(newContainer_Topbar.querySelector(".search"));
            addComposeButton();
            newContainer_Topbar.appendChild(newContainer_Topbar.querySelector(".navigation-bar"));

            var composePanel = newContainer_Compose.querySelector(".compose-panel");

            newContainer_Compose.appendChild(newContainer_Compose.querySelector(".compose-panel"));

            removeDivsByClass('columns-area__panels__pane');
            removeDivsByClass('columns-area__panels__pane__inner');

            setStickyPosition();

            window.addEventListener('scroll', setStickyPosition);
        }
    }

    function getLuminance(color) {
                const rgb = color.match(/\d+/g);
                if (!rgb || rgb.length < 3) return 0;
                const r = parseInt(rgb[0]) / 255;
                const g = parseInt(rgb[1]) / 255;
                const b = parseInt(rgb[2]) / 255;
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                return ((max + min) / 2) * 100;
    }

    function adjustColorBrightness(color, desiredLuminance) {
                const currentLuminance = getLuminance(color);
                const luminanceDifference = desiredLuminance - currentLuminance;
                const factor = 1 + (luminanceDifference / 100); // Adjust this multiplier as needed
                const adjustedColor = color.match(/\d+/g).map(channel => {
                    return Math.min(255, parseInt(channel * factor));
                });
                return `rgb(${adjustedColor.join(',')})`;
    }

    function adjustTextColor(backgroundColor) {
    const luminance = getLuminance(backgroundColor);
    if (luminance > 50) {
        return 'black;';
    } else {
        return 'white;';
    }
    }

    function getUserBannerImageUrl() {
        var bannerImage = document.querySelector(".parallax");

        if (bannerImage) {
            var bannerImageUrl = bannerImage.src;

            function getDominantColor(imageUrl, callback) {
            var img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = imageUrl;
            img.onload = function () {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                var colorCounts = {};
                var maxColor = null;
                var maxCount = 0;

                for (var i = 0; i < imageData.length; i += 4) {
                    var r = imageData[i];
                    var g = imageData[i + 1];
                    var b = imageData[i + 2];

                    var color = `rgb(${r},${g},${b})`;

                    if (colorCounts[color]) {
                        colorCounts[color]++;
                    } else {
                        colorCounts[color] = 1;
                    }

                    if (colorCounts[color] > maxCount) {
                        maxColor = color;
                        maxCount = colorCounts[color];
                    }
                }

                callback(maxColor);
            };
        }

            getDominantColor(bannerImageUrl, function (color) {
            var desiredLuminance = 350; // Adjust this as needed
            var adjustedColor = adjustColorBrightness(color, desiredLuminance);
            var textColorStyle = adjustTextColor(adjustedColor);

            var style = document.createElement("style");

            style.textContent = `
            .accent-color-bg {
                background-color: ${textColorStyle};
                color: ${adjustedColor};
            }

            .accent-color-col {
                color: ${textColorStyle};
                background-color: ${adjustedColor};
            }

            .account__header__tabs__name small span {
                background-color: ${adjustedColor};
                color: ${textColorStyle};
            }

            dl[class=""] > dd.translate > span >a > span[class=""] {
                background: ${adjustedColor};
                color: ${textColorStyle};
            }

            .account__header__tabs__buttons > button.button.logo-button {
                background: ${adjustedColor};
                color: ${textColorStyle};
            }`;

            document.head.appendChild(style);
        });

    } else {
        console.log("Banner image element not found.");
    }
}

    setTimeout(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            topnavContainer = document.querySelector(".topnav-container");
            moveElements();
            setTimeout(getUserBannerImageUrl, 1500); // Adjust the delay as needed
            });
        } else {
        setTimeout(getUserBannerImageUrl, 1500); // Adjust the delay as needed
        topnavContainer = document.querySelector(".topnav-container")
        moveElements();
    }

    observer = new MutationObserver(moveElements);
    observer.observe(document.body, {childList: true, subtree: true });
}, 1000);
})();
