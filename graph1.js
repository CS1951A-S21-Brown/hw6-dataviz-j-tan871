let svg = d3.select('#graph1')
  .append('svg')
  .attr('width', graph_1_width)
  .attr('height', graph_1_height)
  .append('g')
  .attr('transform', `translate(${margin.left + 40}, ${margin.top})`);

let countRef = svg.append('g');

let y_axis_label = svg.append('g');

let title = svg.append('text')
  .attr('transform',  `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-20})`)
  .style('text-anchor', 'middle')
  .style('font-size', 20)

let y_axis_text = svg.append("text")
  .attr('transform', `translate(${0 - margin.left + margin.right - 70}, ${(graph_1_height - margin.top - margin.bottom) / 2})`)       
  .style('text-anchor', 'middle')
  .text('Number of Titles')

function setData1(type) {
  d3.csv('./data/netflix.csv').then(function (data) {
    if (type === 'top') {
      data = cleanData1(data).slice(0, 10);
    } else {
      data = cleanData1(data);
      data = data.slice(data.length - 10, data.length);
    }
    
    var maxCount = d3.max(data, (d, i) => d.count);
    
    let x = d3.scaleLinear()
      .domain([0, maxCount])
      .range([0, graph_1_width - margin.left - margin.right]);

    let y = d3.scaleBand()
      .domain(data.map((d => d.genre)))
      .range([graph_1_height - margin.top - margin.bottom, 0])
      .padding(0.1);

      y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let color = d3.scaleOrdinal()
      .domain(data.map(function(d) { return d.genre }))
      .range(d3.quantize(d3.interpolateHcl("#7842ff", "#c8b3ff"), 10));

    let bars = svg.selectAll("rect").data(data);

    bars.enter()
      .append("rect")
      .merge(bars)
      .transition()
      .duration(1000)
      .attr("fill", d => color(d.genre)) 
      .attr("x", x(0))
      .attr("y", d => y(d.genre))           
      .attr("width", d => x(d.count))
      .attr("height", y.bandwidth());    
      
    let counts = countRef.selectAll("text").data(data);

    counts.enter()
      .append("text")
      .merge(counts)
      .transition()
      .duration(1000)
      .attr("x", d => x(d.count) + 10)    
      .attr("y", d => y(d.genre) + 12)       
      .style("text-anchor", "start")
      .text(d => d.count);           

    title.text(type === 'top' ? 'Top 10 Movie and TV Show Genres on Netflix' : 'Bottom 10 Movie and TV Show Genres on Netflix')
      bars.exit().remove();
      counts.exit().remove();
  });  
}

function cleanData1(data) {
  genres = {};

  data.forEach(d => {
    gen = d.listed_in.split(",");
    for (let i = 0; i < gen.length; i++) {
      let category = gen[i].trim();
      if (!genres[category]) {
        genres[category] = 1;
      } else {
        genres[category] += 1;
      }
    }
  });
  return convertToArray(genres);
}

function compare(a, b) {
  if (a.count > b.count) {
    return -1;
  }

  if (a.count < b.count) {
    return 1;
  }

  return 0;
}

function convertToArray(data) {
  genres = []
  for (const key in data) {
    genres.push({
      genre: key, 
      count: data[key]
    });
  }
  return genres.sort(compare);
}

setData1('top');