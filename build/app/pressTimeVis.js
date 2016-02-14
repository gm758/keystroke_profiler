function createTestData() {
  const alph = _.range(48, 91).map(code => String.fromCharCode(code));
  const obj = {};
  let i = 0;
  while (i < 10) {
    alph.reduce((a,b) => {
      return a[b] ? a[b].push(Math.random()) : a[b] = [Math.random]
    }, obj);    
    i++;
  };
  return JSON.stringify(obj);
}


const width = 960;
const height = 500;
//todo: add margins

const y = d3.scale
            .linear()
            .range([height, 0]);

const x = d3.scale
            .linear().range([0, width], 0.1);


const chart = d3.select('#chart')
                .append('svg') //may be unnecessary
                .attr('width', width)
                .attr('height', height);

const xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom');

const yAxis = d3.svg.axis()
                    .scale(y)
                    .orient('left');

function avg(arr) {
  return arr.reduce((a,b) => +a + +b) / arr.length;
}


d3.json(createTestData(), (error, data) => {
  let dataEntries = d3.entries(data);
  x.domain(dataEntries.map(d => d.key));
  y.domain([0, d3.max(dataEntries, d => avg(d.value))]);
  let bar = chart.selectAll('g')
                  .data(dataEntries)
                  .enter()
                  .append('g');
  bar.append('rect')
      .attr('y', d => y(avg(d.value)))
      .attr('x', (d, i) => x.rangeBand()) //todo: add margins
      .attr('height', d => height - y(avg(d.value)))
      .attr('width', x.rangeBand());

  chart.append('g')
      .attr('class', 'x axis')
      .call(xAxis);

  chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('y', 6);
        .attr('dy', '0.71em')
        .style('text-anchor', 'end')
        .text('Average Time');
});





