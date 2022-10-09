const util = require( 'util' );
const mysql = require( 'mysql' );
function makeDb( config ) {
        const connection = mysql.createConnection( config );
        return {
            query( sql, args ) {
            return util.promisify( connection.query )
                .call( connection, sql, args );
        },
        close() {
            return util.promisify( connection.end ).call( connection );
        }
    };
}

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

module.exports = makeDb(dbConfig);