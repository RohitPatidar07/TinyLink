const db = require('./db');

// Initialize DB schema (idempotent)
db.init();

// List links to verify connectivity
db.listLinks()
  .then(rows => {
    console.log('SQLite connection OK. Links count:', rows.length);
    if (rows.length) console.table(rows);
    process.exit(0);
  })
  .catch(err => {
    console.error('SQLite connection ERROR:', err);
    process.exit(1);
  });
