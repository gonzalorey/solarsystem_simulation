require('dotenv').config();

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

app.get('/weather', function (req, res) {
	if(!req.query.day || !utils.isNumeric(req.query.day)) {
		res.status(400).send('Missing valid \'day\' parameter, insert an integer.');
	} else {
		var day = req.query.day;
		backend.getWeather(day, function(weather) {
			if(weather.length > 0) {
				res.send(weather);
			} else {
				res.status(404).send('No valid data for the requested day.');
			}
		});
	}
});

app.get('/simulation', function (req, res) {
	if(!req.query.days || !utils.isNumeric(req.query.days)) {
		res.status(400).send('Missing valid \'days\' parameter, insert an integer.');
	} else {
		var days = req.query.days;
		var simulation = backend.simulateDays(days);

		res.send(simulation);
	}
});

app.get('/simulation/statistics', function (req, res) {
	backend.getStatistics(function(err, docs) {
		if (err) {
			res.status(400).send(err);
		} else {
			res.send(docs);
		}
	}, req.query.option);
})