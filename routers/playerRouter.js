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
		playerService
			.checkUserLogIn( req.app.get( 'db' ), req.body.username, req.body.password )
			.then( result => {
				res.json( result );
			})
			.catch( next );
	})

	.post( '/', jsonParser, ( req, res, next ) => {
		const { username, password } = req.body;
		bcrypt.hash(password, 10)
			.then((err, hash) => {
				if( err ) {
					return res.status(400).end();
				}
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