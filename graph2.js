let svg2 = d3.select('#graph2')
  .append('svg')
  .attr("width", graph_2_width)
  .attr("height", graph_2_height)
  .append("g")
  .attr("transform", `translate(${graph_2_width / 2}, ${graph_2_height / 2})`);

var innerRadius = 75;
var outerRadius = Math.min(graph_2_width, graph_2_height) / 2;

function cleanData(data) {
  runtimeData = {}
  data.forEach(d => {
    if (d.type === 'Movie') {
      if (runtimeData[d.release_year]) {
        runtimeData[d.release_year]['total'] += parseInt(d['duration'].slice(0, -4));
        runtimeData[d.release_year]['num_movies'] += 1
      } else {
        runtimeData[d.release_year] = {}
        runtimeData[d.release_year]['total'] = parseInt(d['duration'].slice(0, -4));
        runtimeData[d.release_year]['num_movies'] = 1
      }
    }
  });

  for (var key in runtimeData) {
    runtimeData[key] = parseFloat(runtimeData[key]['total']) / parseFloat(runtimeData[key]['num_movies'])
  }

  result = []
  for (const key in runtimeData) {
    result.push({
      release_year: key, 
      duration: runtimeData[key]
    })
  }

  return result;
}

function setData() {
  d3.csv('./data/netflix.csv').then(function (data) {
    data = cleanData(data)
    console.log(data);

    var x = d3.scaleBand()
      .domain(data.map(d => d.release_year))
      .align(0)
      .range([0, 2 * Math.PI]);

    var maxCount = d3.max(data, d => d.duration);

    var y = d3.scaleLinear()
      .domain([0, maxCount])
      .range([innerRadius, outerRadius]);

    let bars = svg2.append('g') 
      .selectAll('path')
      .data(data)

    bars.enter()
      .append('path')
        .attr('fill', '#69b3a2')
        .attr('d', d3.arc()
          .innerRadius(innerRadius)
          .outerRadius(d => y(d.duration))
          .startAngle(d => x(d.release_year))
          .endAngle(d => x(d.release_year) + x.bandwidth())
          .padAngle(0.01)
          .padRadius(innerRadius))
  })
}

setData();