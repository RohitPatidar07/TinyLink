# How to Deploy Your TinyLink Database - Visual Guide

## 🎯 Goal
Deploy your TinyLink database from local SQLite to a free live service (Supabase/Railway/PlanetScale)

---

## 📊 Decision Matrix

```
┌─────────────────┬──────────────────┬──────────┬──────────┐
│ Service         │ Database Type    │ Free MB  │ Setup    │
├─────────────────┼──────────────────┼──────────┼──────────┤
│ Supabase ⭐     │ PostgreSQL       │ 500 MB   │ 5 min    │
│ Railway         │ PostgreSQL/MySQL │ $5 credit│ 10 min   │
│ PlanetScale     │ MySQL            │ 5000 MB  │ 5 min    │
└─────────────────┴──────────────────┴──────────┴──────────┘

RECOMMENDATION: Use Supabase (simplest PostgreSQL setup)
```

---

## 🚀 Quick Start Flow

```
1. Pick Database Service
   ↓
2. Create Free Account
   ↓
3. Get Connection Credentials
   ↓
4. Update backend/.env
   ↓
5. Test Locally (npm start)
   ↓
6. Deploy to Production
```

---

## 💾 Option A: Supabase (PostgreSQL) - RECOMMENDED

### ✅ Why Supabase?
- ✨ Free 500MB PostgreSQL database
- 🔐 Secure cloud-hosted
- 📊 Dashboard included
- 🚀 Easy setup
- 🌍 Global CDN
- 💯 Perfect for TinyLink

### 🔧 Setup Steps

#### Step 1️⃣ Create Account
```
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up (Email or GitHub)
4. Create new project
   - Project Name: tinylink
   - Password: Save somewhere safe!
   - Region: Choose closest to you
5. Wait for project to initialize
```

#### Step 2️⃣ Find Connection String
```
In Supabase Dashboard:
1. Left sidebar → Project Settings
2. Click "Database"
3. Scroll to "Connection string"
4. Copy the "URI" (looks like below)
```

```
postgresql://postgres:[PASSWORD]@[PROJECT].supabase.co:5432/postgres
```

#### Step 3️⃣ Extract Components
```
From: postgresql://postgres:PASSWORD@db.supabase.co:5432/postgres

Extract these values:
┌─────────────┬──────────────────────────────┐
│ Component   │ Value                        │
├─────────────┼──────────────────────────────┤
│ PG_HOST     │ db.supabase.co               │
│ PG_PORT     │ 5432 (default)               │
│ PG_USER     │ postgres                     │
│ PG_PASSWORD │ [Your project password]      │
│ PG_DATABASE │ postgres                     │
└─────────────┴──────────────────────────────┘
```

#### Step 4️⃣ Update Configuration
```bash
# Edit: backend/.env
# Replace content with:

PORT=4000
DB_TYPE=postgres
PG_HOST=db.supabase.co
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=your_password_here
PG_DATABASE=postgres
```

#### Step 5️⃣ Test Connection
```bash
# In terminal:
cd backend
npm start

# Expected output:
# ✓ PostgreSQL connection successful
# ✓ PostgreSQL table verified
# Database initialized successfully
# TinyLink backend running on http://localhost:4000
```

#### Step 6️⃣ Verify Data
```bash
# In another terminal:
curl http://localhost:4000/api/links

# Should return:
# [] (empty if first time)
# or [list of links] if migrating existing data
```

---

## 🚂 Option B: Railway

### ✅ Why Railway?
- 💰 $5/month free credits
- 🎯 Easy GitHub integration
- 🌍 180+ deployment regions
- 📦 Deploy backend directly

### 🔧 Setup Steps

#### Step 1️⃣ Create Account
```
1. Go to https://railway.app
2. Sign up with GitHub
3. Link your GitHub account
4. Create new project
```

#### Step 2️⃣ Add Database
```
1. Click "Add Service"
2. Select "PostgreSQL"
3. Railway creates database automatically
4. Copy connection details
```

