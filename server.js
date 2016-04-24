var express = require('express');

var utils = require('./utils.js');
var backend = require('./backend.js');

var app = express();
app.get('/', function (req, res) {
	res.send('Hello World!');
});

var server = app.listen(3000, function () {
	var port = server.address().port;

	//console.log('Example app listening on port %s!', port);
});

module.exports = server;

app.get('/weather', function (req, res) {
	if(!req.query.day || !utils.isNumeric(req.query.day)) {
		res.status(400).send('Missing valid day parameter, insert an integer.');
	} else {
		var days = req.query.day;
		var simulatedPlanets = [];

		console.log(backend.planets[0]);
		for(i = 0; i < backend.planets.length; i++) {
			simulatedPlanets.push(backend.addDaysToPlanet(backend.planets[i], days)); 
		}

		var response = {};
		response.planets = simulatedPlanets;
		response.isDraught = backend.isDraught(simulatedPlanets);
		response.isRainy = 'NOT YET READY';
		response.isOptimal = 'NOT YET READY';

		res.send(response);
	}
});

app.get('/planets', function (req, res) {
	res.send(planets);
});

app.get('/objects', function (req, res) {
	res.send(objects);
});