'use strict';

const ShiftStats = require('./index');

let s = new ShiftStats();
// with promises
s.login().then(() => {
  return s.divisionStandings(4702);
}).then(async(standings) => {
  console.log(standings.teams);
  // with async/await
  console.log((await s.gameGoals(166658, 'home')).home_goals);
});
