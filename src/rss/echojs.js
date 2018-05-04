const RSS = require('./base')

const RSS_URL = 'http://www.echojs.com/rss'
const NAMESPANCE = 'ECHOJS'

class EchoJs extends RSS {
  constructor () {
    super(RSS_URL, NAMESPANCE)
  }
}

module.exports = EchoJs
