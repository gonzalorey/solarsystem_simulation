var math = require('mathjs');

exports.isNumeric = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

// this is why I love scala an unmutable objects...
exports.clone = function(obj) {
	if (null == obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	return copy;
};

// Converts from degrees to radians
function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

exports.getCoordinates = function(angle, hypotenuse) {
	// operations based on a rectangle triangle

	var x = hypotenuse * math.sin(math.PI/2 - toRadians(angle % 180)) * ((angle > 90 && angle < 270)? -1:1);	// divided by sin(PI/2) = 1
	var y = hypotenuse * math.sin(toRadians(angle % 180)) * ((angle > 180 && angle < 360)? -1:1);			// divided by sin(PI/2) = 1

	return {x: x, y: y};
};

exports.getSurface = function(coordinates) {
	var base = this.getDistance(coordinates[0], coordinates[1]);

	var baseMidpoint = {x: (coordinates[0].x + coordinates[1].x)/2, y: (coordinates[0].y + coordinates[1].y)/2};
	var height = this.getDistance(coordinates[2], baseMidpoint);

	return (base * height) / 2;
};

exports.getDistance = function(pointA, pointB) {
	return math.sqrt(math.pow(pointB.x - pointA.x, 2) + math.pow(pointB.y - pointA.y, 2))
};

exports.coordinatesContainPoint = function(coordinates, point) {
	// used the method in http://math.stackexchange.com/questions/51326/determining-if-an-arbitrary-point-lies-inside-a-triangle-defined-by-three-points

	// move the points to 0, 0 (even the origin)
	var A = {x: point.x, y: point.y};
	var B = {x: coordinates[1].x - coordinates[0].x, y: coordinates[1].y - coordinates[0].y};
	var C = {x: coordinates[2].x - coordinates[0].x, y: coordinates[2].y - coordinates[0].y};
	var P = {x: point.x - coordinates[0].x, y: point.y - coordinates[0].y};

	// the scalar
	var d = (B.x*C.y - B.y*C.x);

	// the weights 
	var wA = (P.x*(B.y - C.y) + P.y*(C.x - B.x) + B.x*C.y - C.x*B.y)/d;
	var wB = (P.x*C.y - P.y*C.x)/d;
	var wC = (P.y*B.x - P.x*B.y)/d;

	// all weights must be between 0 and 1 
	return (wA >= 0 && wA <= 1) && (wB >= 0 && wB <= 1) && (wC >= 0 && wC <= 1);
};

exports.allPointsAllignedButTheSpared = function(points, sparedPoints) {
	if(points.length < 2) {
		return false;
	} else {
		var equation = getEquationFromTwoPoints(points[0], points[1]);	
		
		points.splice(0, 2);	// remove the two already used points
		return doPointsMatchEquation(equation, points) && !doPointsMatchEquation(equation, sparedPoints);
	}
}

function getEquationFromTwoPoints(pointA, pointB) {
	// the linear equation y = m * x + b
	var m = (pointB.y - pointA.y) / (pointB.x - pointA.x);

	// given that pointA.y = m * pointA.x + b or pointB.y = m * pointB.x + b
	var b = pointA.y - m*pointA.x;

	return {m: m, b: b};
}

// a more scala-wise aproach :D
function doPointsMatchEquation(equation, pointsArray) {
	return pointsArray.every((element, index, array) => {
		return element.y == element.x * equation.m + equation.b;
	});
}