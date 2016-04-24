var utils = require('./utils.js');

const INITIAL_POSITION = 0;   // TODO: make constant

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
exports.planets = planets;

var starSol = {
  name: 'Sol',
  speed: 0,
  direction: 'clockwise',
  distance: 0
};

// solar system objects
var objects = [starSol, planets];

exports.addDaysToPlanet = function(planet, days) {
  var copiedPlanet = utils.clone(planet);   
  copiedPlanet.position = (planet.speed * days) % 360;    // TODO: Change to consider clockwise and counterclockwise

  console.log(copiedPlanet);

  return copiedPlanet;
}

exports.isDraught = function(planets) {
  return (planets[0].position % 180) == (planets[1].position % 180) && (planets[1].position % 180) == (planets[2].position % 180);
}

function isRainy(planets) {
  return false;
}

function isOptimal(planets) {
  return false;
}