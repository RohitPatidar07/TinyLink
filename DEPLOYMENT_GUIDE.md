# Deploy TinyLink Database to Live Service

Your TinyLink backend is now ready for PostgreSQL! This guide will help you deploy to a free database service.

## Quick Comparison

| Service | Database | Free Tier | Region | Setup Time |
|---------|----------|-----------|--------|------------|
| **Supabase** | PostgreSQL | 500MB | Global | 5 min |
| **Railway** | PostgreSQL/MySQL | $5/month credits | 180+ regions | 10 min |
| **PlanetScale** | MySQL | 5GB free | Global | 5 min |

---

## Option A: Supabase (Recommended - PostgreSQL)

### Why Supabase?
✅ Free 500MB database  
✅ PostgreSQL (fully supported)  
✅ Simple setup  
✅ Dashboard included  

### Setup Steps

#### 1. Create Supabase Account
- Go to [supabase.com](https://supabase.com)
- Click "Start your project"
- Sign up with email or GitHub
- Create a new project
  - **Project Name:** tinylink
  - **Database Password:** Save this securely
  - **Region:** Choose closest to you

#### 2. Get Connection String
- Go to Project Settings → Database
- Copy the **URI** from "Connection string" section
- Should look like: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

#### 3. Extract Connection Details
From the URI, identify:
- **Host:** `[HOST]` (like `project.supabase.co`)
- **Port:** `5432` (default)
- **User:** `postgres`
- **Password:** Your database password
- **Database:** `postgres`

#### 4. Update Backend .env
```bash
# backend/.env
PORT=4000
DB_TYPE=postgres
PG_HOST=project.supabase.co
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=your-password-here
PG_DATABASE=postgres
```

#### 5. Test Connection
```bash
cd backend
npm start
# Should show: "✓ PostgreSQL connection successful"
```

#### 6. Run DB migration (create table)
After you update `backend/.env` with your Supabase credentials you can run the migration script to create the `links` table explicitly (the app also creates the table on connect, but a migration is useful to verify connectivity ahead of running the server):

```bash
cd backend
# install dependencies (if you haven't)
npm install

# Run the migration script which creates the `links` table
npm run migrate

# Expected output:
# Connected to PostgreSQL server: project.supabase.co
# Table `links` created/verified successfully.
```

---

## Option B: Railway (Any Database)

### Why Railway?
✅ $5/month free credits  
✅ Multiple database options  
✅ Easy deployment  

### Setup Steps

#### 1. Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub
- Create new project

#### 2. Add PostgreSQL
- Click "Add Service" → Select "PostgreSQL"
- Copy connection details from "Connect" tab

#### 3. Update .env with Railway Credentials
```bash
DB_TYPE=postgres
PG_HOST=railway-host
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=password
PG_DATABASE=railway
```

---

## Option C: PlanetScale (MySQL)

### Why PlanetScale?
✅ Generous free tier (5GB)  
✅ MySQL ready  
✅ No credit card needed  

### Setup Steps

#### 1. Create PlanetScale Account
- Go to [planetscale.com](https://planetscale.com)
- Sign up (GitHub recommended)
- Create organization

#### 2. Create Database
- Click "Create new database"
- **Database name:** tinylink
- Click "Create database"

#### 3. Get Connection Details
- Click database → "Connect"
- Choose "Node.js"
- Copy connection string

#### 4. Update .env
```bash
DB_TYPE=mysql
MYSQL_HOST=[HOST]
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=tinylink
```

---

## Deployment Checklist

- [ ] Choose a database service (Supabase/Railway/PlanetScale)
- [ ] Create account and database
- [ ] Copy connection credentials
- [ ] Update `backend/.env` with credentials
- [ ] Test connection: `npm start` in backend folder
- [ ] Deploy backend to production (Vercel/Railway/Render)
- [ ] Update frontend API_BASE URL to production backend
- [ ] Deploy frontend to production (Netlify/Vercel)

---

## Testing Connection Locally

Before deploying, test your live database connection:

```bash
cd backend

# Ensure .env has your database credentials
cat .env

# Start backend - it will connect to live database
npm start

# Should output:
# ✓ PostgreSQL connection successful
# ✓ PostgreSQL table verified
# Server running on port 4000
```

---

## Production Deployment

After testing locally with live database:

### Deploy Backend
```bash
# Option 1: Render
# Visit render.com → New → Web Service
# Connect GitHub repo
# Environment: Node.js
# Build command: npm install
# Start command: npm start

# Option 2: Railway
# Visit railway.app
# Import GitHub repo
# Auto-detects Node.js project
# Set PORT=4000 in env vars

# Option 3: Vercel
# Visit vercel.com
# Import GitHub repo
# Deploy
```

### Update Frontend
Update `frontend/index.html` with production backend URL:

```javascript
// Change this:
const API_BASE = 'http://localhost:4000';

// To your production backend:
const API_BASE = 'https://your-production-backend.com';
```

### Deploy Frontend
```bash
cd frontend

# Option 1: Netlify
# npm install -g netlify-cli
# netlify deploy --prod

# Option 2: Vercel
# vercel --prod

# Option 3: GitHub Pages
# Push to gh-pages branch
```

---

## Troubleshooting

### "PostgreSQL connection failed"
- Check PG_HOST, PG_USER, PG_PASSWORD in .env
- Verify database exists
- Check firewall/IP allowlist on database service

### "Cannot connect to database"
- Ensure all credentials are correct
- Verify PORT in .env matches where backend is running
- Check database service status

### "Table already exists"
- Normal message on second startup
- Tables persist in live database ✅

---

## Need Help?

1. Check backend console output: `npm start`
2. Verify .env file is in `backend/` folder
3. Restart backend after changing .env
4. Check database service status page

---

**Next Steps:**
1. Choose your database service above
2. Set up account and get credentials
3. Update `backend/.env`
4. Test with `npm start`
5. Deploy to production when ready!

Current local status:
- ✅ Backend: Running on port 4000
- ✅ Frontend: Running on port 5173
- ✅ All API endpoints working
- ✅ Ready for live database!
