﻿angular.module("umbraco").controller("Analytics.DashboardController",
    function ($scope, $location, statsResource, settingsResource) {

        var profileID = "";

        // items list array
        $scope.items = [];
        $scope.itemsSources = [];
        $scope.itemsKeywords = [];

        // change sort icons
        function iconSorting(tableId, field) {
            $('#' + tableId + ' th i').each(function () {
                $(this).removeClass().addClass('icon'); // reset sort icon for columns with existing icons
            });
            if ($scope.descending)
                $('#' + tableId + ' #' + field + ' i').removeClass().addClass('icon-navigation-down');
            else
                $('#' + tableId + ' #' + field + ' i').removeClass().addClass('icon-navigation-up');
        }

        function fitToContainer(canvas) {
            canvas.style.width = '95%';
            //canvas.style.height = '100%';
            canvas.width = canvas.offsetWidth;
            //canvas.height = canvas.offsetHeight;
        }

        $scope.dateFilter = {};
        $scope.dateFilter.startDate = moment().subtract('days', 6).format('YYYY-MM-DD');
        $scope.dateFilter.endDate = moment().format('YYYY-MM-DD');
        
        settingsResource.getprofile().then(function(response) {
            $scope.profile = response.data;
            profileID = response.data.Id;

            if (profileID == null || profileID == "") {
                $location.path("/analytics/analyticsTree/edit/settings");
                return;
            }
            
            //Get chart data for monthly visit chart
            statsResource.getvisitcharts(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                var chartData = response.data;

                var canvasId = "viewMonths";
                var canvas = document.getElementById(canvasId),
                    canvasWidth = canvas.clientWidth,
                    canvasHeight = canvas.clientHeight;

                // Replace the chart canvas element
                $('#' + canvasId).replaceWith('<canvas id="' + canvasId + '" width="' + canvasWidth + '" height="' + canvasHeight + '"></canvas>');

                var options = {
                    labelTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\">"
                        + "<% for (var i=0; i<datasets.length; i++){%>"
                        + "<li><span style=\"background-color:<%=datasets[i].fillColor%>;border-color:<%=datasets[i].strokeColor%>\"></span>"
                        + "<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%>"
                        + "</ul>",
                    bezierCurve: false,
                    scaleBeginAtZero: true,
                    responsive: true
                };

                // Draw the chart / Create Line Chart
                var ctx = $('#' + canvasId).get(0).getContext("2d");
                var viewMonthsChart = new Chart(ctx).Line(chartData, options);

                // Create legend
                var legendHolder = document.createElement('div');
                legendHolder.className = "chart-legend-holder dashboard-view";
                legendHolder.innerHTML = viewMonthsChart.generateLegend();

                var helpers = Chart.helpers;
                helpers.each(legendHolder.firstChild.childNodes, function (legendNode, index) {

                    if (index == 0) {
                        var t = document.createTextNode("Visits");
                        legendNode.appendChild(t);
                        legendNode.className = "first";
                    }
                    else if (index == 1) {
                        var t = document.createTextNode("Page Views");
                        legendNode.appendChild(t);
                        legendNode.className = "second";
                    }
                });

                // ensure legend not gets added multiple times
                $(".chart-legend-holder").remove();
                viewMonthsChart.chart.canvas.parentNode.appendChild(legendHolder);
            });

            //Get Browser via statsResource - does WebAPI GET call
            statsResource.getvisits(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                $scope.views = response.data;
                $scope.loadingViews = false;

                // clear existing items
                $scope.items.length = 0;
                // push objects to items array
                angular.forEach($scope.views.Rows, function (item) {
                    $scope.items.push({
                        pagepath: item.Cells[0].Value,
                        visits: parseInt(item.Cells[1].Value),
                        pageviews: parseInt(item.Cells[2].Value)
                    });
                });

                $scope.sort = function (newSortField) {
                    if ($scope.sortField == newSortField)
                        $scope.descending = !$scope.descending;

                    // sort by new field and change sort icons
                    $scope.sortField = newSortField;
                    iconSorting("tbl-views", newSortField);
                };

                var defaultSort = "pageviews"; // default sorting
                $scope.sortField = defaultSort;
                $scope.descending = true; // most pageviews first

                // change sort icons
                iconSorting("tbl-views", defaultSort);
            });

            //Get Browser specific via statsResource - does WebAPI GET call
            statsResource.getsources(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                $scope.sources = response.data;

                // clear existing items
                $scope.itemsSources.length = 0;
                // push objects to items array
                angular.forEach($scope.sources.Rows, function (item) {
                    $scope.itemsSources.push({
                        s_source: item.Cells[0].Value,
                        s_visits: parseInt(item.Cells[1].Value),
                        s_pageviews: parseInt(item.Cells[2].Value)
                    });
                });

                $scope.sort = function (newSortField) {
                    if ($scope.sortField == newSortField)
                        $scope.descending = !$scope.descending;

                    // sort by new field and change sort icons
                    $scope.sortField = newSortField;
                    iconSorting("tbl-sources", newSortField);
                };

                var defaultSort = "s_pageviews"; // default sorting
                $scope.sortField = defaultSort;
                $scope.descending = true; // most pageviews first

                // change sort icons
                iconSorting("tbl-sources", defaultSort);
            });
            
            //Keywords
            statsResource.getkeywords(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                $scope.keywords = response.data.ApiResult;

                // clear existing items
                $scope.itemsKeywords.length = 0;
                // push objects to items array
                angular.forEach($scope.keywords.Rows, function (item) {
                    $scope.itemsKeywords.push({
                        k_keyword: item.Cells[0].Value,
                        k_visits: parseInt(item.Cells[1].Value),
                        k_pageviews: parseInt(item.Cells[2].Value)
                    });
                });

                $scope.sort = function (newSortField) {
                    if ($scope.sortField == newSortField)
                        $scope.descending = !$scope.descending;

                    // sort by new field and change sort icons
                    $scope.sortField = newSortField;
                    iconSorting("tbl-keywords", newSortField);
                };

                var defaultSort = "k_pageviews"; // default sorting
                $scope.sortField = defaultSort;
                $scope.descending = true; // most pageviews first

                // change sort icons
                iconSorting("tbl-keywords", defaultSort);
            });
        });
});