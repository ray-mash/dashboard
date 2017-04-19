'use strict';

angular.module('myApp.viewDashboard', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'viewDashboard/view1.html',
    controller: 'View1Ctrl as ctrl'
  });
}])


// var config = {
//   headers : {
//     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
//   }
// }
//
// $http.post('/ServerRequest/PostDataResponse', data, config)
// .success(function (data, status, headers, config) {
//   $scope.PostDataResponse = data;
// })
// .error(function (data, status, header, config) {
//   $scope.ResponseDetails = "Data: " + data +
//       "<hr />status: " + status +
//       "<hr />headers: " + header +
//       "<hr />config: " + config;
// });
.controller('View1Ctrl', ['$http','$scope', function($http,$scope) {

  $scope.getDatetime = new Date();
// var data = {
//   "application": "steve-test",
//   "pull_request_id": "1"
// };
  $scope.days = 10;
  $http.get('/api/frequencies/deploy').then(function (response) {
        console.log(response);
      },
      function(error){
        console.log(error);
      });

  $scope.dayLastDeploy = 41;
  drawCalendar('chart5');
  // drawChart('chart2');
  // console.log($scope.dayLastDeploy);
  drawMultiBarChart('chart4');
  drawPieChart('chart1');
  drawPieChart('security-chart');
  drawPieChart('reliability-chart');
  drawCumulativeChart('reliability-line-chart');
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
          key: "Passed",
          color: "#51A351",
          values: [
            {x: "A", y: 40},
            {x: "B", y: 30},
            {x: 5, y: 20}
          ]
        },
        {
          key: "Failed",
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
  function drawCalendar(div){
    nv.addGraph(function () {
      var chart = nv.models.discreteBarChart()
      // .x(function(d) { return d.label })    //Specify the data accessors.
      .y(function(d) { return d.value })
      .staggerLabels(false)    //Too many bars and not enough room? Try staggering labels.
      // .tooltips(false)        //Don't show tooltips
      .showValues(false);       //...instead, show the bar value right on top of each bar.
      // .transitionDuration(350);

      d3.select("#" + div + " svg")
      .datum( exampleData1())
      // .datum( $scope.dayLastDeploy)
      .call(chart);
      nv.utils.windowResize(function() {
        chart.update();         //Renders the chart when window is resized.
      });
      return chart;
    });
    // $scope.dayLastDeploy = 41;
  }
  function drawPieChart(div) {
//Donut chart example
    nv.addGraph(function() {
      var chart = nv.models.pieChart()
          .x(function(d) { return d.label })
          .y(function(d) { return d.value })
          .showLabels(true)     //Display pie labels
          .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
          .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
          .donut(false)          //Turn on Donut mode. Makes pie chart look tasty!
          .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
          ;
      // d3.select("#chart1 svg")
      d3.select("#" + div + " svg")
      .datum(exampleData())
      .transition().duration(350)
      .call(chart);
      return chart;
    });

//Pie chart example data. Note how there is only a single array of key-value pairs.
    function exampleData() {
      return  [
        {
          "label": "Passed",
          "value" : 29.765957771107
        } ,
        {
          "label": "Failed",
          "value" : 102
        }
      ];
    }
  }
  // function drawChart(div) {
  //   // var width = 400; var height = 400;
  //   // $http.get('/frequencies/deploy').then(function (response) {
  //   // $http.post('/frequencies/deploy').then(function (response) {
  //   //   console.log(response);
  //   // },
  //   // function(error){
  //   //   console.log(error);
  //   // });
  //
  //
  //   nv.addGraph(function () {
  //     var chart = nv.models.discreteBarChart()
  //         .x(function(d) { return d.label })    //Specify the data accessors.
  //         .y(function(d) { return d.value })
  //         .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
  //         // .tooltips(false)        //Don't show tooltips
  //         .showValues(true);       //...instead, show the bar value right on top of each bar.
  //         // .transitionDuration(350);
  //
  //     d3.select("#" + div + " svg")
  //     .datum(exampleData())
  //     .call(chart);
  //     nv.utils.windowResize(function() {
  //       chart.update();         //Renders the chart when window is resized.
  //     });
  //     return chart;
  //   });
  // }
  function drawMultiBarChart(div) {
    // var width = 400; var height = 400;
    // $http.get('/frequencies/deploy').then(function (response) {
    // $http.post('/frequencies/deploy').then(function (response) {
    //   console.log(response);
    // },
    // function(error){
    //   console.log(error);
    // });


    nv.addGraph(function () {
      var chart = nv.models.discreteBarChart()
          .x(function(d) { return d.label })    //Specify the data accessors.
          .y(function(d) { return d.value })
          .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
          // .tooltips(false)        //Don't show tooltips
          .showValues(true);       //...instead, show the bar value right on top of each bar.
          // .transitionDuration(350);

      d3.select("#" + div + " svg")
      .datum(exampleData())
      .call(chart);
      nv.utils.windowResize(function() {
        chart.update();         //Renders the chart when window is resized.
      });
      return chart;
    });
  }
  function drawCumulativeChart(div) {
    nv.addGraph(function() {
      var chart = nv.models.lineChart()
          .margin({left: 150})  //Adjust chart margins to give the x-axis some breathing room.
          .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
          // .transitionDuration(350)  //how fast do you want the lines to transition?
          .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
          .showYAxis(true)        //Show the y-axis
          .showXAxis(true)        //Show the x-axis
          ;

      chart.xAxis     //Chart x-axis settings
      .axisLabel('UPTIME')
      .tickFormat(d3.format(',r'));

      chart.yAxis     //Chart y-axis settings
      // .axisLabel('Voltage (v)')
      .tickFormat(d3.format('.02f'));

      /* Done setting the chart up? Time to render it!*/
      var myData = exampleData2();   //You need data...

      d3.select("#" + div + " svg")
      // d3.select('#chart svg')    //Select the <svg> element you want to render the chart in.
      .datum(myData)         //Populate the <svg> element with chart data...
      .call(chart);          //Finally, render the chart!

      //Update the chart when window resizes.
      nv.utils.windowResize(function() { chart.update() });
      return chart;
    });
  }
  function exampleData() {
    return  [
      {
        key: "Cumulative Return",
        values:
            [{
              "label": "2017-03-04",
              "value": 21
            }, {
              "label": "2017-04-05",
              "value": 10
            },{
              "label": "2017-04-04",
              "value": 19
            }]
      }
    ];
  }
  function exampleData1() {
    return  [
      {
        key: "Cumulative Return",
        values:
            [{
              "label": "2017-04-04",
              "value": 21
            }]
      }
    ];
  }
  function exampleData2() {

    // function sinAndCos() {
    //   var sin = [],sin2 = [],
    //       cos = [];
    //
    //   //Data is represented as an array of {x,y} pairs.
    //   for (var i = 0; i < 100; i++) {
    //     sin.push({x: i, y: Math.sin(i/10)});
    //     sin2.push({x: i, y: Math.sin(i/10) *0.25 + 0.5});
    //     cos.push({x: i, y: .5 * Math.cos(i/10)});
    //   }
    return [
      {
        values: [{'x':412,'y':42}],      //values - represents the array of {x,y} data points
        key: 'Uptime Waves', //key  - the name of the series.
        color: '#ff7f0e'  //color - optional: choose your own line color.
      },
      {
        values: [{'x':42,'y':12}]
      }
    ];
  }
}]);