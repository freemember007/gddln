// Module dependencies
const moment   = require('moment')
const express  = require('express')
const app      = express()
const schedule = require('node-schedule')
const { Item } = require('./models')
const logger   = require('./logger')

// Configuration
app.configure(function(){
	app.set('views', __dirname + '/views')
	app.set('view engine', 'jade')
	app.use(express.bodyParser())
	app.use(express.methodOverride())
	app.use(require('stylus').middleware({src: __dirname + '/public', compress: true, firebug: true}))
	app.use(express.static(__dirname + '/public'), {maxAge: 864000000})
})

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
})

app.configure('production', function(){
	app.use(express.errorHandler())
})


// Routes
// {source:"weibo"},{created_at:1,text:1,image_url:1,author:1},{lim:1}
app.get('/', function(req, res){
	Item.find({},{},{limit:1,sort:[['created_at', -1]]},function(err,docs){
		res.render('index.jade', {
			title: '歌德的理念',
			items: docs,
			time: moment(docs[0].created_at).fromNow(),
			page: 2
		})
	})
})

app.get('/test', function(req, res){
	res.send('just test!')
})

app.get('/callback', function(req, res){
	res.send('')
})

app.get('/callbackcancel', function(req, res){
	res.send('user cancel!')
})


app.get('/ajax/:id', function(req, res){
	Item.find({},{},{limit:1,skip:parseInt(req.params.id)-1,sort:[['created_at', -1]]},function(err,docs){
		res.send(docs)
	})
})

app.get('/:id', function(req, res){
	Item.find({},{},{limit:1,skip:parseInt(req.params.id)-1,sort:[['created_at', -1]]},function(err,docs){
		res.render('index.jade', {
			title : '歌德的理念',
			items : docs,
			time  : moment(docs[0].created_at).fromNow(),
			page  : parseInt(req.params.id)+1
		})
	})
})

app.get('/bak/:id', function(req, res){
	Item.find({_id:req.params.id},{},{limit:1},function(err,docs){
		res.render('index.jade', {
			title : '歌德的理念',
			items : docs,
			time  : moment(docs[0].created_at).fromNow(),
			page  : 2
		})
	})
})

app.get('/cache/:id', function(req, res){
	Item.find({_id:req.params.id},{},{limit:1},function(err,docs){
		res.render('index.jade', {
			title : '歌德的理念',
			items : docs,
			time  : moment(docs[0].created_at).fromNow(),
			page  : 2
		})
	})
})

const PORT = process.env.NODE_ENV === 'production' ? 80 : 3000
app.listen(PORT, function(res){
	logger.log(`Express server listening on ${PORT}`)
	// 每天0点0分执行抓取最新微博任务
	schedule.scheduleJob('* * * * *', () => require('./grab'))
})
