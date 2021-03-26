var svg3 = d3.select('#graph3')
  .append('svg')
  .attr('width', graph_3_width + margin.left + margin.right)
  .attr('height', graph_3_height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left * 2}, ${margin.top})`);

var title3 = svg3.append('text')
  .attr('transform',  `translate(${(graph_3_width - margin.left - margin.right) / 2}, ${-20})`)
  .style('text-anchor', 'middle')
  .style('font-size', 20)
  .text('Actor Collaborations in Netflix TV Shows and Movies from 1960-1970')

var tooltipVisible = false

var tooltip = d3.select('#graph3')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0)

const onClick = d => {
  let html = `<span>${d.name} | ${actorToMovie[d.name]}</span>`
  tooltip.html(html)
    .transition()
    .duration(100)
    .style('left', `${(d3.event.pageX) - 725}px`)
    .style('top', `${(d3.event.pageY) - 100}px`)
    .style('opacity', 0.9)

  setTimeout(() => (tooltip.transition()
  .duration(500)
  .style('opacity', 0)), 1000)
}

function getRandomId(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function findCombinations(arr, nodes, combinations, nodesSwitched) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      combinations.push({
        source: arr[i].trim(),
        target: arr[j].trim()
      });
    }
    if (!nodes[arr[i].trim()]) {
      id = getRandomId(100000);
      nodes[arr[i].trim()] = id;
    }
  }

  return combinations;
}

function cleanData3(data) {
  listActors = []
  nodes = []
  nodesSwitched = []
  links = []
  actorToMovieInt = {}
  actorToMovie = {}

  data.forEach(d => {
    if (parseInt(d.release_year) < 1970 && parseInt(d.release_year) > 1960) {
      listActors.push(d.cast.split(','));
      actorToMovieInt[d.title + ` (${d.release_year})`] = d.cast.split(',');
    }
  });

  for (var key in actorToMovieInt) {
    actorToMovieInt[key].map(arr => {
      if (!actorToMovie[arr.trim()]) {
        actorToMovie[arr.trim()] = key
      } else {
        actorToMovie[arr.trim()] += ' & ' + key;
      }
    })
  }

  listActors.map(d => {
    links = findCombinations(d, nodes, links, nodesSwitched);
  });

  links.map(d => {
    sourceId = nodes[d.source];
    outputId = nodes[d.target];
    d.source = sourceId;
    d.target = outputId;
  });

  return {
    links,
    nodesReversed: nodes,
    actorToMovie
  };
}

d3.csv('./data/netflix.csv').then(function (data) {
  data = cleanData3(data);

  data.nodes = []

  for (var key in data.nodesReversed) {
    data.nodes.push({
      id: data.nodesReversed[key],
      name: key
    })
  }

  var link = svg3
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .style("stroke", "#aaa")

  var node = svg3
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("r", 5)
    .style("fill", "#7842ff")
    .on('mouseover', onClick)
  
    node.append("title")
    .text(d => d.id);

  var simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink()
      .id(d => d.id)
      .distance('25')
      .links(data.links))
    .force('charge', d3.forceManyBody().strength(-50))
    .force('collide', d3.forceCollide()
      .radius(17))
    .force('x', d3.forceX()
      .strength(0.075)
      .x((graph_3_width - margin.left - margin.right) / 2))
    .force('y', d3.forceY()
      .strength(0.075)
      .y((graph_3_height - margin.top) / 2))
    .on('tick', ticked);

  function ticked() {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d=> d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

    node  
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
  }
});