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

function addDaysToPlanet(planet, days) {
	var copiedPlanet = utils.clone(planet);
	copiedPlanet.position = (INITIAL_POSITION + planet.position + planet.speed * days * planet.direction) % 360;

	return copiedPlanet;
};

exports.addDaysToManyPlanets = function(planets, days) {
	var p1 = addDaysToPlanet(planets[0], days);
	var p2 = addDaysToPlanet(planets[1], days);
	var p3 = addDaysToPlanet(planets[2], days);

	return [p1, p2, p3];
};

exports.isDraught = function(planets) {
	return (planets[0].position % 180) == (planets[1].position % 180) && (planets[1].position % 180) == (planets[2].position % 180);
};

exports.isRainy = function(planets) {
	var coordinates = getCoordinates(planets);
	return utils.getSurface(coordinates) > 0 && utils.coordinatesContainPoint(coordinates, {x: 0, y: 0});
};

exports.isOptimal = function(planets) {
	var coordinates = getCoordinates(planets);
	return utils.getSurface(coordinates) == 0 && !utils.coordinatesContainPoint(coordinates, {x: 0, y: 0});
};

exports.maxRainPeriod = function(planets) {
	// TODO: Implement
	return false;
};

exports.simulateDays = function(planets, days) {
	var simulation = [];

	for (var i = 0; i < days; i++) {
		var auxPlanets = exports.addDaysToManyPlanets(planets, i);
		
		var isDraught = exports.isDraught(auxPlanets);
		var isRainy = exports.isRainy(auxPlanets);
		var isOptimal = exports.isOptimal(auxPlanets);
		var daySimulation = {day: i, isDraught: isDraught, isRainy: isRainy, isOptimal: isOptimal};

		simulation.push(daySimulation);
	}

	return simulation;
};

function getCoordinates(planets) {
	var coordinates = [];

	for(var i = 0; i < planets.length; i++) {
		coordinates.push(utils.getCoordinates(planets[i].position, planets[i].distance));
	}

	return coordinates;
}