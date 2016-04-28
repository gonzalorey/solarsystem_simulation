# Solar System Simulation

This is a project based in Node.js with the purpose of just fiddling a little with the language, try a few things and have fun.

### Install the project
    $> npm install

### Run the tests
    $> mocha -R spec tests/spec.js 

### Start the project locally
    $> node server/server.js 

### Heroku integration

Install and deploy locally
	$> heroku local

Deploy to production
	$> git push heroku master
	$> heroku open

### How to use
* Weather service
`http://localhost:3000/weather?day=<day>`

Returns the weather condition for the given **day**. If the configuration in `.env` is set to `READ_FROM_DB=true`, it will fetch the data from the database instead of calculating it at the moment.

* Simulation service
`http://localhost:3000/simulation?days=<days>`

Returns an array with the simulation of the solar system for each day of the requested **days**.
At the same time, it will populate the DB with such data.

* Statistics service
`http://localhost:3000/simulation/statistics`

Returns the statistics taken from the simulation, with the **draughtDays**, **rainyDays** and **maxRainyPeriods**, and the **optimalWeatherDays**.
