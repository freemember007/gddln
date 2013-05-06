// Model
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vmag');
var Schema = mongoose.Schema
 , ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
	_id				: ObjectId
	, author		 : String
	, text			 : String
	, image_url	: String
	, created_at : Date
	, source		 : String
	, weibo_id	 : String
	, site_id		: String
});
mongoose.model('item', itemSchema);
var item = mongoose.model('item');

// Generated by CoffeeScript 1.6.2
var $, https, options, sites, x, _i, _len;

$ = require("mongous").Mongous;

console.log("连接数据库成功，开始抓取");

https = require('https');

sites = ["1713053037", "1341267693"];

for (_i = 0, _len = sites.length; _i < _len; _i++) {
  x = sites[_i];
  options = {
    host: 'api.weibo.com',
    port: 443,
    path: '/2/statuses/user_timeline.json?access_token=2.00xudY2B29a16B379183efediehepD&uid=' + x + '&feature=1&count=1',
    method: 'get'
  };
  https.request(options, function(res) {
    var result;

    result = '';
    return res.on('data', function(data) {
      return result += data;
    }).on('end', function() {
      var i, tweets, _j, _len1, _results;

      tweets = JSON.parse(result);
      tweets = tweets.statuses;
      if (tweets && tweets.length) {
        _results = [];
        for (_j = 0, _len1 = tweets.length; _j < _len1; _j++) {
          i = tweets[_j];
          if (i.text.match(/预订|粉丝|微博|屏蔽|有奖|奖品|大奖|转发|转让|微信/) || i.bmiddle_pic === void 0) {

          } else {
            console.log("image_url: " + i.bmiddle_pic);
            var itemone = new item();
            itemone.text = i.text;
            itemone.image_url = i.bmiddle_pic;
            itemone.author = i.user.name;
            itemone.created_at = i.created_at;
            itemone.weibo_id = i.mid;
            itemone.source = "weibo";
            itemone.site_id = i.user.id;
            itemone.save();
            console.log("\n" + i.text);
            _results.push(console.log("by " + i.user.name));
          }
        }
        return _results;
      }
    });
  }).end();
}


/**
 * Module dependencies.
 */
var moment = require('moment');
var express = require('express')
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(require('stylus').middleware({ src: __dirname + '/public', compress : true}));
	app.use(express.compiler({src: __dirname + '/public', enable: ['coffeescript']}));
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});




// Routes
// {source:"weibo"},{created_at:1,text:1,image_url:1,author:1},{lim:1}
app.get('/', function(req, res){
	item.find({},{},{limit:1,sort:[['_id', -1]]},function(err,docs){
		res.render('index.jade', {
			title: '歌德的理念',
			items: docs,
			time: moment(docs[0].created_at).fromNow(),
			page: 2
		});
	})
});

app.get('/callback', function(req, res){
	res.send('')
});

app.get('/callbackcancel', function(req, res){
	res.send('user cancel!')
});


app.get('/ajax/:id', function(req, res){
	item.find({},{},{limit:1,skip:parseInt(req.params.id)-1,sort:[['_id', -1]]},function(err,docs){
		res.send(docs)
	})
});

app.get('/:id', function(req, res){
	item.find({},{},{limit:1,skip:parseInt(req.params.id)-1,sort:[['_id', -1]]},function(err,docs){
		res.render('index.jade', {
			title: '歌德的理念',
			items: docs,
			time: moment(docs[0].created_at).fromNow(),
			page: parseInt(req.params.id)+1
		});
	})
});

app.get('/bak/:id', function(req, res){
	item.find({_id:req.params.id},{},{limit:1},function(err,docs){
		res.render('index.jade', {
			title: '歌德的理念',
			items: docs,
			time: moment(docs[0].created_at).fromNow(),
			page: 2
		});
	})
});

app.get('/cache/:id', function(req, res){
	item.find({_id:req.params.id},{},{limit:1},function(err,docs){
		res.render('index.jade', {
			title: '歌德的理念',
			items: docs,
			time: moment(docs[0].created_at).fromNow(),
			page: 2
		});
	})
});

if(process.env.VCAP_SERVICES){
	app.listen(process.env.VMC_APP_PORT || 1337, null);
}else{
	app.listen(process.env.NODE_ENV === 'production' ? 80 : 3000, function(){
		console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
	});
}