#### Step 3️⃣ Update .env
```
DB_TYPE=postgres
PG_HOST=railway-host-from-dashboard
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=your-password
PG_DATABASE=railway
```

#### Step 4️⃣ Test & Deploy
```bash
# Test locally
npm start

# Deploy with Railway CLI
npm install -g @railway/cli
railway deploy
```

---

## 🪐 Option C: PlanetScale (MySQL)

### ✅ Why PlanetScale?
- 📦 5GB free tier (generous!)
- 💥 Lightning fast
- 🔄 Built-in replication
- 📊 No credit card required

### 🔧 Setup Steps

#### Step 1️⃣ Create Account
```
1. Go to https://planetscale.com
2. Sign up (GitHub recommended)
3. Create organization
```

#### Step 2️⃣ Create Database
```
1. Click "Create database"
2. Name: tinylink
3. Region: closest to you
4. Click "Create database"
```

#### Step 3️⃣ Get Connection Details
```
1. Open database
2. Click "Connect"
3. Select "Node.js"
4. Copy connection string
```

#### Step 4️⃣ Update .env
```
DB_TYPE=mysql
MYSQL_HOST=psc-123456.us-east-1.psdb.cloud
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=tinylink
```

#### Step 5️⃣ Test
```bash
npm start
# Should show: ✓ MySQL connection successful
```

---

## 📋 Complete Configuration Guide

### PostgreSQL (.env)
```bash
DB_TYPE=postgres
PG_HOST=your-host.supabase.co
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=your_secure_password
PG_DATABASE=postgres
```

### MySQL (.env)
```bash
DB_TYPE=mysql
MYSQL_HOST=your-host.psdb.cloud
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_secure_password
MYSQL_DATABASE=tinylink
```

### SQLite (.env) - DEFAULT
```bash
DB_TYPE=sqlite
# No additional configuration needed!
```

---

## ✅ Testing Checklist

After updating `.env`, verify everything works:

```bash
# 1. Update .env file with credentials
✓ Edit backend/.env
✓ Save file

# 2. Start backend
✓ cd backend
✓ npm start
✓ Should show: ✓ PostgreSQL connection successful

# 3. Test API endpoint
✓ curl http://localhost:4000/api/links
✓ Should return: [] or [array of links]

# 4. Create test link
✓ curl -X POST http://localhost:4000/api/shorten \
    -H "Content-Type: application/json" \
    -d '{"url":"https://example.com"}'
✓ Should return: {code: "xyz123", ...}

# 5. Verify redirect
✓ curl http://localhost:4000/xyz123
✓ Should redirect (302 status) to https://example.com
```

---

## 🎯 Migration Path

```
LOCAL ENVIRONMENT          PRODUCTION ENVIRONMENT
┌──────────────────┐      ┌──────────────────┐
│   SQLite         │      │   Live DB        │
│   (db.sqlite)    │      │   (PostgreSQL    │
│                  │  →   │    or MySQL)     │
│  npm start       │      │   On Supabase    │
│ :4000            │      │   or Railway     │
└──────────────────┘      └──────────────────┘
```

### Step-by-Step Migration

```
1. Local Testing
   └─ Your machine
   └─ SQLite database
   └─ http://localhost:4000

2. Configure Live Database
   └─ Choose service (Supabase/Railway/PlanetScale)
   └─ Create account & database
   └─ Get credentials

3. Update Configuration
   └─ Edit backend/.env
   └─ Add live database credentials
   └─ Keep DB_TYPE = postgres/mysql

4. Test Locally with Live DB
   └─ npm start
   └─ Should connect to live database
   └─ Tables created automatically

5. Deploy Backend to Production
   └─ Vercel, Railway, or Render
   └─ Set same environment variables
   └─ Backend running on live URL

6. Deploy Frontend to Production
   └─ Netlify or Vercel
   └─ Update API_BASE = "https://your-backend.com"
   └─ Deploy

7. Live Application Ready!
   └─ Frontend: https://your-frontend.com
   └─ Backend: https://your-backend.com
   └─ Database: Supabase/Railway/PlanetScale
```

