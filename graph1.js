let svg = d3.select("#graph1")
  .append("svg")
  .attr("width", graph_1_width)
  .attr("height", graph_1_height)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

let countRef = svg.append("g");

function setData1() {
  d3.csv('./data/netflix.csv').then(function (data) {
    data = cleanData1(data).slice(0, 10);
      
    var maxCount = d3.max(data, (d, i) => d.count);

    console.log(maxCount);
    
    let x = d3.scaleLinear()
      .domain([0, maxCount])
      .range([0, graph_1_width - margin.left - margin.right]);

    let y = d3.scaleBand()
      .domain(data.map((d => d.genre)))
      .range([graph_1_height - margin.top - margin.bottom, 0])
      .padding(0.1);

    svg.append("g")
      .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let color = d3.scaleOrdinal()
      .domain(data.map(function(d) { return d.genre }))
      .range(d3.quantize(d3.interpolateHcl("#7842ff", "#c8b3ff"), 10));

    let bars = svg.selectAll("rect").data(data);

    bars.enter()
      .append("rect")
      .merge(bars)
      .attr("fill", d => color(d.genre)) 
      .attr("x", x(0))
      .attr("y", d => y(d.genre))           
      .attr("width", d => x(d.count))
      .attr("height", y.bandwidth());    
      
      let counts = countRef.selectAll("text").data(data);

      counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", d => x(d.count) + 10)       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        .attr("y", d => y(d.genre) + 12)       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
        .style("text-anchor", "start")
        .text(d => d.count);           // HINT: Get the name of the artist
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

setData1();