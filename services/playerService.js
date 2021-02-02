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
	getUserByUsername( db, username ){
        return db
                .select( '*' )
                .from( 'userinfo' )
                .where( {username} )
                .then( result => {
                    return result;
                })
    },
	
}

module.exports = playerService;