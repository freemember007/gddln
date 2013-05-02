var $ = require("mongous").Mongous;
//https://api.weibo.com/oauth2/authorize?client_id=1290447933&response_type=token&redirect_uri=http://gddln.com
console.log("连接数据库成功，开始抓取");

var https=require('https'),
    tweets = null;
var sites=new Array("1644225642","1573047053","1495037557","1919131861","1222135407","1653460650","1191965271","2109300743","1891422510","1918182630","2195315124","1640516504","1920061532","1893786465","2093879035","2377059260","1947267610","1848155523","2720880354","2141100877","1708242827","2267520473","2272568451","1733950851","2124580897","1713053037","1341267693","1273034312","1610362247","1624763627");

for (x in sites){
	(function(){
		var options = {
			host:'api.weibo.com',
			port:443,  
	path:'/2/statuses/user_timeline.json?access_token=2.00xudY2B29a16B379183efediehepD&uid='+sites[x]+'&feature=1&count=1',
			method:'get'
		};
	  https.request(options)
	      .addListener('response', function(response){
	         var result = ''
	         response.addListener('data',function(data){
	            result += data
	         })
	         .addListener('end',function(){
	            tweets = JSON.parse(result);
							console.log(tweets);
							tweets = tweets.statuses;
							
							if(tweets && tweets.length){
						     for(var i = 0; i<tweets.length; i++){
							      if(tweets[i].text.match(/屁股|预订|粉丝|微博|屏蔽|有奖|奖品|大奖|转发|转让|肉肉/) || tweets[i].bmiddle_pic == null){
										}
										else{
						        	$("vmag.items").save({text:tweets[i].text,image_url:tweets[i].bmiddle_pic,author:tweets[i].user.name,created_at:tweets[i].created_at,weibo_id:tweets[i].mid,source:"weibo",site_id:tweets[i].user.id})
											console.log(i + tweets[i].text)
											console.log(i + tweets[i].user.name)
											console.log(sites[x])
										}
						     }
						  }
	         })
	      })
	      .end()
	} )()
	//setTimeout(arguments.callee, 300000)
}