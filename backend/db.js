require('dotenv').config();
const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let pool = null;
let useMySQL = false;
let usingSQLite = false;
let sqliteDb = null;

const tryInitMySQL = async () => {
  try {
    const testPool = mysql.createPool({
      host: process.env.MYSQL_HOST || '127.0.0.1',
      port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'tinylink',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    const conn = await testPool.getConnection();
    conn.release();
    pool = testPool;
    useMySQL = true;
    console.log('✓ MySQL connection successful');
    
    const createSql = `
      CREATE TABLE IF NOT EXISTS links (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(128) UNIQUE,
        url TEXT,
        visits INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        lastVisited TIMESTAMP NULL
      ) ENGINE=InnoDB;
    `;
    await pool.query(createSql);
  } catch (err) {
    console.warn('⚠ MySQL connection failed:', err.message);
    console.log('  Falling back to SQLite...');
    useMySQL = false;
  }
};

const initSQLite = () => {
  if (usingSQLite) return;
  const dbPath = path.join(__dirname, 'db.sqlite');
  sqliteDb = new sqlite3.Database(dbPath);
  sqliteDb.serialize(() => {
    sqliteDb.run(`
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
  usingSQLite = true;
  console.log('✓ Using SQLite (db.sqlite)');
};

// Initialize DB
const init = async () => {
  if (process.env.DB_TYPE && process.env.DB_TYPE.toLowerCase() === 'mysql') {
    await tryInitMySQL();
  }
  if (!useMySQL) {
    initSQLite();
  }
};

// Create new short link
const createLink = async (code, url) => {
  if (useMySQL) {
    const [result] = await pool.query(
      'INSERT INTO links (code, url) VALUES (?, ?)',
      [code, url]
    );
    return { id: result.insertId, code, url };
  } else {
    return new Promise((resolve, reject) => {
      const stmt = sqliteDb.prepare('INSERT INTO links (code, url) VALUES (?, ?)');
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
  if (useMySQL) {
    const [rows] = await pool.query(
      'SELECT * FROM links WHERE code = ? LIMIT 1',
      [code]
    );
    return rows[0] || null;
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.get('SELECT * FROM links WHERE code = ?', [code], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }
};

// Increment clicks
const incrementVisits = async (code) => {
  if (useMySQL) {
    await pool.query(
      'UPDATE links SET visits = visits + 1, lastVisited = CURRENT_TIMESTAMP WHERE code = ?',
      [code]
    );
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.run(
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
  if (useMySQL) {
    const [rows] = await pool.query(
      'SELECT id, code, url, visits, createdAt, lastVisited FROM links ORDER BY id DESC'
    );
    return rows;
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.all(
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
  if (useMySQL) {
    const [res] = await pool.query(
      'DELETE FROM links WHERE code = ?',
      [code]
    );
    return res.affectedRows > 0;
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.run('DELETE FROM links WHERE code = ?', [code], function (err) {
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
  _pool: pool
};
