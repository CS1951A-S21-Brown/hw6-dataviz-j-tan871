// // Add your JavaScript code here
// const MAX_WIDTH = Math.max(1080, window.innerWidth);
// const MAX_HEIGHT = 720;
// const margin = { top: 40, right: 100, bottom: 40, left: 175 };

// // Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
// let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
// let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
// let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

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
  console.log(runtimeData);
  return runtimeData;
}

function setData() {
  d3.csv('./data/netflix.csv').then(function (data) {
    data = cleanData(data)
    console.log(data);
  })
}

setData();