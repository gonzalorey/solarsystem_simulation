var math = require('mathjs');

var utils = require('./utils.js');

const INITIAL_POSITION = 360;

var planetFarengi = {
	name: 'Farengi', 
	speed: 1,
	direction: 1,   // clockwise
	distance: 500,
	position: INITIAL_POSITION
};

var planetBetasoide = {
	name: 'Betasoide', 
	speed: 3,
	direction: 1,   // clockwise
	distance: 2000,
	position: INITIAL_POSITION
};

var planetVulcano = {
	name: 'Vulcano', 
	speed: 5,
	direction: -1,   // Counter Clockwise
	distance: 1000,
	position: INITIAL_POSITION
};

// planets of the solar system
var planets = [planetFarengi, planetBetasoide, planetVulcano];
exports.planets = planets;

var starSol = {
	name: 'Sol',
	speed: 0,
	direction: 1,   // clockwise
	distance: 0
};

// solar system objects
var objects = [starSol, planets];

exports.addDaysToPlanet = function(planet, days) {
	var copiedPlanet = utils.clone(planet);   
	copiedPlanet.position = (INITIAL_POSITION + planet.position + planet.speed * days * planet.direction) % 360;

	return copiedPlanet;
};

exports.isDraught = function(planets) {
	return (planets[0].position % 180) == (planets[1].position % 180) && (planets[1].position % 180) == (planets[2].position % 180);
};

exports.isRainy = function(planets) {
	var coordinates = getCoordinates(planets);		// needed to be computed for two methods
	var surface = getSurface(planets, coordinates);

	return surface > 0 && utils.containsZero(coordinates);
};

function isOptimal(planets) {
	return false;
}

function getSurface(planets, coordinates) {
	// get the base and height of the triangle
	var base = utils.getDistance(coordinates[0], coordinates[1]);
	var height = utils.getDistance(coordinates[0], coordinates[2]) * math.sin((INITIAL_POSITION + planets[2].position - planets[0].position) % 360);

	return utils.getTriangleSurface(base, height);
};

function getCoordinates(planets) {
	var coordinates = [];

	for(i = 0; i < planets.length; i++) {
		coordinates.push(utils.getCoordinates(planets[i].position, planets[i].distance));
	}

	return coordinates;
}