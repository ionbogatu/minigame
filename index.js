var config = require('./config');

var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({
	'extended': true
}));

app.use(express.static(config.staticFilesDirectory));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.post('/render', function(req, res){
	var pageRenderer = require(config.controllersDir + 'pageRenderer');
	res.send(pageRenderer.render(req.body));
});

app.post('/rotate', function(req, res){
	var pageRenderer = require(config.controllersDir + 'pageRenderer');
	res.send(pageRenderer.rotate(req));
});

app.listen(config.port, function(){
	console.log('Server listening on port: ' + config.port);
});