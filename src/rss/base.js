const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FeedMe = require('feedme')

const cachePath = path.resolve(__dirname, '../../cache')

class RSS {
  constructor (rssUrl, namespace) {
    this.rssUrl = rssUrl
    this.namespace = namespace
  }

  _getCacheData () {
    try {
      const filePath = path.join(cachePath, this.namespace)
      const cacheData = fs.readFileSync(filePath)
      return JSON.parse(cacheData)
    } catch (err) {
      console.log('读取cache失败')
      return null
    }
  }

  _getRssStream () {
    return new Promise((resolve, reject) => {
      axios.get(this.rssUrl, {
        responseType: 'stream'
      })
        .then(res => resolve(res.data))
        .catch(e => reject(e))
    })
  }

  diff (cache, data) {
    throw new Error(`需要对 ${this.namespace} 设置 diff 方法`)
  }

  _getUpdateData (data) {
    const cache = this._getCacheData()
    if (cache) {
      // diff cache
      return data // this.diff(cache, data)
    } else {
      return data
    }
  }

  _saveCache (json) {
    fs.writeFileSync(
      path.join(cachePath, this.namespace),
      JSON.stringify(json),
      (err) => {
        if (err) {
          console.log('存储失败！', err)
          return
        }
        console.log('存储成功!')
      })
  }

  getRssJson () {
    return new Promise((resolve, reject) => {
      this._getRssStream(this.rssUrl)
        .then(res => {
          const parser = new FeedMe(true)
          parser.on('end', () => {
            const data = parser.done()
            const newData = this._getUpdateData(data)
            this._saveCache(data)
            resolve(newData)
          })
          res.pipe(parser)
        })
    })
  }
}

module.exports = RSS
