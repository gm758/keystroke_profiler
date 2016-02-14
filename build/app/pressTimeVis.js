'use strict';

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
  return JSON.stringify(obj);
}

var width = 960;
var height = 500;
//todo: add margins

var y = d3.scale.linear().range([height, 0]);

var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);

var chart = d3.select('#chart').append('svg') //may be unnecessary
.attr('width', width).attr('height', height);

var xAxis = d3.svg.axis().scale(x).orient('bottom');

var yAxis = d3.svg.axis().scale(y).orient('right');

function avg(arr) {
  return arr.reduce(function (a, b) {
    return +a + +b;
  }) / arr.length;
}

function processPressTimes(obj) {
  var results = [];
  _.each(obj, function (value, key) {
    results.push({ key: key, value: avg(value) * 100 });
  });
  return results;
}

var data = createTestData();
var dataEntries = processPressTimes(JSON.parse(data));

x.domain(dataEntries.map(function (d) {
  return d.key;
}));
y.domain([0, d3.max(dataEntries, function (d) {
  return d.value;
})]);
var bar = chart.selectAll('g').data(dataEntries).enter().append('g');

console.log(x.rangeBand());
bar.append('rect').attr('y', function (d) {
  return y(d.value);
}).attr('x', function (d, i) {
  return x.rangeBand() * i;
}) //todo: add margins
.attr('height', function (d) {
  return height - y(d.value);
}).attr('width', x.rangeBand());

chart.append('g').attr('class', 'x axis').attr('transform', 'translate(-5, ' + height + ')').call(xAxis);

chart.append('g').attr('class', 'y axis').attr('transform', 'translate(0,0)').call(yAxis).append('text').attr('y', 6).attr('dy', '0.71em').style('text-anchor', 'end').text('Average Time');