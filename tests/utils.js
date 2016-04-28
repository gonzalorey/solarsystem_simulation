var utils = require('../server/utils.js');

var assert = require('chai').assert;
var math = require('mathjs');

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

	describe('allPointsAllignedButTheSpared', function() {
		it('should return \'true\' when all points are alligned but the spared one', function() {
			var points = [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}];
			var spared = [{x: 2, y: 3}];

			assert.equal(utils.allPointsAllignedButTheSpared(points, spared), true);
		});

		it('should return \'false\' when at least one of the not spared points is not aligned', function() {
			var points = [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}, {x: 4, y: 5}];
			var spared = [{x: 2, y: 3}];

			assert.equal(utils.allPointsAllignedButTheSpared(points, spared), false);
		});

		it('should return \'false\' when there are less than two points', function() {
			var points = [{x: 0, y: 0}];
			var spared = [{x: 2, y: 3}];

			assert.equal(utils.allPointsAllignedButTheSpared(points, spared), false);
		});

		it('should return \'true\' for this case', function() {
			var points = [{x: 0, y: 0}, {x: 1, y: 1}];
			var spared = [{x: 2, y: 3}];

			assert.equal(utils.allPointsAllignedButTheSpared(points, spared), true);
		});

		it('should return \'false\' when all points are the same', function() {
			var points = [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}];
			var spared = [{x: 2, y: 3}];

			assert.equal(utils.allPointsAllignedButTheSpared(points, spared), false);
		});	
	});
});