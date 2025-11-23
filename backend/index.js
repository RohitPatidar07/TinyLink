const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { nanoid } = require("nanoid");
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Initialize database after server starts
let dbReady = false;
db.init().then(() => {
  dbReady = true;
  console.log('Database initialized successfully');
}).catch(err => {
  console.error('Database init error:', err);
  // Server continues even if DB init fails
});

app.post('/api/shorten', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing url in body' });
    // basic validation
    let normalized = url;
    if (!/^https?:\/\//i.test(url)) normalized = 'https://' + url;

    const code = nanoid(7);
    await db.createLink(code, normalized);
    const shortUrl = `${req.protocol}://${req.get('host')}/${code}`;
    res.json({ code, shortUrl, url: normalized });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/links', async (req, res) => {
  try {
    const rows = await db.listLinks();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const row = await db.findByCode(code);
    if (!row) return res.status(404).send('Not found');
    await db.incrementVisits(code);
    res.redirect(row.url);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`TinyLink backend running on http://localhost:${PORT}`);
});