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
			.where( {userName} )
			.then( result => {
				return result;
			})
	} 
}