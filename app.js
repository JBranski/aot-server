const express = require( 'express' );
const app = express();
const playerRouter = require( './routers/playerRouter' );

app.use( '/', playerRouter)
app.use(playerRouter)

module.exports = app;