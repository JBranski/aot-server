const express = require( 'express' );
const app = express();
const cors = require('cors')
const jsonParser = express.json();
const playerRouter = require( './routers/playerRouter' );

const corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200
  }

app.use(cors(corsOptions));
app.use(jsonParser);
app.use('/', playerRouter);
app.use((req, res, next) => { res.status(404).json({dink: true})})

module.exports = app;