function avg(arr) {
  return arr.reduce((a,b) => +a + +b) / arr.length;
}

function processPressTimes(obj) {
  const results = [];
  _.each(obj, (value, key) => {
    results.push({key, value: avg(value)*100});
  });
  return results;
}

function createTestData() {
  const alph = _.range(48, 91).map(code => String.fromCharCode(code));
  const obj = {};
  let i = 0;
  while (i < 10) {
    alph.reduce((a,b) => {
      a[b] ? a[b].push(Math.random()) : a[b] = [Math.random()];
      return a;
    }, obj);    
    i++;
  };
  return JSON.stringify(obj);
}

let data = createTestData();
let dataEntries = processPressTimes(JSON.parse(data));

var margin ={top:20, right:30, bottom:30, left:40},
    width=960-margin.left - margin.right, 
    height=500-margin.top-margin.bottom;

// scale to ordinal because x axis is not numerical
var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

//scale to numerical value by height
var y = d3.scale.linear().range([height, 0]);

var chart = d3.select("#chart")  
              .append("svg")  //append svg element inside #chart
              .attr("width", width+(2*margin.left)+margin.right)    //set width
              .attr("height", height+margin.top+margin.bottom);  //set height
var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");  //orient bottom because x-axis will appear below the bars

var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left");

x.domain(dataEntries.map(d => d.key));
y.domain([0, d3.max(dataEntries, d => d.value)]);

var bar = chart.selectAll("g")
                  .data(dataEntries)
                  .enter()
                  .append("g")
                  .attr("transform", (d, i) => "translate("+x(d.key)+", 0)");

bar.append("rect")
    .attr("y", d => y(d.value))
    .attr("x", (d,i) => x.rangeBand()+(margin.left/4))
    .attr("height", d => height - y(d.value))
    .attr("width", x.rangeBand());  //set width base on range on ordinal data

chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate("+margin.left+","+ height+")")        
      .call(xAxis);

chart.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+margin.left+",0)")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Average Press Time");
      