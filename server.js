const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./router');
const functions = require('./functions');
function iniciar(port){
	var app = express();
	app.use(bodyParser.json());
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.static(path.join(__dirname, 'public')));
	app.listen(port, function(){
		console.log('Server listen localhost:'+port);
	});
	app.get('/', router.index);
	app.get('/webhook',function(req, res){
		if(req.query['hub.verify_token'] === 'QCTOKEN9901'){
			res.send(req.query['hub.challenge']);
		}else{
			res.send('Tu no tienes que entrar aqui');
		}
	});

	app.post('/webhook',function(req, res){
		var data = req.body
		if(data.object == 'page'){
			data.entry.forEach(function(pageEntry){
				pageEntry.messaging.forEach(function(messagingEvent){
					if(messagingEvent.message){					
						functions.getMessage(messagingEvent);
					}
				})
			})
		}
		res.sendStatus(200);
	});
}
exports.iniciar = iniciar;