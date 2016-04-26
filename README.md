# Solar System Simulation

This is a project based in Node.js with the purpose of just fiddling a little with the language, try a few things and have fun.

### Install the project
$> npm install

### Run the tests
$> mocha -R spec tests/spec.js 

### Start the project
$> node server/server.js 

### How to use
* Planets service
`http://localhost:3000/planets?day=<day>`

Returns the state of the planets on the given **day**.

* Simulation service
`http://localhost:3000/simulation?days=<days>`

Returns an array with the simulation of the solar system for each day of the requested **days**.
