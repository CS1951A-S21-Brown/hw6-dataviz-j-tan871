var svg3 = d3.select("#graph3")
  .append("svg")
  .attr("width", graph_3_width + margin.left + margin.right)
  .attr("height", graph_3_height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

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

  // console.log(data);

  data.forEach(d => {
    if (parseInt(d.release_year) < 1970 && parseInt(d.release_year) > 1960) {
      listActors.push(d.cast.split(','));
    }
  });

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
    nodesReversed: nodes
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
    // data.nodes[data.nodesReversed[key]] = key;
  }


  console.log(data.nodes);
  console.log(data.links);

  // Initialize the links
  var link = svg3
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .style("stroke", "#aaa")

  // Initialize the nodes
  var node = svg3
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("r", 5)
    .style("fill", "#69b3a2")

  node.append("title")
    .text(d => d.id);

  // Let's list the force we wanna apply on the network
  var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
    .force("link", d3.forceLink()                               // This force provides links between nodes
      .id(function (d) { return d.id; })                     // This provide  the id of a node
      .links(data.links)                                    // and this the list of links
    )
    .force("charge", d3.forceManyBody().strength(-10))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    .force("center", d3.forceCenter(graph_3_width / 2, graph_3_height / 2))     // This force attracts nodes to the center of the svg area
    .on("end", ticked);

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  });
  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
      .attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });

    node
      .attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; });
  }

});