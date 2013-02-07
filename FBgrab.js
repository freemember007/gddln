var $ = require("mongous").Mongous;
//https://api.weibo.com/oauth2/authorize?client_id=1290447933&response_type=token&redirect_uri=http://gddln.com
console.log("连接数据库成功，开始抓取");

var https=require('https'),
    tweets = null;
var sites=new Array("207073003","1848155523","1918182630","2720880354","1857414070","2141100877","2662442427","1708242827","1953313367","2127315094","2267520473","2098393000","1965646035","2272568451","2415963677","2635091234","1864970741","1644225642","1222135407","1653460650","1639498782","1281021921","1191965271");


for (x in sites){
	(function(){
		var options = {
			host:'api.weibo.com',
			port:443,  
	path:'/2/statuses/user_timeline.json?access_token=2.00xudY2B29a16Bee9084183e67yuRC&uid='+sites[x]+'&feature=1&count=2',
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
							      if(tweets[i].text.match(/屁股|预订|粉丝|微博|屏蔽|有奖|奖品|大奖|转发|转让|http|肉肉/) || tweets[i].bmiddle_pic == null){
										}
										else{
						        	$("vmag.items").save({text:tweets[i].text,image_url:tweets[i].bmiddle_pic,author:tweets[i].user.name,created_at:tweets[i].created_at,source:"weibo"})
											console.log(i + tweets[i].text)
											console.log(i + tweets[i].user.name)
										}
						     }
						  }
	         })
	      })
	      .end()
	} )()
	//setTimeout(arguments.callee, 300000)
}