// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = { top: 40, right: 100, bottom: 40, left: 175 };

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

// // attr = 'title' : number of titles per genre on Netflix 
// // attr = 'runtime' : average runtime of movies by release year
// // attr = 'cast' : a flow chart where each actor is a node, and a link refers to a movie they both acted in
// function setData(attr) {
//   d3.csv('./data/netflix.csv').then(function (data) {
//     data = cleanData('title', data)
//     console.log(data);
//   })
// }

// function cleanData(attr, data) {
//   if (attr === 'title') {
//     genres = {}
//     data.forEach(d => {
//       gen = d.listed_in.split(",");
//       for (let i = 0; i < gen.length; i++) {
//         let category = gen[i].trim();
//         if (!genres[category]) {
//           genres[category] = 1;
//         } else {
//           genres[category] += 1;
//         }
//       }
//     });
//     return genres;
//   } else if (attr === 'runtime') {
//     runtimeData = {}
//     data.forEach(d => {
//       if (d.type === 'Movie') {
//         if (runtimeData[d.release_year]) {
//           runtimeData[d.release_year]['total'] += parseInt(d['duration'].slice(0, -4));
//           runtimeData[d.release_year]['num_movies'] += 1
//         } else {
//           runtimeData[d.release_year] = {}
//           runtimeData[d.release_year]['total'] = parseInt(d['duration'].slice(0, -4));
//           runtimeData[d.release_year]['num_movies'] = 1
//         }
//       }
//     });

//     for (var key in runtimeData) {
//       runtimeData[key] = parseFloat(runtimeData[key]['total']) / parseFloat(runtimeData[key]['num_movies'])
//     }
//     return runtimeData
//   } else {
//     listActors = []
//     nodes = []
//     links = []
//     data.forEach(d => {
//       listActors.push(d.cast.split(','));
//     });

//     listActors.map(d => {
//       links = findCombinations(d, nodes, links);
//     });

//     links.map(d => {
//       d.source = nodes[d.source];
//       d.output = nodes[d.output];
//     });

//     console.log(links);
//     console.log(nodes);
//     return listActors.filter(d => d[0] !== '');
//   }
// }

// function getRandomId(max) {
//   return Math.floor(Math.random() * Math.floor(max));
// }

// function findCombinations(arr, nodes, combinations) {
//   for (let i = 0; i < arr.length; i++) {
//     for (let j = i + 1; j < arr.length; j++) {
//       combinations.push({
//         source: arr[i].trim(),
//         output: arr[j].trim()
//       });
//     }
//     if (!nodes[arr[i].trim()]) {
//       nodes[arr[i].trim()] = getRandomId(100000);
//     } 
//   }
//   return combinations;
// }

// setData('title');