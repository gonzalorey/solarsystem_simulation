var request = require('supertest');
var assert = require('chai').assert;
var math = require('mathjs');

var backend = require('../server/backend.js');
var utils = require('../server/utils.js');

// server tests
// ===================================================================================
describe('loading express', function () {
	
	var server;

	beforeEach(function () {
		server = require('../server/server.js');
	});

	afterEach(function () {
		server.close();
	});

	it('responds to /', function testSlash(done) {
		request(server)
			.get('/')
			.expect(200, done);
	});

	it('responds the planets and their positions on a specified day', function testPath(done) {
		request(server)
			.get('/weather?day=15')
			.expect(200, done);
	});
});

// backend tests
// ===================================================================================
describe('planet operations', function() {
	
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

	describe('simulateDays', function() {
		it('should return an array with the draught, rain and optimal predictions for every day requested', function() {
			var planets = [{position: 0, distance: 5}, {position: 0, distance: 5}, {position: 0, distance: 5}];
			var days = 10;

			var response = backend.simulateDays(planets, days);

			assert.lengthOf(response, days, 'The size of the array is %d', days);
			assert.property(response, 'day');
			assert.property(response, 'isDraught');
			assert.property(response, 'isRainy');
			assert.property(response, 'isOptimal');
		});
	});
});

// utils tests
// ===================================================================================
describe('utils', function() {
	describe('getCoordinates', function() {
		it('should return the coordinate (5, 0) when the angle is 0 degrees and the hypotenuse 5', function() {			
			var response = utils.getCoordinates(0, 5);

			assert.propertyVal(response, 'x', 5);
			assert.propertyVal(response, 'y', 0);
		});

		it('should return the coordinate (-5, 0) when the angle is 180 degrees and the hypotenuse 5', function() {			
			var response = utils.getCoordinates(180, 5);

			assert.propertyVal(response, 'x', -5);
			assert.propertyVal(response, 'y', 0);
		});

		it('should return the coordinate (0, 5) when the angle is 90 degrees and the hypotenuse 5', function() {			
			var response = utils.getCoordinates(90, 5);

			assert.propertyVal(response, 'x', 0);
			assert.propertyVal(response, 'y', 5);
		});

		it('should return the coordinate (0, -5) when the angle is 270 degrees and the hypotenuse 5', function() {			
			var response = utils.getCoordinates(270, 5);

			assert.propertyVal(response, 'x', 0);
			assert.propertyVal(response, 'y', -5);
		});
	});

	describe('getDistance', function() {
		it('should return a number based on the distance between the coordinates defined', function() {
			assert.equal(utils.getDistance({x: 5, y: 0}, {x: -5, y: 0}), 10);
			assert.equal(utils.getDistance({x: 0, y: 0}, {x: 10, y: 10}), math.sqrt(200));
		});

		it('should return zero when calculating the distance between the same point', function() {
			var pointA = {x: 5, y: 0};
			
			assert.equal(utils.getDistance(pointA, pointA), 0);
		});
	});

	describe('getSurface', function() {
		it('should return the correct surface when received a set of coordinates', function() {
			var coordinates = [{x: 5, y: 0}, {x: -5, y: 0}, {x: 0, y: 10}];

			assert.equal(utils.getSurface(coordinates), 50);
		});
	});	

	describe('coordinatesContainPoint', function() {
		it('should return \'true\' when the point is contained between the coordinates received', function() {			
			var coordinates = [{x: 1, y: 1}, {x: 4, y: 2}, {x: 2, y: 7}];
			var point = {x: 2, y: 3};

			assert.equal(utils.coordinatesContainPoint(coordinates, point), true);
		});

		it('should return \'true\' when the point is contained between the coordinates received', function() {			
			var coordinates = [{x: 5, y: 0}, {x: -5, y: 0}, {x: 0, y: 10}];
			var point = {x: 0, y: 0};

			assert.equal(utils.coordinatesContainPoint(coordinates, point), true);
		});

		it('should return \'false\' when the point is not contained between the coordinates received', function() {			
			var coordinates = [{x: 1, y: 1}, {x: 4, y: 2}, {x: 2, y: 7}];
			var point = {x: 1.5, y: 5};

			assert.equal(utils.coordinatesContainPoint(coordinates, point), false);
		});
	});
});