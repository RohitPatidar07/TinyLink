require('dotenv').config();
const path = require('path');

// Determine which database to use
const dbType = (process.env.DB_TYPE || 'sqlite').toLowerCase();

let db = null;
let usePostgres = false;
let useSQLite = false;

const init = async () => {
  if (dbType === 'postgres' || dbType === 'postgresql') {
    usePostgres = true;
    const { Pool } = require('pg');
    
    const pool = new Pool({
      host: process.env.PG_HOST,
      port: process.env.PG_PORT || 5432,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE
    });

    try {
      const client = await pool.connect();
      console.log('✓ PostgreSQL connection successful');
      client.release();

      // Create table if not exists
      await pool.query(`
        CREATE TABLE IF NOT EXISTS links (
          id SERIAL PRIMARY KEY,
          code VARCHAR(128) UNIQUE NOT NULL,
          url TEXT NOT NULL,
          visits INTEGER DEFAULT 0,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "lastVisited" TIMESTAMP NULL
        )
      `);

      db = pool;
      console.log('✓ PostgreSQL table created/verified');
    } catch (err) {
      console.error('✗ PostgreSQL connection failed:', err.message);
      console.log('Falling back to SQLite...');
      usePostgres = false;
      initSQLite();
    }
  } else {
    initSQLite();
  }
};

const initSQLite = () => {
  useSQLite = true;
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = path.join(__dirname, 'db.sqlite');
  
  db = new sqlite3.Database(dbPath);
  
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE,
        url TEXT,
        visits INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastVisited DATETIME NULL
      )
    `);
  });
  
  console.log('✓ Using SQLite (db.sqlite)');
};

// Create short link
const createLink = async (code, url) => {
  if (usePostgres) {
    const result = await db.query(
      'INSERT INTO links (code, url) VALUES ($1, $2) RETURNING id, code, url',
      [code, url]
    );
    return { id: result.rows[0].id, code, url };
  } else {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare('INSERT INTO links (code, url) VALUES (?, ?)');
      stmt.run(code, url, function (err) {
        stmt.finalize();
        if (err) return reject(err);
        resolve({ id: this.lastID, code, url });
      });
    });
  }
};

// Find link by code
const findByCode = async (code) => {
  if (usePostgres) {
    const result = await db.query(
      'SELECT * FROM links WHERE code = $1 LIMIT 1',
      [code]
    );
    return result.rows[0] || null;
  } else {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM links WHERE code = ?', [code], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }
};

// Increment visits
const incrementVisits = async (code) => {
  if (usePostgres) {
    await db.query(
      'UPDATE links SET visits = visits + 1, "lastVisited" = CURRENT_TIMESTAMP WHERE code = $1',
      [code]
    );
  } else {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE links SET visits = visits + 1, lastVisited = CURRENT_TIMESTAMP WHERE code = ?',
        [code],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }
};

// List all links
const listLinks = async () => {
  if (usePostgres) {
    const result = await db.query(
      'SELECT id, code, url, visits, "createdAt", "lastVisited" FROM links ORDER BY id DESC'
    );
    return result.rows;
  } else {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT id, code, url, visits, createdAt, lastVisited FROM links ORDER BY id DESC',
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }
};

// Delete link
const deleteLink = async (code) => {
  if (usePostgres) {
    const result = await db.query(
      'DELETE FROM links WHERE code = $1',
      [code]
    );
    return result.rowCount > 0;
  } else {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM links WHERE code = ?', [code], function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    });
  }
};

module.exports = {
  init,
  createLink,
  findByCode,
  incrementVisits,
  listLinks,
  deleteLink,
  db
};
