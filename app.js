// Module dependencies
var moment = require('moment');
var express = require('express')
var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(require('stylus').middleware({src: __dirname + '/public', compress: true, firebug: true}));
	app.use(express.compiler({src: __dirname + '/public', enable: ['coffeescript']}));
	app.use(express.static(__dirname + '/public'), {maxAge: 864000000});
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// 模型
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vmag',{safe:false});
var Schema = mongoose.Schema
 , ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
	_id				: ObjectId
	, author		 : String
	, text			 : {type:String,index:true,unique:true}
	, image_url	: String
	, created_at : Date
	, source		 : String
	, weibo_id	 : String
	, site_id		: String
});
mongoose.model('item', itemSchema);
var item = mongoose.model('item');

// 抓取任务
var grab = require('./grab.js');
grab.fetch(item);
var cronJob = require('cron').CronJob;
var job = new cronJob({
	cronTime: '00 */10 * * * *',
	onTick: function(){console.log('job start...'); grab.fetch(item);},
	start: false, //立即开始，但基本上要碰运气。先手动开始吧。。。
	timeZone: 'Asia/Chongqing'
});
job.start();


// Routes
// {source:"weibo"},{created_at:1,text:1,image_url:1,author:1},{lim:1}
app.get('/', function(req, res){
	item.find({},{},{limit:1,sort:[['created_at', -1]]},function(err,docs){
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
	item.find({},{},{limit:1,skip:parseInt(req.params.id)-1,sort:[['created_at', -1]]},function(err,docs){
		res.send(docs)
	})
});

app.get('/:id', function(req, res){
	item.find({},{},{limit:1,skip:parseInt(req.params.id)-1,sort:[['created_at', -1]]},function(err,docs){
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

app.get('/translate/:text/:from/:to', function(req, res){
	var translate = require('./translate.js');
	var text = req.params.text;
	var from = req.params.from;
	var to = req.params.to;
	translate.translate(text,from,to,function(err, data){
		res.send(data);
	});
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
