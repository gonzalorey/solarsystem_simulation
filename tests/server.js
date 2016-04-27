var request = require('supertest');

var assert = require('chai').assert;

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

	it('responds a simulation array for the requested amount of days', function testPath(done) {
		request(server)
			.get('/simulation?days=15')
			.expect(200, done);
	});
});