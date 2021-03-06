// Generated by CoffeeScript 1.6.2
var autoloading, scrollToTop, setTheme, share, startpage;

startpage = parseInt(window.location.hash.replace("#", "")) || 1;

setTheme = function(name, foreground, background) {
  var date;

  date = new Date();
  date.setTime(date.getTime() + 10000);
  $(document.body).css('background', background);
  $('#main').css('background', foreground);
  document.cookie = 'theme=' + escape(name) + '; expires=' + date.toGMTString();
  return console.log(document.cookie);
};

autoloading = function(direction, speed) {
  if (speed == null) {
    speed = 2000;
  }
  if (direction === "next") {
    startpage += 1;
  }
  if (direction === "pre") {
    startpage += -1;
  }
  if (direction === "home") {
    startpage = 1;
  }
  return $.get("/ajax/" + startpage, function(res) {
    var data;

    data = eval(res);
    if (data[0]) {
      $("#image_url,#text,#author").fadeOut(speed, function() {
        var time;

        $("#image_url").attr("src", data[0].image_url).fadeIn(speed);
        $("#text").html(data[0].text.replace(/http:\/\/t\.cn\/[a-zA-Z0-9]{4,7}/g, "<a href='$&', target='_blank'>$&</a>")).fadeIn(speed);
        time = moment(data[0].created_at).fromNow();
        $("#author a").text(data[0].author);
        $("#author span").text(" (" + time + ")");
        $("#author").fadeIn(speed);
        return window.scrollTo(0, 0);
      });
      $("#sinashare").attr("itemID", data[0]._id);
      $("#author a").attr("href", "http://weibo.com/" + data[0].site_id);
      window.location = "#" + startpage;
      if (startpage === 1) {
        return $("#goPre").hide();
      } else {
        return $("#goPre").show();
      }
    } else {
      return startpage = 0;
    }
  });
};

scrollToTop = function() {
  return window.scrollTo(0, 0);
};

share = function() {
  var url;

  url = "http://service.weibo.com/share/share.php?url=http://" + document.location.host + "/cache/" + $("#sinashare").attr("itemID") + "&appkey=1290447933&title=" + $("#text").text() + "-@" + $("#author").text().replace(/\(.*?\)/, "") + "（via@哥德的理念）&pic=" + $("#image_url").attr("src");
  return window.open(url.replace(/#.*?#/g, ""));
};

if (startpage !== 1) {
  autoloading(false, 500);
}

$(function() {
  if (startpage === 1) {
    $("#goPre").hide();
  }
  return $("#text").html(function(index, content) {
    return content.replace(/http:\/\/t\.cn\/[a-zA-Z0-9]{4,7}/g, "<a href='$&', target='_blank'>$&</a>");
  });
});

$(document).keydown(function(e) {
  if (e.keyCode === 39) {
    autoloading("next", 500);
  }
  if (e.keyCode === 37 && startpage !== 1) {
    autoloading("pre", 500);
  }
  if (e.keyCode === 67) {
    window.scrollTo(0, 0);
  }
  if (e.keyCode === 83) {
    share();
  }
  if (e.keyCode === 70) {
    return $(document).toggleFullScreen();
  }
});

$(document).scroll(function() {
  var offset;

  offset = $(document).scrollTop();
  if (offset > 800) {
    return $("#backTop").css("display", "inline");
  } else {
    return $("#backTop").css("display", "none");
  }
});

setInterval("autoloading('next')", 1000 * 60);
