require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: process.env.PG_SSL === 'true' || process.env.PG_HOST?.includes('supabase.co') ? { rejectUnauthorized: false } : false
});

const createTable = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL server:', process.env.PG_HOST);

    const createSql = `
      CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        code VARCHAR(128) UNIQUE NOT NULL,
        url TEXT NOT NULL,
        visits INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "lastVisited" TIMESTAMP NULL
      );
    `;

    await client.query(createSql);
    console.log('Table `links` created/verified successfully.');
    client.release();
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Failed to create table in PostgreSQL:', err.message || err);
    try { await pool.end(); } catch(e){}
    process.exit(1);
  }
};

createTable();
