# 基础变量赋值
startpage = parseInt(window.location.hash.replace("#","")) || 1

# 将被调用的函数
autoloading = (direction,speed=2000) ->
	if direction is "next" then startpage += 1
	if direction is "pre" then startpage += -1
	if direction is "home" then startpage = 1
	$.get("/ajax/"+startpage, (res) ->
		data = eval(res)
		if data[0]
			$("#image_url,#text,#author").fadeOut speed, ->
				# 用新图片的load callback事件会有空白等待，先用速度吧。。
				$("#image_url").attr("src", data[0].image_url).fadeIn(speed)
				$("#text").html(data[0].text.replace(/http:\/\/t\.cn\/[a-zA-Z0-9]{4,7}/g,"<a href='$&', target='_blank'>$&</a>")).fadeIn(speed)
				time = moment(data[0].created_at).fromNow() #待研究
				$("#author a").text(data[0].author)
				$("#author span").text(" (" + time + ")" )
				$("#author").fadeIn(speed)
				window.scrollTo(0,0)
			$("#sinashare").attr("itemID",data[0]._id)
			$("#author a").attr("href","http://weibo.com/" + data[0].site_id)
			window.location = "#"+startpage #或window.location.hash = startpage
			if startpage is 1 then $("#goPre").hide() else $("#goPre").show()
		else
			startpage = 0 #从头开始。
	)

scrollToTop = ->
	window.scrollTo(0,0)

share = ->
	url = "http://service.weibo.com/share/share.php?url=http://" + document.location.host + "/cache/" + 
	$("#sinashare").attr("itemID") + "&appkey=1290447933&title=" + $("#text").text()+"-@" +
	$("#author").text().replace(/\(.*?\)/,"") + "（via@哥德的理念）&pic=" + 
	$("#image_url").attr("src")
	window.open(url.replace(/#.*?#/g,""))

# 页面初始化
autoloading(false,500) if startpage isnt 1 #给带#号的URL重定向内容
$ ->
	$("#goPre").hide() if startpage is 1
	$("#text").html( (index,content)->
		content.replace(/http:\/\/t\.cn\/[a-zA-Z0-9]{4,7}/g,"<a href='$&', target='_blank'>$&</a>")
	)

# 事件监听
$(document).keydown (e) -> #貌似keypress比keydown,keyup对window scroolTo事件反应得都好, 不过press怎么时好时不好?
	if e.keyCode is 39 then autoloading("next",500)
	if e.keyCode is 37 and startpage isnt 1 then autoloading("pre",500)
	if e.keyCode is 67 then window.scrollTo(0,0)
	if e.keyCode is 83 then share()
	if e.keyCode is 70 then $(document).toggleFullScreen();

$(document).scroll ->
	offset =  $(document).scrollTop()
	if offset>800 then $("#backTop").css("display","inline") else $("#backTop").css("display","none")

setInterval("autoloading('next')",1000*60)