const http = require('http')
const querystring = require('querystring')
const zlib = require('zlib')

let apiKey = 'YXBpLnNoaWZ0c3RhdHMuY29tLDE5YjhhZGIwNDVjZjAxMzJhM2E5N2VmZDQ1YTRj'

class Request {
  request(options) {
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

module.exports = class ShiftRequest extends Request {
  request(options) {
    return super.request({
      hostname: 'api.shiftstats.com',
      path: this.url(options.url, options.query),
      headers: options.headers
    })
  }

  basicHeaders() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'com.digitalshift.hockeyshift',
      'Accept-Language': 'en-US',
      'Accept-Encoding': 'gzip,deflate',
      'Connection': 'keep-alive',
    }
  }

  headers() {
    if (typeof this.headersWithTicket === 'undefined') {
      this.headersWithTicket = Object.assign({'Authorization': `StatsAuth ticket="${this.ticketHash}"`}, this.basicHeaders())
    }

    return this.headersWithTicket
  }

  url(path, query) {
    return `/${path}?${querystring.stringify(query)}`
  }

  login() {
    return this.request({ url: 'login', query: {key: apiKey}, headers: this.basicHeaders() }).then((json) => {
      this.ticketHash = json.ticket.hash
      return json
    })
  }

  divisionStandings(division_id, type = 'Regular Season') {
    return this.request({ url: `division/${division_id}/standings`, query: {type: type}, headers: this.headers()})
  }
}
