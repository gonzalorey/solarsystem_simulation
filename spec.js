var request = require('supertest');
var assert = require('chai').assert;
var math = require('mathjs');

var backend = require('./backend.js');
var utils = require('./utils.js');

// server tests
// ===================================================================================
describe('loading express', function () {
	
	var server;

	beforeEach(function () {
		server = require('./server');
	});

	afterEach(function () {
		server.close();
	});

	it('responds to /', function testSlash(done) {
		request(server)
			.get('/')
			.expect(200, done);
	});

	it('404 everything else', function testPath(done) {
		request(server)
			.get('/foo/bar')
			.expect(404, done);
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
			var planets = [{position: 0, distance: 10}, {position: 90, distance: 30}, {position: 180, distance: 50}];

			assert.equal(backend.isRainy(planets), true);
		});
	});
});

// utils tests
// ===================================================================================
describe('utils', function() {
	describe('getCoordinates', function() {
		it('should return an object with the properties x and y when the angle 45 degrees with a hypotenuse of 10', function() {			
			var angle = 45;		
			var hypotenuse = 10;			
			var response = utils.getCoordinates(angle, hypotenuse);

			assert.isObject(response);
			assert.property(response, 'x');
			assert.property(response, 'y');
			assert.equal(response.x, response.y);	// when its a rectangle triangle, and the angle is 45, the sides (or coordinates) are equal
		});
	});

	describe('getDistance', function() {
		it('should return a number based on the distance between the coordinates defined', function() {
			var pointA = {x: 0, y: 0};
			var pointB = {x: 10, y: 10};
			
			assert.equal(utils.getDistance(pointA, pointB), math.sqrt(200));
		});
	});

	describe('getTriangleSurface', function() {
		it('should return a surface based on its base and height', function() {			
			assert.equal(utils.getTriangleSurface(10, 10), 50);
		});
	});

	describe('containsZero', function() {
		it('should return true when the zero coordinate is contained between the coordinates received', function() {			
			var coordinates = [{x: 0, y: 0}, {x: 10, y: 10}, {x: 0, y: 10}];

			assert.equal(utils.containsZero(coordinates), true);
		});
	});
});