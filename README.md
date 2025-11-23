# TinyLink - URL Shortener

A simple, fast URL shortener built with Node.js/Express and SQLite (with MySQL fallback support).

## 📋 Project Structure

```
TinyLink/
├── backend/
│   ├── package.json          # Node dependencies
│   ├── index.js              # Express server & routes
│   ├── db.js                 # Database layer (SQLite/MySQL)
│   ├── db.sqlite             # SQLite database (auto-created)
│   ├── .env.example          # Configuration template
│   ├── test-db.js            # Database connection test
│   └── test-api.js           # API test suite
├── frontend/
│   ├── index.html            # Main UI
│   ├── app.js                # Frontend logic & API calls
│   ├── styles.css            # Styling
│   └── test-api.html         # API testing page
├── README.md                 # This file
└── VERIFICATION.md           # Requirements checklist
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+) installed
- Python 3 (for simple HTTP server)
- (Optional) MySQL/MariaDB for persistent storage

### Backend Setup

1. **Install dependencies:**
```powershell
cd backend
npm install
```

2. **Configure (optional):**
   - Copy `.env.example` to `.env`
   - For MySQL, uncomment and fill MySQL settings in `.env`
   - Default uses SQLite (no config needed)

3. **Start server:**
```powershell
npm start
```

Expected output:
```
TinyLink backend running on http://localhost:4000
✓ Using SQLite (db.sqlite)
Database initialized successfully
```

### Frontend Setup

In a **new terminal**:

**Option A: Python HTTP Server**
```powershell
cd ..
python -m http.server 5173 --directory frontend
```

**Option B: npm serve**
```powershell
cd ..
npx serve frontend -l 5173
```

Then open: **http://localhost:5173** in your browser

## 🔌 API Endpoints

### 1. Create Short URL
```http
POST /api/shorten
Content-Type: application/json

{
  "url": "https://github.com"
}
```

**Response:**
```json
{
  "code": "abc1234",
  "shortUrl": "http://localhost:4000/abc1234",
  "url": "https://github.com"
}
```

### 2. List All Links
```http
GET /api/links
```

**Response:**
```json
[
  {
    "id": 1,
    "code": "abc1234",
    "url": "https://github.com",
    "visits": 5,
    "createdAt": "2025-11-23 12:00:00",
    "lastVisited": "2025-11-23 12:05:00"
  }
]
```

### 3. Redirect to Original URL
```http
GET /:code
```

Example: `GET http://localhost:4000/abc1234`

**Response:** HTTP 302 redirect to original URL + increments visit count

## 🧪 Testing

### Manual API Tests (PowerShell)

```powershell
# Create a link
$body = @{ url = "https://google.com" } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:4000/api/shorten `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

# List all links
Invoke-RestMethod -Uri http://localhost:4000/api/links -Method GET

# Test redirect (replace abc1234 with actual code)
Invoke-WebRequest -Uri http://localhost:4000/abc1234 -MaximumRedirection 0
```

### Browser Testing

1. Open http://localhost:5173
2. Enter a URL (e.g., `github.com` or `https://example.com`)
3. Click "Shorten"
4. Verify short URL appears
5. Click the generated short link to test redirect
6. Check visit count increments in the list

### Automated Tests

```powershell
cd backend
npm run check-db      # Test database connection
node test-api.js      # Test API endpoints
```

## 💾 Database

### SQLite (Default)
- **File:** `backend/db.sqlite` (auto-created)
- **No configuration needed**
- **Perfect for:** Development, testing, small deployments

### MySQL/MariaDB (Optional)
1. Create database:
```sql
CREATE DATABASE tinylink;
CREATE USER 'tluser'@'%' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON tinylink.* TO 'tluser'@'%';
FLUSH PRIVILEGES;
```

2. Edit `backend/.env`:
```
DB_TYPE=mysql
MYSQL_HOST=your-host
MYSQL_PORT=3306
MYSQL_USER=tluser
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=tinylink
```

3. Restart backend - it will auto-migrate schema

## ⚙️ Configuration

Create `backend/.env`:
```
PORT=4000

# Optional MySQL settings
DB_TYPE=mysql
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=tinylink
```

## 🔧 Troubleshooting

### Port Already in Use (4000 or 5173)
```powershell
# Kill process on port 4000
netstat -ano | findstr ":4000" | ForEach-Object { $parts = $_ -split '\s+'; taskkill /PID $parts[-1] /F }

# Kill process on port 5173
netstat -ano | findstr ":5173" | ForEach-Object { $parts = $_ -split '\s+'; taskkill /PID $parts[-1] /F }
```

### MySQL Connection Error
**Error:** "Host 'localhost' is not allowed to connect"

**Solution:** Backend automatically falls back to SQLite. To fix MySQL:
1. Ensure MySQL user has correct host permissions
2. Check firewall/network settings
3. Verify credentials in `.env`

### API Returns Empty Response
- Ensure backend is running: `http://localhost:4000` should be accessible
- Check browser console for CORS errors
- Verify both servers are on correct ports

### Database Error
```powershell
npm run check-db    # Diagnose connection
```

## 📦 Dependencies

**Backend:**
- `express` - Web framework
- `cors` - Cross-Origin Resource Sharing
- `body-parser` - JSON parsing
- `nanoid` - Unique code generation
- `sqlite3` - SQLite driver
- `mysql2` - MySQL driver
- `dotenv` - Environment configuration

## 🎯 Features

- ✅ Create short URLs from long ones
- ✅ Track visits/clicks per link
- ✅ List all created links with stats
- ✅ Auto-redirect with visit counter
- ✅ Clean, responsive UI
- ✅ SQLite default (zero-config)
- ✅ MySQL support (for production)
- ✅ CORS enabled for API calls
- ✅ Error handling & graceful fallback

## 📈 Next Steps

### Production Deployment
- Switch to MySQL for persistent storage
- Add authentication/authorization
- Implement rate limiting
- Add logging & monitoring
- Use environment-specific configs

### Enhanced Features
- Custom short codes
- Link expiration/TTL
- Analytics dashboard
- QR code generation
- Admin panel

## 📝 License

MIT - Free to use and modify

## 👤 Support

For issues or questions, check:
1. VERIFICATION.md - Requirements checklist
2. Terminal output for errors
3. Browser console for frontend issues

