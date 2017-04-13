angular.module('myApp')
.component('chartComponent', {
  template : '<div id="chart2"" class="col-xs-5 col-md-3" style="border: solid;"> <h3>My Chart 2 las</h3><svg></svg>  </div>',
  bindings : {data : '='},
  controller : function () {

    drawChart('chart2');
    function drawChart(div) {
      // var width = 400; var height = 400;

      nv.addGraph(function () {
        var chart = nv.models.discreteBarChart()
        .x(function(d) { return d.label })    //Specify the data accessors.
        .y(function(d) { return d.value })
        .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
        // .tooltips(false)        //Don't show tooltips
        .showValues(true);       //...instead, show the bar value right on top of each bar.
        // .transitionDuration(350);
var data = exampleData();
        d3.select("#" + div + " svg")
        .datum(data)
        // .datum(exampleData())
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
  }
});