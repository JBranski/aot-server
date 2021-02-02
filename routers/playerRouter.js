const express = require( 'express' );

const playerRouter = express.Router();
const jsonParser = express.json();
const bcrypt = require('bcrypt');
const jwt = require( 'jsonwebtoken' );
const playerService = require( './../services/playerService' );
const { rejects } = require('assert');

playerRouter
	.post( '/users', jsonParser, ( req, res, next ) => {
	
		const saltRounds = 10;
		bcrypt.genSalt(saltRounds, function(err, salt) {
			bcrypt.hash(req.body.password, salt)
			.then((hash) => {
				const newUser = {
					username : req.body.username,
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
	})
	.post( '/login', jsonParser, (req, res, next) => {
	const {username, password} = req.body;
	playerService
        .getUser( req.app.get( 'db' ), username )
        .then( result => {
            if( ! result ){
                res.statusMessage = "That user doesn't exist.";
                return res.status( 404 ).end();
            }

            const sessionObj = {
                username : result.username,
            };
            bcrypt.compare( password, result.password )
                .then( result => {
                    if( result ){
                        jwt.sign( sessionObj, 'secret', { expiresIn : '5m' }, ( err, token ) => {
                            if( ! err ){
                                return res.status( 200 ).json( { token } );
                            }
                            else{
                                res.statusMessage = "Something went wrong with the generation of the token.";
                                return res.status( 406 ).end();
                            }
                        });
                    }
                    else{
                        return res.status( 401 ).json( "Your credentials are wrong!");
                    }
                })
		})
	})
	.get( '/users', jsonParser, (req, res) => {
		const username = req.body.username;
		console.log(req.body)
		playerService
			.getUserByUsername( req.app.get('db'), username)
			.then( result => {
				res.json(result);
			})
	})

module.exports = playerRouter;