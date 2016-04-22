var express = require('express');
var app = express();

var INITIAL_POSITION = 0;		// TODO: make constant

var planetFarengi = {
	name: 'Farengi', 
	speed: 1,
	direction: 'clockwise',
	distance: 500,
	position: INITIAL_POSITION
};

var planetBetasoide = {
	name: 'Betasoide', 
	speed: 3,
	direction: 'clockwise',
	distance: 2000,
	position: INITIAL_POSITION
};

var planetVulcano = {
	name: 'Vulcano', 
	speed: 5,
	direction: 'counterClockwise',
	distance: 1000,
	position: INITIAL_POSITION
};

// planets of the solar system
var planets = [planetFarengi, planetBetasoide, planetVulcano];

var starSol = {
	name: 'Sol',
	speed: 0,
	direction: 'clockwise',
	distance: 0
};

// solar system objects
var objects = [starSol, planets];

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// this is why I love scala an unmutable objects...
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function addDaysToPlanet(planet, days) {
	var copiedPlanet = clone(planet);		
	copiedPlanet.position = (planet.speed * days) % 360;		// TODO: Change to consider clockwise and counterclockwise

	console.log(copiedPlanet);

	return copiedPlanet;
}

function isDraught(planets) {
	return (planets[0].position % 180) == (planets[1].position % 180) && (planets[1].position % 180) == (planets[2].position % 180);
}

function isRainy(planets) {
	return false;
}

function isOptimal(planets) {
	return false;
}

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/weather', function (req, res) {
	if(!req.query.day || !isNumeric(req.query.day)) {
		res.status(400).send('Missing valid day parameter, insert an integer.');
	} else {
		var days = req.query.day;
		var simulatedPlanets = [];

		console.log(planets[0]);
		for(i = 0; i < planets.length; i++) {
			simulatedPlanets.push(addDaysToPlanet(planets[i], days)); 
		}

		var response = {};
		response.planets = simulatedPlanets;
		response.isDraught = isDraught(simulatedPlanets);
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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});