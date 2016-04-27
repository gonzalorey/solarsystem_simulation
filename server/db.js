var mongoose = require('mongoose');

// var mongodbUri = 'mongodb://user:pass@host:port/db';
var mongodbUri = 'mongodb://localhost/test'

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
			weather: String,
			surfaceCovered: Number,
			maxSurface: Boolean
		});

		// Store forecast documents in a collection called "forecasts"
		Forecast = mongoose.model('forecasts', forecastSchema);
	});
};

exports.getForecast = function(day, callback) {
	Forecast.find({day: day}).exec(function(err, docs) {
		// console.log('err: ', err);
		// console.log('docs: ', docs);

		if (err) return handleError(err);

		callback(docs);
	});
};

exports.saveForecast = function(simulation) {
	// console.log('saving simulation ', simulation)

	var forecast = new Forecast({ 
		day: simulation.day, 
		weather: simulation.isDraught
			? "Draught" 
			: ( simulation.isRainy
				? "Rainy" 
				: ( simulation.isOptimal
					? "Optimal" 
					: "Normal"
				)
			)
		// surfaceCovered: simulation.surface,
		// maxSurface: simulation.maxSurface
	});

	// console.log('Saving ', forecast);

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