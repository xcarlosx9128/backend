const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(); // Usa automáticamente las variables del .env

module.exports = pool;
