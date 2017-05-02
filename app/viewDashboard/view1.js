'use strict';

angular.module('myApp.viewDashboard', ['ngRoute'])
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'viewDashboard/view1.html',
    controller: 'View1Ctrl as ctrl'
  });
}])
.controller('View1Ctrl', ['$http', '$scope', function ($http, $scope) {
  var graphColors = ["#2ca02c", "dodgerblue"];
  $scope.coverage = '50%';
  $scope.errors = '33.2%';
  $scope.failures = '29.0%';
  $scope.total = '69.0%';
  $scope.switchStatus = true;

  $scope.getDatetime = new Date();
  $scope.days = 10;
  $scope.dayLastDeploy = 41;
  lintValues();
  testingValues();
  drawMultiBarChart('chart4', mergeData());
  drawMultiBar('chart2', deployData());
  // drawLineChart('reliable-line-chart', upTimeData());
  drawPieChart('chart1');
  drawPieChart('security-chart');
  drawPieChart('reliability-chart');
  getUpTimeData();
  function drawLineChart(div, data) {
    nv.addGraph(function () {
      var chart = nv.models.lineChart()
      .showLegend(false)
      .showYAxis(true)
      .showXAxis(true);

      chart.xAxis
      .axisLabel('x')
      .tickFormat(d3.format('.2f'));

      chart.yAxis
      .axisLabel('y')
      .tickFormat(d3.format('.2f'));

      d3.select("#" + div + " svg")
      .datum(data)
      .call(chart);

      nv.utils.windowResize(function () {
        chart.update()
      });

      return chart;
    });
  }

  function lintValues() {
    $http.get('/api/quality/steve-test').then(function (response) {
          console.log('0- quality :' + JSON.stringify(response.data, null, 2));
          $scope.lintCurrent = response.data.lint.current.issues;
          $scope.lintPrevious = response.data.lint.previous.issues;
          $scope.averageComplexity = response.data.complexity.average;
          $scope.maxComplexity = response.data.complexity.max.complexity;
        },
        function (error) {
          $scope.error = {
            'message': error.data.statusText,
            'code': error.data.status
          };
        });
  }

  function testingValues() {
    $http.get('/api/testing/steve-test').then(function (response) {
          console.log('1- testing :' + JSON.stringify(response.data, null, 2));
          $scope.testingMatrix = {
            "testCoverage": response.data.coverage,
            "functionalErrors": response.data.functional.errors,
            "functionalFailures": response.data.functional.failures,
            "functionalTotal": response.data.functional.total,
            "unitErrors": response.data.unit.errors,
            "unitFailures": response.data.unit.failures,
            "unitTotal": response.data.unit.total
          };

          console.log('$scope.testingMatrix '+JSON.stringify($scope.testingMatrix, null, 2));

        },
        function (error) {
          $scope.error = {
            'message': error.data.statusText,
            'code': error.data.status
          };
        });
  }

  function drawPieChart(div) {
    nv.addGraph(function () {
      var chart = nv.models.pieChart()
          .x(function (d) {
            return d.label
          })
          .y(function (d) {
            return d.value
          })
          .showLabels(true).color(d3.scale.graphColors().range())     //Display pie labels
          .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
          .showLegend(false)
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

  }

  function drawMultiBarChart(div, data) {
    d3.scale.graphColors = function () {
      return d3.scale.ordinal().range(graphColors);
    };
    nv.addGraph(function () {
      var chart = nv.models.discreteBarChart()
      .x(function (d) {
        return d.label
      })    //Specify the data accessors.
      .y(function (d) {
        return d.value
      })
      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
      .showValues(true).color(d3.scale.graphColors().range());
      // .showValues(true).color(d3.scale.graphColors().range());

      d3.select("#" + div + " svg")
      .datum(data)

      .call(chart);
      nv.utils.windowResize(function () {
        chart.update();         //Renders the chart when window is resized.
      });
      return chart;
    });
  }

  function drawMultiBar(div, data) {
    d3.scale.graphColors = function () {
      return d3.scale.ordinal().range(graphColors);
    };
    nv.addGraph(function () {
      var chart = nv.models.discreteBarChart()
      .x(function (d) {
        return d.label
      })    //Specify the data accessors.
      .y(function (d) {
        if (d.value.success) {
          d.value = d.value.success
        } else if (d.value.fail) {
          d.value = d.value.fail
        }
        return d.value
      })
      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
      .showValues(true).color(d3.scale.graphColors().range());
      // .showValues(true).color(d3.scale.graphColors().range());

      d3.select("#" + div + " svg")
      .datum(data)

      .call(chart);
      nv.utils.windowResize(function () {
        chart.update();         //Renders the chart when window is resized.
      });
      return chart;
    });
  }

  function deployData() {

    var testDeployArray = [{
      key: "Cumulative Return",
      values: []
    }];

    $http.get('/api/frequencies/steve-test').then(function (response) {
          console.log('2- frequencies :' + JSON.stringify(response.data, null, 2));

          // console.log('rayzor :'+JSON.stringify(response.data.test_deploys,null,2));
          // var test_deploysExample = {
          //   "2017-04-04": {'success': 3},
          //   "2017-04-05": {'success': 5},
          //   "2017-04-06": {'fail': 1}
          // };
          var myObject = response.data.test_deploys;
          var deployArray = {};
          Object.keys(myObject).map(function (key, index) {
            deployArray = {
              'label': key,
              'value': myObject[key],
              'color': getCorrectColor(myObject[key])
            };

            function getCorrectColor(key) {
              if (key.success) {
                return '#009900';
              } else {
                return '#4d94ff';
              }
            }

            testDeployArray[0].values[index] = deployArray;
          });
        },
        function (error) {
          $scope.error = {
            'message': error.data.statusText,
            'code': error.data.status
          };
        });
    return testDeployArray;
  }

  function exampleData() {
    var newArrayData = [];
    if ($scope.prodDeploysData) {
      var prod_Array = Object.values($scope.prodDeploysData);

      prod_Array.forEach(function (item) {
        if (item.success) {
          newArrayData.push({'label': 'Success', 'value': item.success})
        } else {
          newArrayData.push({'label': 'Fail', 'value': item.fail})
        }
      });
    }
    return newArrayData
  }

  function mergeData() {
    var mergeArray = [{
      key: "Cumulative Return",
      values: []
    }];

    $http.get('/api/frequencies/steve-test').then(function (response) {
          console.log('3- frequencies :' + JSON.stringify(response.data, null, 2));
          var myObject = response.data.pull_requests;
          $scope.prodDeploysData = response.data.production_deploys;
          if (response.data.pull_requests) {
            var newArrayObject = {};
            Object.keys(myObject).map(function (key, index) {
              newArrayObject = {
                'label': key,
                'value': myObject[key]
              };
              mergeArray[0].values[index] = newArrayObject;
            });
          }
        },
        function (error) {
          $scope.error = {
            'message': error.data.statusText,
            'code': error.data.status
          };
        });

    return mergeArray;
  }

  // function exampleData1() {
  //   return [
  //     {
  //       key: "Cumulative Return",
  //       values: [{
  //         "label": "2017-04-04",
  //         "value": 21
  //       }]
  //     }
  //   ];
  // }

  // function exampleData2() {

  // }

  function getLabelDate() {
    $scope.labelDate = [];
    Object.keys($scope.uptimeData).map(function (key, index) {
      if (key !== "expected") {
        $scope.labelDate.push(key);
      }
    });
    console.log('labelDate:: ' + JSON.stringify($scope.labelDate, null, 2));
    return $scope.labelDate;
  }

  function getPassFailData() {
    $scope.passFailData = [];
    Object.keys($scope.uptimeData).map(function (key, index) {
      // passFailData.push($scope.uptimeData[key]);
      if ($scope.uptimeData[key].failures) {
        $scope.passFailData.push($scope.uptimeData[key].failures);
      }
      if ($scope.uptimeData[key].successes) {
        $scope.passFailData.push($scope.uptimeData[key].successes);
      }
    });
    console.log(
        'passFailData:: ' + JSON.stringify($scope.passFailData, null, 2));
    return $scope.passFailData;
  }

  function getAverageData() {
    $scope.average = [];
    Object.keys($scope.uptimeData).map(function (key, index) {
      $scope.average.push($scope.uptimeData.expected);
    });
    console.log('average:: ' + JSON.stringify($scope.average, null, 2));
    return $scope.average;
  }

  function getUpTimeData() {
    getDateLabels();
  }

  function getDateLabels() {
    $http.get('/api/frequencies/steve-test').then(function (response) {
      console.log('4-frequencies :' + JSON.stringify(response.data, null, 2));
      $scope.uptimeData = response.data.uptime;
      var ctx = document.getElementById('myChart').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: getLabelDate(),
          // labels: $scope.labelDate,
          // labels: ['2017-04-24', '2017-04-25', '2017-04-26', '2017-04-27'],
          datasets: [{
            label: 'Up-Time',
            data: getPassFailData(),
            // data: $scope.passFailData,
            // data: [9, 150, 3, 50, 6, 30],
            backgroundColor: "rgba(77, 145, 234, 1)"
          }, {
            label: 'Average',
            data: getAverageData(),
            // data: [95.0, 95.0, 95.0, 95.0, 95.0,95.0,95.0,95.0],
            backgroundColor: "rgba(64, 109, 64, 1)"
          }]
        }
      });
    }, function (error) {
      $scope.error = error;
    });
  }
}]);

