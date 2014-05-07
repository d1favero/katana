define(["jquery","realtimePages","helpers","dataTables","handlebars","extend-moment","libs/jquery.form","text!templates/builderdetail.handlebars","text!hbCells","timeElements","rtGenericTable","popup"],function(e,t,n,r,i,s,o,u,a,f,l,c){var h=Handlebars.compile(a),p,d,v,m=Handlebars.compile(u);return p={init:function(){d=p.currentBuildsTableInit(e("#rtCurrentBuildsTable")),v=l.table.buildTableInit(e("#rtBuildsTable"),!0);var r=t.defaultRealtimeFunctions();r.project=p.rtfProcessCurrentBuilds,r.builds=p.rtfProcessBuilds,t.initRealtime(r),n.selectBuildsAction(d),e.ajax({url:"http://10.45.6.93:8001/json/builders/All%20Branches%20%3E%20Build%20AndroidPlayer/builds/<15?cellsdk_branch=default&unity_branch=trunk",dataType:"json",type:"GET",cache:!1,success:function(e){p.rtfProcessBuilds(e)}}),e.ajax({url:"http://10.45.6.93:8001/json/projects/All%20Branches/All Branches > Build NaClPlayer?cellsdk_branch=default&unity_branch=trunk",dataType:"json",type:"GET",cache:!1,success:function(e){p.rtfProcessCurrentBuilds(e)}})},rtfProcessCurrentBuilds:function(e){f.clearTimeObjects(d),d.fnClearTable();try{e.currentBuilds!==undefined&&(d.fnAddData(e.currentBuilds),f.updateTimeObjects()),f.updateTimeObjects()}catch(t){}},rtfProcessBuilds:function(e){l.table.rtfGenericTableProcess(v,e)},currentBuildsTableInit:function(t){var n={};return n.oLanguage={sEmptyTable:"No current builds"},n.aoColumns=[{mData:null,sTitle:"Builder",sWidth:"30%"},{mData:null,sTitle:"Current build",sWidth:"30%"},{mData:null,sTitle:"Revision",sWidth:"30%"},{mData:null,sTitle:"Author",sWidth:"5%"},{mData:null,sTitle:h({showInputField:!0,text:"",inputId:"selectAll"}),sWidth:"5%",sClass:"select-input",bSortable:!1}],n.aoColumnDefs=[l.cell.builderName(0,"txt-align-left"),l.cell.buildProgress(1,!0),l.cell.revision(2),{aTargets:[3],sClass:"txt-align-left",mRender:function(t,n,r){var i="N/A";return r.properties!==undefined&&e.each(r.properties,function(e,t){t[0]==="owner"&&(i=t[1])}),i}},l.cell.stopBuild(4)],r.initTable(t,n)}},p});