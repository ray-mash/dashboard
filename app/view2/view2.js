'use strict';

angular.module('myApp.view2', ['nvd3','ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', [ function() {

  drawChart('chart1',300,200);
  drawChart('chart4',150,300);
  drawChart('chart3',200,200);

  function drawChart(div, localHeight, localWidth) {
    var width = localWidth; var height = localHeight;

    nv.addGraph(function () {
      var chart = nv.models.pieChart()
      .x(function (d) {
        return d.label
      }).y(function (d) {
        return d.value
      }).width(width)
      .height(height)
      .showLabels(true)
      .labelThreshold(.05)
      .labelType("percent")
      .donut(false);

      d3.select("#" + div + " svg")
      .datum(exampleData())
      .attr('width', width).attr('height', height)
      .transition().duration(350)
      .call(chart);

      return chart;
    });
  }
  function exampleData() {
    return [{
      "label": "One",
      "value": 219.765957771107
    }, {
      "label": "Two",
      "value": 0
    }, {
      "label": "Three",
      "value": 312.807804682612
    }, {
      "label": "Four",
      "value": 196.45946739256
    }, {
      "label": "Five",
      "value": 0.19434030906893
    }, {
      "label": "Six",
      "value": 918.079782601442
    }, {
      "label": "Seven",
      "value": 133.925743130903
    }, {
      "label": "Eight",
      "value": 534.1387322875705
    }];
  }

}]);

