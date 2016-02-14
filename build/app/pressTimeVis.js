const width = 960;
const height = 500;

const y = d3.scale
            .linear()
            .range([height, 0]);

const chart = d3.select(".chart")
                .attr("width", width);
                .attr("height", height);


