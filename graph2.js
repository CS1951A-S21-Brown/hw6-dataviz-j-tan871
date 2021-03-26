let svg2 = d3.select('#graph2')
  .append('svg')
  .attr("width", graph_2_width)
  .attr("height", graph_2_height)
  .append("g")
  .attr("transform", `translate(${graph_2_width / 2}, ${graph_2_height / 2})`);

let title2 = svg2.append('text')
  .attr('transform',  `translate(${0}, ${(-graph_2_height / 2) + 15})`)
  .style('text-anchor', 'middle')
  .style('font-size', 20)
  .text('Average Runtime of Movies on Netflix from 1942-2020')

var innerRadius = 120;
var outerRadius = Math.min(graph_2_width, graph_2_height) / 2;

function cleanData2(data) {
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

function setData2() {
  d3.csv('./data/netflix.csv').then(function (data) {
    data = cleanData2(data)
    console.log(data.length);

    var x = d3.scaleBand()
      .domain(data.map(d => d.release_year))
      .range([0, 2 * Math.PI])
      .align(0);

    var maxCount = d3.max(data, d => d.duration);

    var y = d3.scaleLinear()
      .domain([0, maxCount])
      .range([innerRadius, outerRadius]);
    
    let color = d3.scaleOrdinal()
      .domain(data.map(function(d) { return d.release_year }))
      .range(d3.quantize(d3.interpolateHcl("#4600ff", "#c8b3ff"), 70));

    let bars = svg2.append('g') 
      .selectAll('path')
      .data(data)

    bars.enter()
      .append('path')
        .attr('fill', d => color(d.release_year))
        .attr('d', d3.arc()
          .innerRadius(innerRadius)
          .outerRadius(d => y(d.duration))
          .startAngle(d => x(d.release_year))
          .endAngle(d => x(d.release_year) + x.bandwidth())
          .padAngle(0.04)
          .padRadius(innerRadius))

    bars.enter()
      .append('g')
        .attr('text-anchor', d => (x(d.release_year) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? 'end' : 'start')
        .attr('transform', d => `rotate(${(x(d.release_year) + x.bandwidth() / 2) * 180 / Math.PI - 90}) translate(${y(d.duration) + 10}, 0)`)
      .append('text')
        .text(d => `${d.release_year} (${parseInt(d.duration)})`)
        .attr('transform', d => (x(d.release_year) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? 'rotate(180)' : 'rotate(0)')
        .style('font-size', '11px')
        .attr('alignment-baseline', 'middle')
  })
}

//return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; }

setData2();