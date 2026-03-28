/* ======================== CENTRAL LESSON REGISTRY ======================== */
/* Update this array when adding a new lesson.                              */
/* Quiz hub and Phrases hub both read from here automatically.              */

const ALL_LESSONS = [
  {name:'On the City Doorstep', path:'sections/reading/on-the-city-doorstep/data.json', skill:'reading'},
  {name:'Bees Neez Apiaries',   path:'sections/reading/bees-neez/data.json',             skill:'reading'},
  {name:'Travel This Summer',   path:'sections/reading/travel-this-summer/data.json',    skill:'reading'},
  {name:'Happiness',            path:'sections/reading/happiness/data.json',              skill:'reading'},
  {name:'Video Games',          path:'sections/reading/video-games/data.json',            skill:'reading'},
  {name:'Map Labeling',         path:'sections/listening/map-labeling/data.json',         skill:'listening'},
  {name:'Form Completion',      path:'sections/listening/form-completion/data.json',      skill:'listening'},
  {name:'Sentence Completion',  path:'sections/listening/sentence-completion/data.json',  skill:'listening'},
];

// Returns LESSONS with paths adjusted for the page's depth
// depth 0 = root (./)  |  depth 2 = hubs/quiz/ (../../)
function getLessonPaths(depth) {
  const prefix = depth === 0 ? './' : '../'.repeat(depth);
  return ALL_LESSONS.map(l => ({...l, path: prefix + l.path}));
}
