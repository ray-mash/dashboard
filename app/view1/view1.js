'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
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
var data = {
  "application": "steve-test",
  "pull_request_id": "1"
};
  $scope.days = 10;
  $http.get('/api/frequencies/deploy').then(function (response) {
        console.log(response);
      },
      function(error){
        console.log(error);
      });

  // $scope.dayLastDeploy = 41;
  drawCalendar('chart5');
  drawChart('chart2');
  // console.log($scope.dayLastDeploy);
  drawMultiBarChart('chart4');
  drawPieChart('chart1');


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
  function drawChart(div) {
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
  function exampleData() {
    return  [
      {
        key: "Cumulative Return",
        values:
            [{
              "label": "2017-04-04",
              "value": 21
            }, {
              "label": "2017-04-05",
              "value": 10
            },{
              "label": "2017-02-04",
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
}]);