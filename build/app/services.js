'use strict';

angular.module('profiler.services', []).factory('AJAX', function ($http) {
  var getPrompt = function getPrompt() {
    return $http({
      method: 'GET',
      url: '/api/prompts'
    }).then(function (res) {
      return res.data;
    });
  };

  var saveTransitions = function saveTransitions(data) {
    return $http({
      method: 'POST',
      url: '/api/transitions',
      data: data
    });
  };

  var getTransitions = function getTransitions() {
    return $http({
      method: 'GET',
      url: '/api/transitions'
    }).then(function (res) {
      return res.data;
    });
  };

  var savePressTimes = function savePressTimes(data) {
    return $http({
      method: 'POST',
      url: '/api/pressTimes',
      data: data
    });
  };

  var getPressTimes = function getPressTimes() {
    return $http({
      method: 'GET',
      url: '/api/pressTimes'
    }).then(function (res) {
      return res.data;
    });
  };

  return {
    getPrompt: getPrompt,
    saveTransitions: saveTransitions,
    getTransitions: getTransitions,
    savePressTimes: savePressTimes,
    getPressTimes: getPressTimes
  };
}).factory('Graph', function () {
  var generatePressGraph = function generatePressGraph(data) {

    function avg(arr) {
      return arr.reduce(function (a, b) {
        return +a + +b;
      }) / arr.length;
    } //Dry relative to fn below

    function processPressTimes(obj) {
      var results = [];
      _.each(obj, function (value, key) {
        results.push({ key: key, value: avg(value) });
      });
      return results;
    }

    function createTestData() {
      var alph = _.range(48, 91).map(function (code) {
        return String.fromCharCode(code);
      });
      var obj = {};
      var i = 0;
      while (i < 10) {
        alph.reduce(function (a, b) {
          a[b] ? a[b].push(Math.random()) : a[b] = [Math.random()];
          return a;
        }, obj);
        i++;
      };
      return obj;
    }

    data = data || createTestData();
    var dataEntries = processPressTimes(data);
    dataEntries = dataEntries.sort(function (a, b) {
      return a.key.localeCompare(b.key);
    });

    var margin = { top: 20, right: 30, bottom: 30, left: 40 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // scale to ordinal because x axis is not numerical
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

    //scale to numerical value by height
    var y = d3.scale.linear().range([height, 0]);

    var chart = d3.select("#chart").append("svg") //append svg element inside #chart
    .classed('pressChart', true).attr("width", width + 2 * margin.left + margin.right) //set width
    .attr("height", height + margin.top + margin.bottom); //set height

    var xAxis = d3.svg.axis().scale(x).orient("bottom"); //orient bottom because x-axis will appear below the bars

    var yAxis = d3.svg.axis().scale(y).orient("left");

    console.log('data', dataEntries.map(function (d) {
      return d.key;
    }));
    x.domain(dataEntries.map(function (d) {
      return d.key;
    }));
    y.domain([0, d3.max(dataEntries, function (d) {
      return d.value;
    })]);

    var bar = chart.selectAll("g").data(dataEntries).enter().append("g").attr("transform", function (d, i) {
      return "translate(" + x(d.key) + ", 0)";
    });

    bar.append("rect").attr("y", function (d) {
      return y(d.value);
    }).attr("x", function (d, i) {
      return x.rangeBand() + margin.left / 4;
    }).attr("height", function (d) {
      return height - y(d.value);
    }).attr("width", x.rangeBand()); //set width base on range on ordinal data

    chart.append("g").attr("class", "x axis").attr("transform", "translate(" + margin.left + "," + height + ")").call(xAxis);

    chart.append("g").attr("class", "y axis").attr("transform", "translate(" + margin.left + ",0)").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Average Press Time");
  };

  var generateTransitionGraph = function generateTransitionGraph(data) {
    //create test data generating fn

    function avg(arr) {
      return arr.reduce(function (a, b) {
        return +a + +b;
      }) / arr.length;
    }

    function proccessTransitions(obj) {
      //clean up this code
      var result = [];
      _.each(obj, function (value, keyFrom) {
        _.each(value, function (value, keyTo) {
          result.push({ keyFrom: keyFrom, keyTo: keyTo, value: avg(value) });
        });
      });
      return result;
    }

    var transitionData = proccessTransitions(data);
    console.log(transitionData);
    var margin = { top: 50, right: 0, bottom: 100, left: 30 };
    var width = 600 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;
    var gridSize = Math.floor(width / 26);
    var legendElementWidth = gridSize * 2;
    var buckets = 9; //number of color buckets. TODO: increase, update color scheme
    var colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"];
    var characters = _.range(48, 91).map(function (charCode) {
      return String.fromCharCode(charCode);
    });

    var svg = d3.select('#transitionChart').append('svg').classed('transitionChart', true).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    var ylabels = svg.selectAll('.ylabel').data(characters).enter().append('text').text(function (d) {
      return d;
    }).attr('x', 0).attr('y', function (d, i) {
      return i * gridSize;
    }).style('text-anchor', 'end').attr('transform', 'translate(-6, ' + gridSize / 1.5 + ')');

    var xlabels = svg.selectAll('.xlabel').data(characters).enter().append('text').text(function (d) {
      return d;
    }).attr('x', function (d, i) {
      return i * gridSize;
    }).attr('y', 0).style('text-anchor', 'end').attr('transform', 'translate(' + gridSize / 2 + ', -6)');

    var colorScale = d3.scale.quantile().domain([0, buckets - 1, d3.max(transitionData, function (d) {
      return d.value;
    })]).range(colors);

    var transitions = svg.selectAll('.transition').data(transitionData, function (d) {
      return d.keyFrom + ':' + d.keyTo;
    });

    transitions.append('title');

    transitions.enter().append('rect').attr('x', function (d) {
      return (d.keyFrom.toUpperCase().charCodeAt(0) - 65) * gridSize;
    }).attr('y', function (d) {
      return (d.keyTo.toUpperCase().charCodeAt(0) - 65) * gridSize;
    }).attr('rx', 4).attr('ry', 4).attr('width', gridSize).attr('height', gridSize).style('fill', colors[0]);

    transitions.transition().duration(1000).style('fill', function (d) {
      return colorScale(d.value);
    });

    transitions.select('title').text(function (d) {
      return d.value;
    });

    var legend = svg.selectAll('.legend').data([0].concat(colorScale.quantiles()), function (d) {
      return d;
    });

    legend.enter().append('g').attr('class', 'legend');

    legend.append('rect').attr('x', function (d, i) {
      return legendElementWidth * i;
    }).attr('y', height).attr('width', legendElementWidth).attr('height', gridSize / 2).style('fill', function (d, i) {
      return colors[i];
    });

    legend.append('text').text(function (d) {
      return '≥  ' + Math.round(d);
    }).attr('x', function (d, i) {
      return legendElementWidth * i;
    }).attr('y', height + gridSize);

    legend.exit().remove();
  };

  return {
    generatePressGraph: generatePressGraph,
    generateTransitionGraph: generateTransitionGraph
  };
});