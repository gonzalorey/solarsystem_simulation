var mongoose = require('mongoose');

var mongodbUri = 'mongodb://dbuser:password@ds021681.mlab.com:21681/heroku_s8zhr3d3';

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
	mongoose.connect(mongodbUri);

	db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function() {
		// Create forecast schema
		forecastSchema = mongoose.Schema({
			day: Number,
			condition: String,
			surfaceCovered: Number,
			maxSurface: Boolean
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
		condition: weather.condition
	});

	forecast.save(function (err) {
		if (err) return handleError(err);
	});
};

// Only close the connection when your app is terminating
exports.closeConnection = function() {
	mongoose.connection.db.close(function (err) {
		if(err) throw err;
	});
};