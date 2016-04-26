var express = require('express');

var utils = require('./utils.js');
var backend = require('./backend.js');

var app = express();
app.get('/', function (req, res) {
	res.send('Hello World!');
});

var server = app.listen((process.env.PORT || 3000), function () {
	var port = server.address().port;

	console.log('Listening on port %s!', port);
});

module.exports = server;

app.get('/weather', function (req, res) {
	if(!req.query.day || !utils.isNumeric(req.query.day)) {
		res.status(400).send('Missing valid \'day\' parameter, insert an integer.');
	} else {
		var days = req.query.day;
		var simulatedPlanets = backend.addDaysToManyPlanets(backend.planets, days);

		var response = {};
		response.planets = simulatedPlanets;
		response.isDraught = backend.isDraught(simulatedPlanets);
		response.isRainy = backend.isRainy(simulatedPlanets);
		response.isOptimal = backend.isOptimal(simulatedPlanets);

		res.send(response);
	}
});

app.get('/planets', function (req, res) {
	res.send(planets);
});

app.get('/simulation', function (req, res) {
	if(!req.query.days || !utils.isNumeric(req.query.days)) {
		res.status(400).send('Missing valid \'days\' parameter, insert an integer.');
	} else {
		var days = req.query.days;
		var simulation = backend.simulateDays(backend.planets, days);

		res.send(simulation);
	}
});