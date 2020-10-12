const path = require('path');
const fs = require('fs').promises;
const table2json = require( 'table2json' );
const json2src = require( 'json2src' );

// here we just connec to the outside folder
// you will need to reference template's package
const templateData = require('../index');
const connectionData = require('./db');

// update to the schema name you use
const schema_name = 'public';

run();

async function run( ) {

	let tables = await loadTables();
	
	//console.log( tables.map( t => t.tablename ) );

	const engine = await json2src( templateData );

	const tablePromises = procesTables( tables, engine );

	await Promise.all( tablePromises );

	await saveTables( tables );
}

/**
 * Return an array of table definitions.
 */
async function loadTables ( ) {
	const dbreader = table2json( 'postgresql');

	await dbreader.open( connectionData );

	// get table names for schema_name
	const tableNames = await dbreader.listTables( schema_name );

	// get table definitions
	const tableData = await Promise.all( tableNames.map( tname => dbreader.defineTable( schema_name, tname) ) );

	// close the reader now
	await dbreader.close( );

	return tableData;
}

/**
 * Returns a promise that resolves when all output files are saved
 * @param {Array} tables array of table-data objects returned by json2src.dbReader
 * @param {function} engine function returned by json2src.engine
 * @returns {Promise[]}
 */
function procesTables ( tables, engine ) {

	let result = [];
	let outputRoot = path.join( __dirname, '/output' );

	for( let idx=0; idx < tables.length; idx ++) {
		let runParams = {
			data : tables[ idx ],
			outputRoot : outputRoot,
			filePrefix : tables[ idx ].tablename
		}
	
		// store a promise in the return array
		result[ idx ] = engine( runParams );
	}

	return result;
}

async function saveTables ( tableData ) {

	const filePromises = tableData.map(
		tableObject => fs.writeFile(
			`output-json/${tableObject.tablename}.json`,
			JSON.stringify( tableObject, null, 4 )
		)
	);

	await Promise.all( filePromises );
}
