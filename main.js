// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = { top: 40, right: 100, bottom: 40, left: 175 };

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

// attr = 'title' : number of titles per genre on Netflix 
// attr = 'runtime' : average runtime of movies by release year
// attr = 'cast' : a flow chart where each actor is a node, and a link refers to a movie they both acted in
function setData(attr) {
  d3.csv('./data/netflix.csv').then(function (data) {
    data = cleanData('cast', data)
    // console.log(data);
  })
}

/* attr === 'title'
data = {
  'Movie': num_movies
  'TV Show': num_shows
}
*/

/* attr === 'runtime'
data = {
  year: avg_runtime, 
  year_2: avg_runtime_2, 
  ...
}
toggle years shown!
*/

/* attr=='cast'
data = [
  [actor1, actor2, ...], [actor, ...], ...
]

for each actor in the same movie, create a link
for each actor, create a node if it does not already exist

nodes = [
  { "id": 1, "name": actor_name }, 
  { "id": 2, "name": actor2_name}. 
  ...
]

links = [
  { "source": 1, "target": 2 }, 
  ...
]}

return nodes and links

*/
function cleanData(attr, data) {
  if (attr === 'title') {
    numMovie = 0;
    numShow = 0;
    data.forEach(d => d.type === 'Movie' ? numMovie++ : numShow++);
    return {
      'Movie': numMovie,
      'TV Show': numShow
    }
  } else if (attr === 'runtime') {
    runtimeData = {}
    data.forEach(d => {
      // clean duration to remove minutes!!
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
    return runtimeData
  } else {
    listActors = []
    nodes = []
    links = []
    data.forEach(d => {
      listActors.push(d.cast.split(','));
    });

    listActors.map(d => {
      findCombinations(d, nodes, links);
    });

    console.log(links);
    console.log(nodes);
    return listActors.filter(d => d[0] !== '');
  }
}

function getRandomId(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// update links and nodes
/* 

nodes = {
  {name, id}, 
  {name, id}
}

links_intermediate = [
  {source: name, 
  output: name}, 
  ...
]

links_final = [
  {source: id, 
  output: id}
]

*/
function findCombinations(arr, nodes, combinations) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      combinations.push({
        source: arr[i].trim(),
        output: arr[j].trim()
      });
    }
    if (!nodes[arr[i].trim()]) {
      nodes[arr[i].trim()] = getRandomId(100000);
    } 
  }
}



// function lookup(name, nodes) {
//   for (let i = 0; i < nodes.length; i++) {
//     if (nodes[i]['name'] === name) {
//       return nodes[i]['name'];
//     }
//   }
// }

// function convertToId(nodes, combinations) {
//   combinations['source'] = lookup(combinations['source'], nodes);
//   combinations['target'] = lookup(combinations['target'], nodes);
// }

// function findCombinations(arr, nodes, combinations) {
//   for (let i = 0; i < arr.length; i++) {
//     let iId;
//     if (!nodes.some(elem => arr[i].trim() === elem['name'])) {
//       nodes.push({
//         'id': getRandomId(6237), 
//         'name': arr[i].trim()
//       })
//     } 
//     for (let j = i + 1; j < arr.length; j++) {
//       combinations.push({
//         'source': arr[i].trim(),
//         'target': arr[j].trim()
//       });
//     }
//   }

//   return combinations;
// }



setData('title');