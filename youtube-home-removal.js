/* ==UserStyle==
@name           Remove 'Home' button on YouTube
@namespace      github.com/openstyles/stylus
@version        1.0.0
@description    Since it's a waste of space if you have Watch History off, there's no need for it anymore.
@author         AlexTECPlayz
==/UserStyle== */

@-moz-document domain("youtube.com") {
  	#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="Home"] {
  		display: none;
	}

	a.yt-simple-endpoint.style-scope.ytd-mini-guide-entry-renderer[title="Home"] {
  		display: none;
	}
}
