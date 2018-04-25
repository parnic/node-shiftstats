const ShiftRequest = require('./index')

let s = new ShiftRequest()
s.login().then(() => {
  return s.divisionStandings(4702)
}).then((standings) => {
  console.log(standings.teams)
})
