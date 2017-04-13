'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
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
.controller('View1Ctrl', ['$http', function($http) {

  drawChart('chart2');
  function drawChart(div) {
    // var width = 400; var height = 400;
    // $http.get('/frequencies/deploy').then(function (response) {
    $http.post('/frequencies/deploy').then(function (response) {
      console.log(response);
    },
    function(error){
      console.log(error);
    });


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
      nv.utils.windowResize(chart.update);
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
              "value": 0
            }, {
              "label": "2017-03-04",
              "value": 3
            }, {
              "label": "2017-02-04",
              "value": 19
            }]
      }
    ];
  }
}]);