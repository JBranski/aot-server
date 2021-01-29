const bcrypt = require('bcrypt');

const playerService = {
	createUser( db, newUser ) {
		return db
			.insert( newUser )
			.into( 'userinfo' )
			.returning( '*' )
			.then( result => {
				return result[0]
			})
	},

	getUserByUserName( db, userName ) {
		return db
			.select( '*' )
			.from( 'userinfo' )
			.where( {username: userName} )
			.then( result => {
				return result;
			})
	}, 

	checkUserLogIn( db, username, password ) {
		return db
			.first()
			.from( 'userinfo' )
			.where( {username: username})
			.then( data => {
				return data;
				
			})
	}
}

module.exports = playerService;