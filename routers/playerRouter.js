const express = require( 'express' );
const playerRouter = express.Router();
const jsonParser = express.json();
const bcrypt = require('bcrypt');
const playerService = require( './../services/playerService' );

playerRouter
	.get('/', ( req, res, next ) => {
		playerService
			.getUserByUserName( req.app.get( 'db' ), req.body.username)
			.then( result => {
				res.json( result );
			})
			.catch( next );
	})

	.post( '/api/login', jsonParser, (req, res, next) => {
		const {username, password} = req.body;
		console.log("test");
		playerService
			.checkUserLogIn( req.app.get( 'db' ), req.body.username, req.body.password )
			.then( data => {
				console.log(data);
				bcrypt.compare(password, data.password)
					.then(( result ) => {
						if( result ) {
							return res.status( 200 ).json({ message: `welcome back`})
						} else {
							return res.status( 401 ).send( "wrong credentials" );
						}
					})
			}) 
			.catch( next );
	})

	.post( '/', jsonParser, ( req, res, next ) => {
		const { username, password } = req.body;
		bcrypt.hash(password, 10)
			.then((hash) => {
				const newUser = {
					username : username,
					password : hash
				}
				playerService
					.createUser( req.app.get( 'db' ), newUser)
					.then( result => {
						return res.status(201).json( result )
					})
					.catch( next );
			}) 
		})

module.exports = playerRouter;