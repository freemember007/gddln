#　连接mongodb
# $ = require("mongous").Mongous
# console.log("连接数据库成功，开始抓取")

# https模块
exports.fetch = (model) ->
	console.log('a')
	https = require('https')
	
	sites = ["1713053037","1341267693","1273034312","1610362247","1624763627","1644225642","1573047053","1495037557",
	"1919131861","1222135407","1653460650","1191965271","2109300743","1891422510","1918182630","2195315124","1640516504",
	"1920061532","1893786465","2093879035","2377059260","1947267610","1848155523","2720880354","2141100877","1708242827",
	"2267520473","2272568451","1733950851","2124580897"]

	for x in sites
		options = {
		host:'api.weibo.com',
		port:443,
		path:'/2/statuses/user_timeline.json?source=2879718887&uid=' + x + '&feature=1&count=1',
		method:'get'
		}
		https.request(options, (res) ->
			result = ''
			res.on('data',(data) ->
				result += data
			)
			.on('end', ->
				tweets = JSON.parse(result)
				tweets = tweets.statuses
				if tweets && tweets.length
					for i in tweets
						if i.text.match(/预订|粉丝|微博|屏蔽|有奖|奖品|大奖|转发|转让|微信/) || i.bmiddle_pic is undefined #注意：用null是不对的
						else
							itemOne = new model()
							itemOne.text = i.text
							itemOne.image_url = i.bmiddle_pic
							itemOne.author = i.user.name
							itemOne.created_at = i.created_at
							itemOne.weibo_id = i.mid
							itemOne.source = "weibo"
							itemOne.site_id = i.user.id
							itemOne.save( (err)-> 
								console.log (err)
								)
							console.log("\n图片: " + i.bmiddle_pic)
							console.log("内容：" + i.text)
							console.log("by " + i.user.name)
			)
		)
		.end() #此行必须要。请求必须结束。