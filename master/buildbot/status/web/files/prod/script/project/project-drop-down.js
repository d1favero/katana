define(["screensize","helpers"],function(e,t){var n;return n={init:function(){$(window).resize(function(){e.isSmallScreen()?$(".project-dropdown-js").remove():($(".top-menu").show(),$(".submenu").remove())}),$(".smartphone-nav").click(function(){$(".top-menu").is(":hidden")?$(".top-menu").fadeIn("fast"):$(".top-menu").fadeOut("fast",function(){$(".submenu").remove()})}),$("#projectDropdown").click(function(n){var r='<div id="bowlG"><div id="bowl_ringG"><div class="ball_holderG"><div class="ballG"></div></div></div></div>';$("body").append(r).show();var i="/projects";if(!e.isSmallScreen()){var s=$('<div class="more-info-box project-dropdown-js"><span class="close-btn"></span><h3>Builders shorcut</h3><div id="content1"></div></div>');$(s).insertAfter($(this))}else $(".submenu").length&&$(".submenu").slideUp("fast",function(){$(".submenu").remove()});$.get(i).done(function(n){var r=$(n);$("#bowlG").remove();if(!e.isSmallScreen()){var i=$(r).find(".tablesorter-js");$(i).appendTo($("#content1")),$(".tablesorter-js",s).removeClass("tablesorter"),$(".top-menu .shortcut-js .scLink").each(function(){var e=$(this).attr("data-sc");$(this).attr("href",e)}),$(s).slideDown("fast")}else{var i=$(r).find(".scLink");$("<ul/>").addClass("submenu").appendTo(".project-dropdown"),$(i).each(function(){var e=$(this).attr("data-sc");$(this).attr("href",e);var t=$("<li>").append($(this));$(".submenu").append(t)}),$(".submenu").slideDown("fast")}e.isSmallScreen()||($(".submenu").remove(),t.closePopup(s,"slideUp"))})})}},n});