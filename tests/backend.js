var backend = require('../server/backend.js');

var assert = require('chai').assert;
var math = require('mathjs');

// backend tests
// ===================================================================================
describe('planet operations', function() {
	//TODO: Add the so much needed mocks!!
	// describe('getWeather', function() {
	// 	it('should return the weather condition for a specified day', function() {
	// 		var day = 13;

	// 		backend.getWeather(day, function(weather) {
	// 			assert.property(weather, 'day');
	// 			assert.propertyVal(weather, 'day', day);
	// 			assert.property(weather, 'condition');				
	// 		});
	// 	});
	// });	

	// describe('simulateDays', function() {
	// 	it('should return an array with weather condition for every requested day', function() {
	// 		var days = 10;

	// 		var response = backend.simulateDays(days);

	// 		assert.lengthOf(response, days + 1);	// considering the 0 day, as well as the 10th day
	// 		assert.property(response[0], 'day');
	// 		assert.property(response[0], 'condition');
	// 	});
	// });

	describe('isDraught', function() {
		it('should return \'true\' when all planets are alligned', function() {
			var planets = [{position: 10}, {position: 10}, {position: 190}];

			assert.equal(backend.isDraught(planets), true);
		});

		it('should return \'false\' when at least one planet is not alligned', function() {
			var planets = [{position: 0}, {position: 10}, {position: 190}];

			assert.equal(backend.isDraught(planets), false);
		});
	});

	describe('addDaysToPlanet', function() {
		it('should return postion = 5 for a planet positioned in 0, moving at a 5 deg/day speed and clockwise direction after a single day passed', function() {
			var planet = {position: 0, speed: 5, direction: 1};
			var response = backend.addDaysToPlanet(planet, 1);

			assert.isObject(response);
			assert.propertyVal(response, 'position', 5);
		});

		it('should return postion = 355 for a planet positioned in 0, moving at a 5 deg/day speed and counter clockwise direction after a single day passed', function() {
			var planet = {position: 0, speed: 5, direction: -1};
			var response = backend.addDaysToPlanet(planet, 1);

			assert.isObject(response);
			assert.propertyVal(response, 'position', 355);
		});
	});

	describe('isRainy', function() {
		it('should return \'true\' when the planets describe a surface greater than 0 and contains the (0,0) coordinate', function() {
			var planets = [{position: 0, distance: 5}, {position: 180, distance: 5}, {position: 90, distance: 10}];

			assert.equal(backend.isRainy(planets), true);
		});

		it('should return \'false\' when the planets describe a surface of 0', function() {
			var planets = [{position: 0, distance: 5}, {position: 180, distance: 5}, {position: 180, distance: 10}];

			assert.equal(backend.isRainy(planets), false);
		});

		it('should return \'false\' when the planets don\'t contain the (0,0) coordinate', function() {
			var planets = [{position: 0, distance: 5}, {position: 45, distance: 10}, {position: 90, distance: 5}];

			assert.equal(backend.isRainy(planets), false);
		});
	});

	describe('isOptimal', function() {
		it('should return \'true\' when the planets are all the same', function() {
			var planets = [{position: 0, distance: 5}, {position: 0, distance: 5}, {position: 0, distance: 5}];

			assert.equal(backend.isOptimal(planets), true);
		});

		it('should return \'true\' when the planets describe a surface of 0 and don\'t contain the (0,0) coordinate', function() {
			var planets = [{position: 0, distance: 5}, {position: 90, distance: 5}, {position: 45, distance: math.sqrt(2.5*2.5 + 2.5*2.5)}];

			assert.equal(backend.isOptimal(planets), true);
		});

		it('should return \'false\' when the planets describe a surface greater than 0', function() {
			var planets = [{position: 0, distance: 5}, {position: 0, distance: 5}, {position: 90, distance: 5}];

			assert.equal(backend.isOptimal(planets), true);
		});
	});
});