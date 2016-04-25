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

	var x = hypotenuse * math.sin(math.PI/2 - toRadians(angle % 180));	// divided by sin(PI/2) = 1
	var y = hypotenuse * math.sin(toRadians(angle % 180));			// divided by sin(PI/2) = 1

	return {x: x, y: y};
};

exports.getDistance = function(pointA, pointB) {
	return math.sqrt(math.pow(pointB.x - pointA.x, 2) + math.pow(pointB.y - pointA.y, 2))
};

exports.getTriangleSurface = function(base, height) {
	return base * height / 2;
};

exports.containsZero = function(coordinates) {
	return false;
};