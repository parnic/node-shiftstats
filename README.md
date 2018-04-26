# node-shiftstats
This package pulls data from DigitalShift sites such as HockeyShift, SoccerShift, LacrosseShift, FootballShift, BasketballShift, and BaseballShift.

For the Ruby version of this library, see [shift_stats](https://github.com/parnic/shift_stats)

[![npm version](https://badge.fury.io/js/node-shiftstats.svg)](http://badge.fury.io/js/node-shiftstats)

## Install
You can install node-shiftstats via npm: `npm install node-shiftstats`

## Usage

```js
const ShiftStats = require('node-shiftstats')
```

Create a new instance of ShiftStats with
```js
let s = new ShiftStats()
```
then `await` or `.then()` on `s.login()`. This connects to the ShiftStats server, logs in, and stores the ticket hash so you're ready to make any other request. This ticket is only valid for a limited amount of time.

Optionally specify your API key (note: by default uses the same API key as the Android HockeyShift app)

```js
let s = new ShiftStats('yourApiKeyHere')
```

Attempting to login or call any API can `reject`/`catch` if there are network issues or the API key is invalid.

See [the included example script](https://github.com/parnic/node-shiftstats/blob/master/example.js) for a small sample of interfacing with the library.

### Available methods

* `leagues` - Get a list of all available leagues.
* `league(leagueId)` - Show details for a specific league.
* `leagueSeasons(leagueId)` - Get a list of seasons for a specific league.
* `leagueSuspensions(leagueId, onlyActive = true)` - Get a list of suspended players for the specified league.
  * `onlyActive` controls whether expired suspensions are included or not.
  * WARNING: this response can be very large, especially if `onlyActive` is false.
* `teamSearch(sportName, teamName)` - Search for the given team in the given sport for all active seasons.
* `teamSchedule(teamId)` - Retrieve the game schedule for the supplied team.
* `teamPlayersList(teamId)` - Get the list of players on a specific team.
* `teamsInDivision(divisionName, leagueId, currentSeason = true)` - Get all teams in the named division in the specific league.
  * This is an odd API that requires the division be a name, not an ID, and requires specifying a league ID to search in.
* `teamGames(teamId, includeFuture = true, includeToday = true)` - Get all games for a specific team.
* `teamGamesForStatus(teamId, status = 'Final,In Progress,Forfeit')` - Get a list of all games for a specific team matching the specified type.
  * Valid values for `status` are `Final`, `In Progress`, and `Forfeit`, and can be mixed and matched, separated by commas.
* `teamPractices(teamId, includeFuture = true, includeToday = true)` - Get a list of practices schedule for the specified team.
* `teamSuspensions(teamId, onlyActive = true)` - Get a list of suspensions of players on the specified team.
  * `onlyActive` controls whether expired suspensions are included or not.
* `game(gameId)` - Returns data about the specified game.
* `gameGoals(gameId, only = null)` - Returns a list of goals in the specified game.
  * Valid values for `only` are `'home'` and `'away'`. If not specified, both teams' goals are included.
* `gameGoalies(gameId, only = null)` - Returns a list of goalies in the specified game.
  * Valid values for `only` are `'home'` and `'away'`. If not specified, both teams' goalies are included.
* `gamePenalties(gameId, only = null)` - Returns a list of penalties in the specified game.
  * Valid values for `only` are `'home'` and `'away'`. If not specified, both teams' penalties are included.
* `gameRoster(gameId, only = null)` - Returns the roster for the specified game.
  * Valid values for `only` are `'home'` and `'away'`. If not specified, both teams' rosters are included.
* `divisionGamesList(divisionId)` - Returns all games for a specified division.
* `divisionStandings(divisionId, type = 'Regular Season')` - Returns a ranked list of teams for the specified division.
  * Valid values for `type` are `Regular Season`, `Playoffs`, and `Exhibition`.
* `divisionTeams(divisionId)` - Lists all teams in the specified division.
* `divisionLeaders(divisionId, type = 'Regular Season', limit = 20, metrics = ['points', 'goals'])` - Lists up to `limit` number of leaders for the specified division.
  * Valid values for `type` are `Regular Season`, `Playoffs`, and `Exhibition`.
  * Valid values for `metrics` include anything listed in `league(leagueId).league.view_settings.leader_metrics`.
* `divisionSuspensions(divisionId, onlyActive = true)` - Get a list of suspensions of players in the specified division.
  * `onlyActive` controls whether expired suspensions are included or not.
* `season(seasonId)` - Show details for a specific season.
* `seasonDivisionsList(seasonId)` - Lists all divisions for the specified season.
* `seasonSuspensions(seasonId, onlyActive = true)` - Get a list of suspended players for the specified season.
  * `onlyActive` controls whether expired suspensions are included or not.

## Bug reports, feature requests, contributions

Please create an issue or pull request on github. Assistance is most welcome.

There are more endpoints available on Shift sites, but none are documented. Running a mobile app inside an emulator and watching wireshark, fiddler, etc. is how the current endpoints were discovered.
