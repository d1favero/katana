define(["jquery","screensize","helpers"],function(e,t,n){var r;return r={init:function(){e(window).resize(function(){t.isSmallScreen()?e(".project-dropdown-js").remove():(e(".top-menu").show(),e(".submenu").remove())}),e(".smartphone-nav").click(function(){e(".top-menu").is(":hidden")?e(".top-menu").fadeIn("fast"):e(".top-menu").fadeOut("fast",function(){e(".submenu").remove()})}),e("#projectDropdown").click(function(r){var i='<div id="bowlG"><div id="bowl_ringG"><div class="ball_holderG"><div class="ballG"></div></div></div></div>';e("body").append(i).show();var s="/projects";if(!t.isSmallScreen()){var o=e('<div class="more-info-box project-dropdown-js"><span class="close-btn"></span><h3>Builders shorcut</h3><div id="content1"></div></div>');e(o).insertAfter(e(this))}else e(".submenu").length&&e(".submenu").slideUp("fast",function(){e(".submenu").remove()});e.get(s).done(function(r){var i=e(r);e("#bowlG").remove();if(!t.isSmallScreen()){var s=e(i).find(".tablesorter-js");e(s).appendTo(e("#content1")),e(".tablesorter-js",o).removeClass("tablesorter"),e(".top-menu .shortcut-js .scLink").each(function(){var t=e(this).attr("data-sc");e(this).attr("href",t)}),e(o).slideDown("fast")}else{var s=e(i).find(".scLink");e("<ul/>").addClass("submenu").appendTo(".project-dropdown"),e(s).each(function(){var t=e(this).attr("data-sc");e(this).attr("href",t);var n=e("<li>").append(e(this));e(".submenu").append(n)}),e(".submenu").slideDown("fast")}t.isSmallScreen()||(e(".submenu").remove(),n.closePopup(o,"slideUp"))})})}},r});