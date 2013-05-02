var startpage=1;

function autoloading(isNext){
	startpage += isNext?1:-1;	
	$.get("/ajax/"+startpage,function(res){
		var data = eval(res);
		$("#image_url,#text,#author").fadeOut(function(){
			$("#image_url").attr("src", data[0].image_url).fadeIn();
			$("#text").text(data[0].text).fadeIn();
			$("#author").text(data[0].author+"("+data[0].created_at+")").fadeIn();
		})
		$("#sinashare").attr("itemID",data[0]._id);
	})
	
};

function share(){
	var url = "http://service.weibo.com/share/share.php?url=http://" + document.location.host + "/cache/" + $("#sinashare").attr("itemID") + "&appkey=1290447933&title=" + $("#text").text()+"-@" + $("#author").text().replace(/\(.*?\)/,"") + "（via@哥德的理念）&pic=" + $("#image_url").attr("src");
	window.open(url.replace(/#.*?#/g,""))
}

document.onkeydown = keydown;
function keydown(e){
	if(e.keyCode==39){
    	autoloading(true);
    }else if(e.keyCode==37){
    	autoloading(false);
    }
}

setInterval("autoloading(true)",1000*60);