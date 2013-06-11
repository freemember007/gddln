exports.translate = (text,from,to,callback) ->

	MsTranslator = require('mstranslator')

	client = new MsTranslator(
		client_id: "copyto"
		client_secret: "K4dStcXIggu5j/pp+WZ296iFrxZq6+m/BDWTssNIQNs"
	)

	params = 
		text: text
		from: from
		to: to

	client.initialize_token((keys)->
		console.log(keys.access_token);
		client.translate(params, (err, data)->
			console.log(data)
			callback(err, data)
		)
	)



# ###### 备份自己写的代码
# 获取Bing 翻译访问令

# https = require('https')
# querystring = require('querystring');

# options = 
# 	host: 'datamarket.accesscontrol.windows.net'
# 	port: 443 # 可以没有，这是默认值
# 	path: '/v2/OAuth2-13'
# 	method: 'POST'
# 	headers: # 可以没有，这是默认值
# 		'content-type': 'application/x-www-form-urlencoded'

# reqBody = querystring.stringify # 必须，确保请求body参数为string
# 	grant_type: 'client_credentials'
# 	client_id: 'copyto'
# 	client_secret: 'K4dStcXIggu5j/pp+WZ296iFrxZq6+m/BDWTssNIQNs'
# 	scope: 'http://api.microsofttranslator.com'

# req = https.request(options, (res) ->
# 	console.log('STATUS: ' + res.statusCode);
# 	console.log('HEADERS: ' + JSON.stringify(res.headers));
# 	res.setEncoding('utf8')
# 	res.on('data',(chunk) ->
# 		console.log('BODY: ' + chunk);
# 	)
# )
# req.write(reqBody, 'utf8')
# req.end() #发送post请求
# req.on('error', (e) ->
# 	console.log( e.stack )
# 	console.log('problem with request: ' + e.message)
# )