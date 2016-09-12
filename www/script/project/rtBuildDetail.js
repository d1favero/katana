/*global define, Handlebars */
define(function (require) {
    "use strict";

    var $ = require('jquery'),
        realtimePages = require('realtimePages'),
        helpers = require('helpers'),
        timeElements = require('timeElements'),
        popups = require('ui.popup'),
        qs = require('libs/query-string'),
        hb = require('project/handlebars-extend'),
        hbBuild = hb.build,
        _ = require('lodash');

    var rtBuildDetail,
        isLoaded = false,
        noMoreReloads = false,
        debug = qs.parse(location.search).debug === "true";

    rtBuildDetail = {
        init: function () {
            var realtimeFunctions = realtimePages.defaultRealtimeFunctions();
            realtimeFunctions.build = rtBuildDetail.processBuildDetailPage;
            realtimePages.initRealtime(realtimeFunctions);
            timeElements.setHeartbeat(1000);

            // insert codebase and branch on the builders page
            helpers.tableHeader($('.top'));

            //Allow for popups
            $(".popup-btn-js-2").bind("click.katana", function (e) {
                e.preventDefault();
                var $elem = $(e.target);
                var html = $elem.next(".more-info-box-js").html(),
                    $body = $("body"),
                    $popup = $("<div/>").popup({
                        title: "",
                        html: html,
                        destroyAfter: true
                    });

                $body.append($popup);
            });

            // Setup dialog for stop entire chain
            $("form[data-stop-chain]").ajaxForm({
                beforeSubmit: function beforeSubmit() {
                    return confirm('This will cancel all builds in this chain, a process which could take quite a few seconds. \n\nAre you sure ' +
                    'you want to continue?');

                }
            });

            // Setup build buttons
            popups.initRunBuild($(".custom-build"), $(".instant-build"), true);
        },
        processBuildDetailPage: function (data) {
            //We get slighlty different data objects from autobahn
            var keys = Object.keys(data);
            if (keys.length === 1) {
                data = data[keys[0]];
            }

            var buildStartTime = data.times[0],
                buildEndTime = data.times[1],
                buildFinished = (buildEndTime !== null),
                eta = data.eta;

            rtBuildDetail.refreshIfRequired(buildFinished);

            //Process Page
            rtBuildDetail.processBuildResult(data, buildStartTime, eta, buildFinished);
            rtBuildDetail.processSteps(data);
            rtBuildDetail.processArtifacts(data);

            //If build is running
            if (buildEndTime === null) {
                //Elapsed Time & Progress Bar
                timeElements.addElapsedElem($('#elapsedTimeJs'), buildStartTime);
            }

            timeElements.updateTimeObjects();
        },
        processBuildResult: function (data, startTime, eta, buildFinished) {
            var $buildResult = $('#buildResult');
            timeElements.clearTimeObjects($buildResult);
            var progressBar = "";
            if (eta !== 0) {
                progressBar = hb.partials.build["build:progressBar"]({progressBar: true, etaStart: startTime, etaCurrent: eta});
            }

            var props = {
                buildResults: true,
                b: data,
                buildIsFinished: buildFinished,
                progressBar: progressBar
            };

            var html = hbBuild(props);
            $buildResult.html(html);

            var $progressBar = $buildResult.find(".percent-outer-js");
            $progressBar.addClass("build-detail-progress");
            helpers.delegateToProgressBar($progressBar);
        },
        processSteps: function (data) {
            var html = "";
            var $stepList = $('#stepList');
            var count = 1;
            /*jslint unparam: true*/
            $.each(data.steps, function (i, stepData) {
                if (stepData.hidden && !debug) {
                    return true;
                }

                var started = stepData.isStarted;
                var finished = stepData.isFinished;

                var status = stepData.results[0];
                if (!started) {
                    status = helpers.cssClassesEnum.NOT_STARTED;
                } else if (started && !finished) {
                    status = helpers.cssClassesEnum.RUNNING;
                }

                stepData.hasURLs = Object.keys(stepData.urls).length > 0;
                stepData.hasArtifacts = Object.keys(stepData.artifacts).length > 0;
                stepData.hasDependencies = Object.keys(stepData.dependencies).length > 0;

                var cssClass = helpers.getCssClassFromStatus(status);
                var startTime = stepData.times[0];
                var endTime = stepData.times[1];
                var runTime = helpers.getTime(startTime, endTime);
                var props = {
                    step: true,
                    index: count,
                    stepStarted: stepData.isStarted,
                    run_time: runTime,
                    css_class: cssClass,
                    s: stepData,
                    url: stepData.url
                };
                html += hbBuild(props);
                count += 1;

                return true;
            });
            /*jslint unparam: false*/

            $stepList.html(html);
        },
        processArtifacts: function (data) { // for the builddetailpage. Puts the artifacts and testresuts on top
            var $artifactsJSElem = $("#artifacts-js").empty(),
                html,
                artifacts = _.flattenDeep(data.steps.map(function(step) {  return step.artifacts || [] }));

            /*jslint unparam: true*/
            $.each(data.steps, function (i, obj) {
                if (obj.artifacts !== undefined) {
                    $.each(obj.artifacts, function (j, obj) {

                        artifactsDict[obj["name"]] = obj["url"];

                    });
                }
            });
            var reportSource = $.grep(data.logs, function(obj){ return obj.url.indexOf(".json") > -1; });
            if(!reportSource.length) {
                reportSource = $.grep(data.logs, function (obj) {
                    return obj.url.indexOf(".xml") > -1;
                });
            }
            var htmlReport = $.grep(data.logs, function(obj){ return obj.url.indexOf(".html") > -1; });

            $.each(reportSource.concat(htmlReport), function(i, obj){ testLogsDict[obj.name] = obj.url ;} );

            /*jslint unparam: false*/

            if (!artifacts.length) {
                $artifactsJSElem.html("No artifacts");
            } else {
                html = '<a class="artifact-popup artifacts-js more-info" href="#">Artifacts ({0})&nbsp;</a>'.format(artifacts.length);

                $artifactsJSElem.html(html);

                popups.initArtifacts(artifacts, $artifactsJSElem.find(".artifact-popup"));
            }

            if(data.logs.length) {
                var reportSource = _.filter(data.logs, function (obj) {
                    return obj.url.indexOf(".json") > -1;
                });
                if (!reportSource.length) {
                    reportSource = _.filter(data.logs, function (obj) {
                        return obj.url.indexOf(".xml") > -1;
                    });
                }
                var htmlReport = _.filter(data.logs, function (obj) {
                    return obj.url.indexOf(".html") > -1;
                });

                var unitTestArtifacts = _.unionBy(reportSource, htmlReport, 'name')

                if (unitTestArtifacts.length) {
                    html = '<li>Test Results</li>';

                    _(unitTestArtifacts).forEach(function (obj) {
                        html += '<li class="s-logs-js"><a href="{0}">{1}</a></li>'.format(obj.url, obj.name);
                    });

                    html = $("<ul/>").addClass("tests-summary-list list-unstyled").html(html);

                    $artifactsJSElem.append(html);
                }
            }

            return $artifactsJSElem
        },
        refreshIfRequired: function (buildFinished) {
            //Deal with page reload
            if (!noMoreReloads && isLoaded && buildFinished) {
                window.location = window.location + '#finished';
                window.location.reload();
            }
            if (noMoreReloads === false) {
                noMoreReloads = buildFinished;
            }

            isLoaded = true;
        }
    };

    return rtBuildDetail;
});