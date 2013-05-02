startpage=parseInt(window.location.hash.replace("#","")) or 1

autoloading = (direction,speed=2000) ->
	if direction is "next" then startpage+=1 else if direction is "pre" then startpage+=-1
	$.get("/ajax/"+startpage, (res)->
		data = eval(res)
		if data[0]
			$("#image_url,#text,#author").fadeOut speed, ->
				# 用新图片的load callback事件会有空白等待，先用速度吧。。
				$("#image_url").attr("src", data[0].image_url).fadeIn(speed)
				$("#text").text(data[0].text).fadeIn(speed)
				time = moment(data[0].created_at).fromNow() #待研究
				$("#author a").text(data[0].author)
				$("#author span").text(" (" + time + ")" )
				$("#author").fadeIn(speed)
			$("#sinashare").attr("itemID",data[0]._id)
			$("#author a").attr("href","http://weibo.com/" + data[0].site_id)
			window.location = "#"+startpage #或window.location.hash = startpage
		else
			startpage = 0 #从头开始。
	)

autoloading(false,500) if startpage isnt 1 #带#号的URL定个位

share = ->
	url = "http://service.weibo.com/share/share.php?url=http://" + document.location.host + "/cache/" + $("#sinashare").attr("itemID") + "&appkey=1290447933&title=" + $("#text").text()+"-@" + $("#author").text().replace(/\(.*?\)/,"") + "（via@哥德的理念）&pic=" + $("#image_url").attr("src")
	window.open(url.replace(/#.*?#/g,""))

$(document).keydown (e) ->
	if e.keyCode is 39 then autoloading("next",500)
	if e.keyCode is 37 and startpage isnt 1 then autoloading("pre",500)

setInterval("autoloading('next')",1000*60)