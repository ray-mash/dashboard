'use strict';

angular.module('myApp.view2', ['nvd3','ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', [ function() {

  drawStackedChart('chart2');
  function drawStackedChart(div) {
    nv.addGraph(function () {
      var chart = nv.models.multiBarChart();

      chart.xAxis
      .tickFormat(d3.format(',f'));

      chart.yAxis
      .tickFormat(d3.format(',.1f'));

      d3.select("#" + div + " svg")
      .datum([
        {
          key: "S1",
          color: "#51A351",
          values: [
            {x: "A", y: 40},
            {x: "B", y: 30},
            {x: 5, y: 20}
          ]
        },
        {
          key: "S2",
          color: "#BD362F",
          values: [
            {x: "A", y: 60},
            {x: "B", y: 50},
            {x: 5, y: 70}
          ]
        }
      ])
      .transition().duration(500).call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });
  }

}]);



