module.exports = {
	"$filter" : function( array, optons ) {
		const filterValues = optons.hash;
		return array.filter( isMatch );

		function isMatch( item ) {
			for( key in filterValues ) {
				if( item[ key ] != filterValues[ key ] )
					// one of the specified criteria was not met
					return false;
			}

			// all criteria were satisfied
			return true;
		}
	},

	"$map" : function ( arr, funcOrProperty ) {
		if( typeof funcOrProperty === 'function' )
			return arr.map( funcOrProperty );
		else
			return arr.map ( item => item[funcOrProperty] );
	},

	"$distinct" : function ( arr ) {
		function onlyUnique( value, index, self ) {
			return self.indexOf( value ) === index;
		}

		return arr.filter( onlyUnique );
	},
}
