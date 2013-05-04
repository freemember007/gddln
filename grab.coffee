$ = require("mongous").Mongous
console.log("连接数据库成功，开始抓取")

https=require('https')
sites=["1713053037","1341267693","1273034312","1610362247","1624763627","1644225642","1573047053","1495037557",
"1919131861","1222135407","1653460650","1191965271","2109300743","1891422510","1918182630","2195315124","1640516504",
"1920061532","1893786465","2093879035","2377059260","1947267610","1848155523","2720880354","2141100877","1708242827",
"2267520473","2272568451","1733950851","2124580897"]

for x in sites
	options = {
	host:'api.weibo.com',
	port:443,
	path:'/2/statuses/user_timeline.json?access_token=2.00xudY2B29a16B379183efediehepD&uid='+x+'&feature=1&count=1',
	method:'get'
	}
	https.request(options)
		.addListener('response', (response) ->
			result = ''
			response.addListener('data',(data) ->
				result += data
			)
			.addListener('end', ->
				tweets = JSON.parse(result)
				tweets = tweets.statuses
				if tweets && tweets.length
					for i in tweets
						if i.text.match(/预订|粉丝|微博|屏蔽|有奖|奖品|大奖|转发|转让|微信/) or i.bmiddle_pic is undefined #注意：用null是不对的
						else
							console.log("image_url: " + i.bmiddle_pic)
							$("vmag.items").save({text:i.text,image_url:i.bmiddle_pic,author:i.user.name,created_at:i.created_at,weibo_id:i.mid,source:"weibo",site_id:i.user.id})
							console.log("\n" + i.text)
							console.log("by " + i.user.name)
			)
		)
		.end()