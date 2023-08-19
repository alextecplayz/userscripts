/* ==UserStyle==
@name           techhub.social - remove elephant photo
@namespace      github.com/openstyles/stylus
@version        1.0.0
@description    Removes the AI-generated elephant from the bottom left corner of the advanced interface from techhub.social
@author         AlexTECPlayz
==/UserStyle== */

@-moz-document domain("techhub.social") {
	.drawer__inner__mastodon img {
		display: none;
	}
}
