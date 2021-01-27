const knex = require( 'knex' );
const app = require( './app' );

const db = knex({
    client : 'pg',
    connection : 'postgresql://faith@localhost/AoT'
});

app.set( 'db', db );

app.listen( 8080, () => {
    console.log( "Server running in port 8080." );
});