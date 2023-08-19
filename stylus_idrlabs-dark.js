/* ==UserStyle==
@name           IDRLabs dark mode
@namespace      github.com/openstyles/stylus
@version        1.0.0
@description    Dark mode for IDRlabs
@author         AlexTECPlayz
==/UserStyle== */

@-moz-document domain("idrlabs.com") {
	body {
		color: #d4d4d4 !important;
	}
	:root {
		color: #3b3b3b !important;
	}
	header, html, input, select, textarea {
		background-color: #3b3b3b !important;
	}
	#page .content, .main-navi {
		background: #3b3b3b !important;
	}
	.test-contain .whyusetest {
		background: #4e4e4e !important;
		border: 3px solid #7bc9f8;
	}
	.test-contain #slider {
		background:#ff6969 !important;
	}
	.test-contain input[type=range] {
		background: #fff0 !important;	
	}
	.test-contain .langs {
		background: #484848 !important;
	}
	.main-navi a.current, .main-navi a:active, .main-navi a:hover {
 		background: #505050! important;
	}
	#site-footer a, #site-footer a:visited {
 		color: #b0b0b0 !important;
	}
	#site-footer ul#footer .copyright h3 {
		color: #b0b0b0 !important;
	}
	a, a:active {
 		color:#7bc9f8 !important;
	}
	body .page-content .articlestext .articles-nav li {
		background: #4e4e4e !important;
	}
	body .page-content .articlestext .articles-nav li h3 {
		color: #7bc9f8 !important;
	}
	body .page-content .articlestext .section .articles ul {
		 background:#2d2d2d;
 	/*! background-image:linear-gradient(#e6e7e4,#f3f3f2 70%); */
	}
	body .page-content .articlestext .section .articles ul li {
 		/*! border-bottom:1px solid #fff; */
		background: #fff0;
	}
	body {
		background:#fff0
	}
	body .page-content .articlestext .articles-nav {
 		border:1px solid #fff0;
	}
	body .page-content .articlestext .articles-nav li:hover {
		background: #6f6f6f !important;
	}
}
