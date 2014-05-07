define(["jquery","moment","helpers","datatables-plugin"],function(e,t,n){var r,i,s={dataTablesInit:function(){e.fn.dataTableExt.oApi.fnFilterAll=function(t,n,r,s,o){var u=e.fn.dataTableSettings,a;for(a=0;a<u.length;a+=1)u[a].oInstance.fnFilter(n,r,s,o);e(".dataTables_empty").closest(i).hide()},jQuery.fn.dataTableExt.oApi.fnFilterOnReturn=function(){var t=this;return this.each(function(n){e.fn.dataTableExt.iApiIndex=n;var r=e("input",t.fnSettings().aanFeatures.f);return r.unbind("keyup").bind("keypress",function(i){i.which===13&&(e.fn.dataTableExt.iApiIndex=n,t.fnFilter(r.val()))}),this}),this},r=e(".tablesorter-log-js").dataTable({asSorting:!1,bPaginate:!1,bFilter:!0,bSort:!1,bInfo:!1,bAutoWidth:!1})},addFailureButtons:function(){e(".failure-detail-cont",i).each(function(){var t=e(".failure-detail-txt",this);t.text(t.text().trim()),e(this).height(t.height()+40),t.is(":empty")||(e('<a href="#" class="new-window var-3 grey-btn">Open new window</a>').insertBefore(t),t.height()>=130&&e('<a class="height-toggle var-3 grey-btn" href="#">Show more</a>').insertBefore(t))}),e(".new-window").click(function(t){t.preventDefault();var n=e(this).parent().find(e(".failure-detail-txt")).html();s.openNewWindow(n)}),e(".height-toggle").click(function(t){t.preventDefault();var n=e(this).parent().find(e(".failure-detail-txt")),r=e(this).parent().parent();n.css({"max-height":"none",height:""}),e(this).hasClass("expanded-js")?(e(this).removeClass("expanded-js"),e(this).text("Show more"),n.css("max-height",130),r.css("height",170)):(e(this).addClass("expanded-js"),e(this).text("Show less"),n.css("height",""),r.css("height",n.height()+40))})},parseTimes:function(){e.each(e("[data-time]"),function(n,r){var i=parseFloat(e(r).attr("data-time"))*1e3,s=t.utc(i).format(" (HH:mm:ss)");e(r).append(s)})},filterCheckboxes:function(){var t=e("#CheckBoxesList").find("input:checked"),n=[];i.show(),t.each(function(){n.push("("+e(this).val()+")")}),r.fnFilterAll(n.join("|"),1,!0)},setupFilterButtons:function(){var t=e("#filterinput"),n=e("#submitFilter"),r=e(".log-main").attr("data-failed-tests");t.keydown(function(e){var t=window.event||e;t.keyCode===13&&s.filterTables(this.value)}),n.click(function(){s.filterTables(t.val())}),e("#clearFilter").click(function(){t.val(""),n.click()}),r===0&&(e("#failedinput").attr("checked",!1),e("#passinput").attr("checked",!0))},filterTables:function(e,t,n){i.show(e),r.fnFilterAll(e,t,n)},openNewWindow:function(t){var n=window.open();t="<style>body {padding:0 0 0 15px;margin:0;font-family:'Courier New';font-size:12px;white-space: pre;overflow:auto;}</style>"+t,e(n.document.body).html(t)},addCodebasesBar:function(){var t=e(".top");window.location.search!==""&&n.codeBaseBranchOverview(t)}},o={init:function(){i=e(".table-holder"),s.dataTablesInit(),s.parseTimes(),s.setupFilterButtons(),s.addCodebasesBar();var t=e("#CheckBoxesList").find("input");t.click(function(){s.filterCheckboxes()}),s.filterCheckboxes(),setTimeout(s.addFailureButtons,100)}};return e(document).ready(function(){o.init()}),o});