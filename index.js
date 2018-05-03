const http = require('http')
const FeedMe = require('feedme')
const axios = require('axios')
const moment = require('moment')
const schedule = require('node-schedule')

moment.locale('zh-cn')

// const webhook = 'https://oapi.dingtalk.com/robot/send?access_token=684025a2c2f80e9d7716baace939f91f1adfb444e967113501f66babfe153d02'
const webhook = 'https://oapi.dingtalk.com/robot/send?access_token=8c61043eec6613f566ae31fc68471cc267bdffe822c23a584439d78ae3974663'

function sendDD (news) {
  if (!news) {
    console.log('没有获取到新闻')
    return
  }
  const dingdingText = news.items.map(x => {
    const { title, guid } = x
    return `- [${title}](${guid})`
  }).join('\n')

  axios.post(webhook, {
    'msgtype': 'markdown',
    'markdown': {'title': '前端资讯',
      'text': `## 前端资讯(BETA) \n ##### ${moment().format('LL')} \n\n ${dingdingText}\n\n`
    },
    'at': {
      'atMobiles': [
        '1825718XXXX'
      ],
      'isAtAll': false
    }
  }).then(() => console.log('发送成功！'))
}

function getNews () {
  http.get('http://www.echojs.com/rss', res => {
    if (res.statusCode !== 200) {
      console.error(new Error(`status code ${res.statusCode}`))
      return
    }
    var parser = new FeedMe(true)
    parser.on('end', () => {
      const data = parser.done()
      sendDD(data)
    })
    res.pipe(parser)
  })
}

const job = schedule.scheduleJob('* * 9 * * *', function () {
  getNews()
})

console.log(job.nextInvocation())
