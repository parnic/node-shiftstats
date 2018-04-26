const http = require('http')
const querystring = require('querystring')
const zlib = require('zlib')

class Request {
  _request(options) {
    return new Promise((resolve, reject) => {
      http.get(options, (response) => {
        const { statusCode } = response
        const contentType = response.headers['content-type']

        let error
        if (statusCode !== 200) {
          error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error(`Invalid content-type.\nExpected application/json but received ${contentType}`)
        }
        if (error) {
          response.resume()
          reject(error)
          return
        }

        let rawData = ''

        const gunzip = zlib.createGunzip()
        gunzip.on('data', (chunk) => {
          rawData += chunk
        }).on('end', () => {
          try {
            const parsedData = JSON.parse(rawData)
            resolve(parsedData)
          } catch (e) {
            reject(e)
          }
        })

        response.pipe(gunzip)
      }).on('error', (e) => {
        reject(e)
      })
    })
  }
}

module.exports = class ShiftStats extends Request {
  constructor(apiKey) {
    super()
    this.apiKey = apiKey || 'YXBpLnNoaWZ0c3RhdHMuY29tLDE5YjhhZGIwNDVjZjAxMzJhM2E5N2VmZDQ1YTRj'
  }

  _request(options) {
    return super._request({
      hostname: 'api.shiftstats.com',
      path: this._url(options.url, options.query),
      headers: options.headers || this._headers()
    })
  }

  _basicHeaders() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'com.digitalshift.hockeyshift',
      'Accept-Language': 'en-US',
      'Accept-Encoding': 'gzip,deflate',
      'Connection': 'keep-alive',
    }
  }

  _headers() {
    if (typeof this.headersWithTicket === 'undefined') {
      this.headersWithTicket = Object.assign({'Authorization': `StatsAuth ticket="${this.ticketHash}"`}, this._basicHeaders())
    }

    return this.headersWithTicket
  }

  _url(path, query) {
    return `/${path}?${querystring.stringify(query)}`
  }

  _gameSubpath(gameId, path, only) {
    if (only == 'home') {
      path = `home_${path}`
    } else if (only == 'away') {
      path = `away_${path}`
    }
    return this._request({ url: `game/${gameId}/${path}` })
  }

  login() {
    return this._request({ url: 'login', query: {key: this.apiKey}, headers: this._basicHeaders() }).then((json) => {
      this.ticketHash = json.ticket.hash
      return json
    })
  }

  leagues() {
    return this._request({ url: 'leagues' })
  }

  league(leagueId) {
    return this._request({ url: `league/${leagueId}` })
  }

  leagueSeasons(leagueId) {
    return this._request({ url: `league/${leagueId}/seasons` })
  }

  leagueSuspensions(leagueId, onlyActive = true) {
    let query = {}
    if (onlyActive) {
      query.status = 'active'
    }
    return this._request({ url: `league/${leagueId}/suspensions`, query: query })
  }

  teamSearch(sport, name) {
    return this._request({ url: 'teams', query: {name: name, not_ended: true, sport: sport.toLowerCase()} })
  }

  teamSchedule(teamId) {
    return this._request({ url: `team/${teamId}/games`, query: {future: true, today: true, past: true} })
  }

  teamPlayersList(teamId) {
    return this._request({ url: `team/${teamId}/players`, query: {status: 'active'} })
  }

  teamsInDivision(divisionName, leagueId, currentSeason = true) {
    return this._request({ url: 'teams', query: {division: divisionName, league_id: leagueId, not_ended: currentSeason} })
  }

  teamGames(teamId, includeFuture = true, includeToday = true) {
    return this._request({ url: `team/${teamId}/games`, query: {future: includeFuture, today: includeToday} })
  }

  teamGamesForStatus(teamId, status = 'Final,In Progress,Forfeit') {
    return this._request({ url: `team/${teamId}/games`, query: {status: status} })
  }

  teamPractices(teamId, includeFuture = true, includeToday = true) {
    return this._request({ url: `team/${teamId}/practices`, query: {future: includeFuture, today: includeToday} })
  }

  teamSuspensions(teamId, onlyActive = true) {
    let query = {}
    if (onlyActive) {
      query.status = 'active'
    }
    return this._request({ url: `team/${teamId}/suspensions`, query: query })
  }

  game(gameId) {
    return this._request({ url: `game/${gameId}` })
  }

  // only is 'home' or 'away', optional
  gameGoals(gameId, only = null) {
    return this._gameSubpath(gameId, 'goals', only)
  }

  // only is 'home' or 'away', optional
  gameGoalies(gameId, only = null) {
    return this._gameSubpath(gameId, 'goalies', only)
  }

  // only is 'home' or 'away', optional
  gamePenalties(gameId, only = null) {
    return this._gameSubpath(gameId, 'penalties', only)
  }

  // only is 'home' or 'away', optional
  gameRoster(gameId, only = null) {
    return this._gameSubpath(gameId, 'roster', only)
  }

  divisionGamesList(divisionId) {
    return this._request({ url: `division/${divisionId}/games` })
  }

  // type is 'Regular Season', 'Playoffs', or 'Exhibition', required
  divisionStandings(divisionId, type = 'Regular Season') {
    return this._request({ url: `division/${divisionId}/standings`, query: {type: type} })
  }

  divisionTeams(divisionId) {
    return this._request({ url: `division/${divisionId}/teams` })
  }

  // type is 'Regular Season', 'Playoffs', or 'Exhibition', required
  // limit, required
  // metrics, required
  divisionLeaders(divisionId, type = 'Regular Season', limit = 20, metrics = ['points', 'goals', 'assists', 'goals_against_average', 'save_percentage', 'wins', 'shutouts', 'number_first_stars', 'number_stars']) {
    return this._request({ url: `division/${divisionId}/leaders`, query: {limit: limit, metrics: metrics.join(','), type: type} })
  }

  divisionSuspensions(divisionId, onlyActive = true) {
    let query = {}
    if (onlyActive) {
      query.status = 'active'
    }
    return this._request({ url: `division/${divisionId}/suspensions`, query: query })
  }

  season(seasonId) {
    return this._request({ url: `season/${seasonId}` })
  }

  seasonDivisionsList(seasonId) {
    return this._request({ url: `season/${seasonId}/divisions` })
  }

  seasonSuspensions(seasonId, onlyActive = true) {
    let query = {}
    if (onlyActive) {
      query.status = 'active'
    }
    return this._request({ url: `season/${seasonId}/suspensions`, query: query })
  }
}
