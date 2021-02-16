const knex = require( 'knex' );
const app = require( './app' );

const db = knex({
	client : 'pg',
	connection : 'postgres://ajkdrchudfvnxs:681050c6379791b18a2ef607bd94cf8577c69bb80e290e0c72b708aba12dd5b8@ec2-34-230-167-186.compute-1.amazonaws.com:5432/ddu3ktou2ums7u'

});

app.set( 'db', db );

app.listen( 8080, () => {
	console.log( "Server running in port 8080." );
});