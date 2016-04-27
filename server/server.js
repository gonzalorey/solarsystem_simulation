var express = require('express');

var utils = require('./utils.js');
var backend = require('./backend.js');
var db = require('./db.js');

var app = express();
app.get('/', function (req, res) {
	res.send('Hello World!');
});

var server = app.listen((process.env.PORT || 3000), function () {
	var port = server.address().port;
	console.log('Listening on port %s!', port);

	// start the connection to the DB
	db.startConnection();
});

process.on('SIGINT', function() {
    console.log("Closing the server...");

	// start the connection to the DB
	db.closeConnection();

    process.exit();
});

module.exports = server;

app.get('/planets', function (req, res) {
	res.send(planets);
});

app.get('/weather', function (req, res) {
	if(!req.query.day || !utils.isNumeric(req.query.day)) {
		res.status(400).send('Missing valid \'day\' parameter, insert an integer.');
	} else {
		var day = req.query.day;

		db.getForecast(day, function(docs) {
			if(docs.length > 0) {
				console.log('Successfuly fetched');
				res.send(docs[0]);
			} else {
				console.log('wasn\'t in the DB, building the simulation');

				var simulatedPlanets = backend.addDaysToManyPlanets(backend.planets, day);

				var forecast = {};
				forecast.day = day;
				forecast.planets = simulatedPlanets;
				forecast.isDraught = backend.isDraught(simulatedPlanets);
				forecast.isRainy = backend.isRainy(simulatedPlanets);
				forecast.isOptimal = backend.isOptimal(simulatedPlanets);

				db.saveForecast(forecast);

				res.send(forecast);
			}
		});		
	}
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