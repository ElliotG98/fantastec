const mysql = require('mysql2');
const {promisify} = require('util');

module.exports.pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

module.exports.getConnection = async () => {
    return await new Promise((res, rej) => {
        this.pool.getConnection((error, connection) => {
            console.log("error", error);
            if(error) rej(error);
            const query = promisify(connection.query).bind(connection);
            res({connection, query});
        })
    })
}