---

## 🚨 Troubleshooting

### Problem: "PostgreSQL connection failed"

**Solution:**
```
1. Check .env file exists and has correct values
2. Verify PG_HOST spelling (copy-paste from dashboard)
3. Verify PG_PASSWORD has no special characters
   (If it has special chars, wrap in quotes)
4. Check database service status page
5. Restart backend: npm start
```

### Problem: "Cannot connect to database"

**Solution:**
```
1. Verify .env is in backend/ folder
2. Verify DB_TYPE=postgres (not 'postgresql')
3. Check credentials one more time
4. Restart: npm start
5. Check backend console for detailed error
```

### Problem: "Table already exists"

**Solution:**
```
This is NORMAL on second startup! ✅
- Tables persist in your database
- Data is saved between restarts
- No action needed
```

### Problem: "Empty links list"

**Solution:**
```
This is NORMAL on first launch! ✅
1. Create a short link to populate database
   curl -X POST http://localhost:4000/api/shorten \
     -H "Content-Type: application/json" \
     -d '{"url":"https://example.com"}'
   
2. List links again:
   curl http://localhost:4000/api/links
```

---

## 🎁 What You Get

After setup, you'll have:

```
✅ Live PostgreSQL/MySQL Database
   └─ Automatically backs up
   └─ Scales as you grow
   └─ Accessible from anywhere

✅ Connection Credentials
   └─ Stored in backend/.env
   └─ Never exposed to frontend

✅ Automatic Table Creation
   └─ tables created on first connection
   └─ Schema exactly right

✅ Persistent Data
   └─ Survives backend restarts
   └─ Survives deployments

✅ Production Ready
   └─ Can deploy backend to production
   └─ Can deploy frontend to production
   └─ Live application ready!
```

---

## 📱 After Deployment

### Live Application URL Structure
```
Frontend (User Interface)
https://your-frontend.netlify.com
  ↓ (calls API)
Backend (API Server)  
https://your-backend.vercel.com
  ↓ (stores data)
Database (Live)
supabase.co / railway.app / planetscale.com
```

### Testing Your Live App
```bash
1. Visit: https://your-frontend.com
2. Enter URL: https://example.com
3. Click "Shorten"
4. Get: https://your-frontend.com/abc123
5. Click short link
6. Redirects to: https://example.com ✅
```

---

## 🎯 Recommended Path

```
START HERE ⬇️

┌─ SUPABASE (PostgreSQL) ⭐ BEST FOR BEGINNERS
│  └─ Free 500MB
│  └─ Easiest setup
│  └─ Full-featured
│
├─ RAILWAY (Any Database)
│  └─ $5/month credits
│  └─ Easy GitHub deploy
│  └─ Multiple regions
│
└─ PLANETSCALE (MySQL)
   └─ 5GB free tier
   └─ Lightning fast
   └─ No credit card
```

**Recommendation:** Start with **Supabase** (easiest, best docs)

---

## 📚 Quick Reference

| What | Where |
|------|-------|
| Account | supabase.com |
| Dashboard | https://app.supabase.com |
| Connection String | Project Settings → Database |
| Documentation | https://supabase.com/docs |
| Support | Supabase Discord |

---

## ✨ You're Ready!

Everything is set up for PostgreSQL. Just:

1. ✅ Choose service
2. ✅ Create database  
3. ✅ Update .env
4. ✅ Test with npm start
5. ✅ Deploy!

**Questions?** Read DEPLOYMENT_GUIDE.md for detailed steps.

---

**Current Status:** Backend ready for live database 🚀  
**Backend:** http://localhost:4000 (running with SQLite)  
**Next:** Choose your database service and follow setup above!
