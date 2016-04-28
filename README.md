# Solar System Simulation

This is a project based in Node.js with the purpose of just fiddling a little with the language, try a few things and have fun.

### Install the project
    $> npm install

### Run the tests
    $> mocha -R spec tests/spec.js 

### Start the project
    $> node server/server.js 

### How to use
* Weather service
`http://localhost:3000/weather?day=<day>`

Returns the weather condition for the given **day**. If the configuration in `.env` is set to `READ_FROM_DB=true`, it will fetch the data from the database instead of calculating it at the moment.

* Simulation service
`http://localhost:3000/simulation?days=<days>`

Returns an array with the simulation of the solar system for each day of the requested **days**.
At the same time, it will populate the DB with such data.

* Statistics service
`http://localhost:3000/simulation/statstics?option=<option>`

By providing the desired option, the specific statistic can be obtained. The possible values are **draught**, **rainy**, **maxRainy** and **optimal**.

The intended implementation would return all of them at once.
