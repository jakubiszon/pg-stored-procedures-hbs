const path = require('path');
const helpers = require('./helpers');

module.exports = {
	templateRoot : path.join( __dirname, '/templates' ),
	partialsRoot : null, //path.join( __dirname, '/partials' ),
	helpers : helpers
};
