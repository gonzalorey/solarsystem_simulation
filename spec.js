var request = require('supertest');
var assert = require('chai').assert;

var backend = require('./backend.js');

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

// backend test
// ===================================================================================
describe('planet operations', function() {
	
	describe('isDraught', function(){
		
		it('should return \'true\' when all planets are alligned', function() {
			var mockedPlanets = [{position: 10}, {position: 10}, {position: 190}];

			assert.equal(backend.isDraught(mockedPlanets), true);
		});

		it('should return \'false\' when at least one planet is not alligned', function() {
			var mockedPlanets = [{position: 0}, {position: 10}, {position: 190}];

			assert.equal(backend.isDraught(mockedPlanets), false);
		});
	});
});