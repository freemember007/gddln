const agent = require('superagent')
const { Item } = require('./models')
const logger = require('./logger')

// 获取微博并保存
;(async () => {

  logger.log('开始微博抓取任务')

  const tweets = await agent
    .get('https://api.weibo.com/2/statuses/public_timeline.json')
    .query({ access_token: '2.00xudY2Bp7AtID549e85b771WW3fWD' })
    .then(res => res.body && res.body.statuses)
    .catch(err => logger.error(err.message))

  for(const i of tweets){
    const item = new Item({
      text       : i.text,
      image_url  : i.bmiddle_pic,
      author     : i.user.name,
      created_at : i.created_at,
      weibo_id   : i.mid,
      source     : "weibo",
      site_id    : i.user.id
    })
    
    await item.save((err, res) => {
      err && logger.error(err) || logger.log(res)
    })
  }
})()