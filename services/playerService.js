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
	getUser( db, user ){
        return db
                .select( '*' )
                .from( 'userinfo' )
                .where( {username : user} )
                .then( result => {
                    return result[0];
                })
    },
	
}

module.exports = playerService;