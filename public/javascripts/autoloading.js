// Generated by CoffeeScript 1.6.2
var autoloading, share, startpage;

startpage = parseInt(window.location.hash.replace("#", "")) || 1;

autoloading = function(direction) {
  if (direction === "next") {
    startpage += 1;
  } else if (direction === "pre") {
    startpage += -1;
  }
  return $.get("/ajax/" + startpage, function(res) {
    var data;

    data = eval(res);
    if (data[0]) {
      $("#image_url,#text,#author").fadeOut(function() {
        $("#image_url").attr("src", "");
        $("#image_url").attr("src", data[0].image_url).fadeIn();
        $("#text").text(data[0].text).fadeIn();
        return $("#author").text(data[0].author + "(" + data[0].created_at + ")").fadeIn();
      });
      $("#sinashare").attr("itemID", data[0]._id);
      return window.location = "#" + startpage;
    } else {
      return startpage = 0;
    }
  });
};

if (startpage !== 1) {
  autoloading();
}

share = function() {
  var url;

  url = "http://service.weibo.com/share/share.php?url=http://" + document.location.host + "/cache/" + $("#sinashare").attr("itemID") + "&appkey=1290447933&title=" + $("#text").text() + "-@" + $("#author").text().replace(/\(.*?\)/, "") + "（via@哥德的理念）&pic=" + $("#image_url").attr("src");
  return window.open(url.replace(/#.*?#/g, ""));
};

$(document).keydown(function(e) {
  if (e.keyCode === 39) {
    autoloading("next");
  }
  if (e.keyCode === 37 && startpage !== 1) {
    return autoloading("pre");
  }
});

setInterval("autoloading('next')", 1000 * 60);