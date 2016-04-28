var ASQ = require("asynquence");

var utils = require('./utils.js');
var db = require('./db.js');

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

exports.getWeather = function(day, callback) {
	if(process.env.READ_FROM_DB == 'true') {
		getWeatherFromDB(day, callback);
	} else {
		computeWeather(day, callback);
	}
};

function computeWeather(day, callback) {
	var simulatedPlanets = exports.addDaysToManyPlanets(planets, day);

	var weather = {};
	weather.day = day;

	weather.condition = 
		exports.isDraught(simulatedPlanets)
			? "Draught" 
			: ( exports.isRainy(simulatedPlanets)
				? "Rainy" 
				: ( exports.isOptimal(simulatedPlanets)
					? "Optimal" 
					: "Normal"
				)
			);

	weather.planetsCoveredSurface = utils.getSurface(getCoordinates(simulatedPlanets));

	callback(weather);
}

function getWeatherFromDB(day, callback) {
	db.getForecast(day, function(docs){
		callback(docs);
	});
}

exports.simulateDays = function(days) {
	// first, wipe out the contents of the collection
	db.emptyForecastsCollection();

	var simulation = [];

	for (var i = 0; i <= days; i++) {
		computeWeather(i, function(weather) {
			simulation.push(weather);			

			// store in the DB
			db.saveForecast(weather);
		});
	}

	return simulation;
};

exports.getStatistics = function(callback) {
	var done = function(res) {
		console.log(res);
	}

	var res1, res2;

	ASQ({}).all(
		db.countDraughtWeatherConditions(done, res1),
		db.countRainyWeatherConditions(done, res2)
	).val(callback(res1, res2));
}

exports.addDaysToPlanet = function(planet, days) {
	var copiedPlanet = utils.clone(planet);
	copiedPlanet.position = (INITIAL_POSITION + planet.position + planet.speed * days * planet.direction) % 360;

	return copiedPlanet;
};

exports.addDaysToManyPlanets = function(planets, days) {
	var p1 = exports.addDaysToPlanet(planets[0], days);
	var p2 = exports.addDaysToPlanet(planets[1], days);
	var p3 = exports.addDaysToPlanet(planets[2], days);

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

function getCoordinates(planets) {
	var coordinates = [];

	for(var i = 0; i < planets.length; i++) {
		coordinates.push(utils.getCoordinates(planets[i].position, planets[i].distance));
	}

	return coordinates;
}