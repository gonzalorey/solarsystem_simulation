var mongoose = require('mongoose');

var mongodbUri = 'mongodb://dbuser:password@ds021681.mlab.com:21681/heroku_s8zhr3d3';
var mongodbUriLocal = 'mongodb://localhost/test';

// reference to the database connection
var db;

// reference to the schema
var forecastSchema;

// reference to the Forecast model stored in the schema
var Forecast;

function handleError(err) {
	console.log(err);
}

exports.startConnection = function(){
	if(process.env.DB_INSTANCE == 'local') {
		mongoose.connect(mongodbUriLocal);
	} else {
		mongoose.connect(mongodbUri);		
	}

	db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function() {
		// Create forecast schema
		forecastSchema = mongoose.Schema({
			day: Number,
			condition: String,
			surfaceCovered: Number
		});

		// Store forecast documents in a collection called "forecasts"
		Forecast = mongoose.model('forecasts', forecastSchema);
	});
};

exports.getForecast = function(day, callback) {
	Forecast.find({day: day}).exec(function(err, docs) {
		if (err) return handleError(err);

		callback(docs);
	});
};

exports.saveForecast = function(weather) {
	var forecast = new Forecast({ 
		day: weather.day, 
		condition: weather.condition,
		surfaceCovered: weather.planetsCoveredSurface
	});

	forecast.save(function (err) {
		if (err) return handleError(err);
	});
};

exports.emptyForecastsCollection = function() {
	Forecast.remove({}, function(err) { 
		console.log('Forecast collection removed') 
	});
}

exports.countDraughtWeatherConditions = function(callback) {
	Forecast.where({"condition": "Draught"}).count(function (err, count) {
		if (err) return handleError(err);

		console.log('there are %d draught days', count);
		callback(err, {draughtDays: count});
	});
}

exports.countRainyWeatherConditions = function(callback) {
	Forecast.where({"condition": "Rainy"}).count(function (err, count) {
		if (err) return handleError(err);

		console.log('there are %d rainy days', count);
		callback(err, {rainyDays: count});
	});
}

// Only close the connection when your app is terminating
exports.closeConnection = function() {
	mongoose.connection.db.close(function (err) {
		if(err) throw err;
	});
};