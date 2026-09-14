const mysql = require('mysql2/promise');
const config = require('../config/config');

// Crea la base de datos si no existe. Se conecta al servidor MySQL sin
// seleccionar una DB, porque Sequelize falla si la DB todavia no existe.
async function createDatabase() {
    const connection = await mysql.createConnection({
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password
    });

    try {
        await connection.query(
            `CREATE DATABASE IF NOT EXISTS ${mysql.escapeId(config.db.name)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
        );
    } finally {
        await connection.end();
    }
}

module.exports = createDatabase;
