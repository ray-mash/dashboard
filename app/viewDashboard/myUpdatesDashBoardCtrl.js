'use strict';

angular.module('app.viewDashboard', ['ngRoute'])
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/my-updates-dashboard/', {
    templateUrl: 'viewDashboard/my-updates-dashboard.html',
    controller: 'MyUpdatesDashBoardCtrl as myUpdatesCtrl'
  });
}])
.controller('MyUpdatesDashBoardCtrl',
    ['$http', '$scope', function ($http, $scope) {
      function dateFunc(firstDate) {
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var dayOne = new Date(firstDate).getTime();
        var dayTwo = new Date().getTime();
        return Math.round((dayTwo - dayOne) / oneDay);
      }

      $scope.frequencyData = undefined;
      getFrequencyData();
      var graphColors = ["#2ca02c", "dodgerblue"];
      $scope.coverage = '50%';
      $scope.errors = '33.2%';
      $scope.failures = '29.0%';
      $scope.total = '69.0%';
      $scope.switchStatus = true;

      $scope.getDatetime = new Date();
      lintValues();
      testingValues();
      // drawPieChart('security-chart', securityData());

      function getFrequencyData() {
        $http.get('/api/frequencies/steve-test').then(function (response) {
              if (response) {
                $scope.frequencyData = response.data;
                $scope.uptimeData = response.data.uptime;
                $scope.prodDeploysData = response.data.production_deploys;
                var reliabilityData = frequencyProdData();
                drawMultiBar('deploy-chart', deployData());
                drawMultiBarChart('merge-chart', mergeData());
                drawPieChart('reliability-chart', reliabilityData);
                getUpTimeData();
              }
            },
            function (error) {
              $scope.error = {
                'message': error.data.statusText,
                'code': error.data.status
              };
            });
      }

      function lintValues() {
        $http.get('/api/quality/steve-test').then(function (response) {
              // console.log('0- quality :' + JSON.stringify(response.data, null, 2));
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
              $scope.testingMatrix = {
                "testCoverage": response.data.coverage,
                "functionalErrors": response.data.functional.errors,
                "functionalFailures": response.data.functional.failures,
                "functionalTotal": response.data.functional.total,
                "unitErrors": response.data.unit.errors,
                "unitFailures": response.data.unit.failures,
                "unitTotal": response.data.unit.total
              };
            },
            function (error) {
              $scope.error = {
                'message': error.data.statusText,
                'code': error.data.status
              };
            });
      }

      function drawPieChart(div, data) {
        d3.scale.graphColors = function () {
          return d3.scale.ordinal().range(graphColors);
        };
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
          d3.select("#" + div + " svg")
          .datum(data)
          .transition().duration(350)
          .call(chart);
          return chart;
        });
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
        // console.log('inside deploy Data :' + JSON.stringify($scope.frequencyData.test_deploys, null, 2));
        var testDeployArray = [{
          key: "Cumulative Return",
          values: []
        }];
        var myObject = $scope.frequencyData.test_deploys;
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
        return testDeployArray;
      }

      function frequencyProdData() {
        // console.log('inside Production Data :' + JSON.stringify($scope.prodDeploysData, null, 2));

        var newArrayData = [];
        if ($scope.prodDeploysData) {
          var deploymentDays = [];
          var temp = 0;
          Object.keys($scope.prodDeploysData).map(function (key) {
            if (new Date(key) > new Date(temp)) {
              if ($scope.prodDeploysData[key].success) {
                deploymentDays.splice(0, deploymentDays.length);
                deploymentDays.push(key);
                temp = key;
              }
            }
          });
          $scope.numberOfDays = dateFunc(deploymentDays[0]);
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
        var myObject = $scope.frequencyData.pull_requests;
        $scope.prodDeploysData = $scope.frequencyData.production_deploys;
        if ($scope.frequencyData.pull_requests) {
          var newArrayObject = {};
          Object.keys(myObject).map(function (key, index) {
            newArrayObject = {
              'label': key,
              'value': myObject[key]
            };
            mergeArray[0].values[index] = newArrayObject;
          });
        }
        return mergeArray;
      }

      function getLabelDate() {
        $scope.labelDate = [];
        Object.keys($scope.uptimeData).map(function (key) {
          if (key !== "expected") {
            $scope.labelDate.push(key);
          }
        });
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
        return $scope.passFailData;
      }

      function getAverageData() {
        $scope.average = [];
        Object.keys($scope.uptimeData).map(function (key, index) {
          $scope.average.push($scope.uptimeData.expected);
        });
        // console.log('average:: ' + JSON.stringify($scope.average, null, 2));
        return $scope.average;
      }

      function getUpTimeData() {
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: getLabelDate(),
            datasets: [{
              label: 'Up-Time',
              data: getPassFailData(),
              backgroundColor: "rgba(77, 145, 234, 1)"
            }, {
              label: 'Average',
              data: getAverageData(),
              backgroundColor: "rgba(64, 109, 64, 1)"
            }]
          }
        });
      }
    }]);

