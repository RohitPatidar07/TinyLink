# Deploy TinyLink Database to Free Live Service

## Option 1: Supabase (FREE - Recommended) ⭐

Supabase provides:
- ✅ Free PostgreSQL database (500MB)
- ✅ Free storage
- ✅ Built-in API
- ✅ Real-time updates
- ✅ No credit card needed

### Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start Your Project"
3. Sign up with Google/GitHub
4. Create a new project (Select India region if available)
5. Wait for database to be created (~2 minutes)

### Step 2: Get Your Database Credentials
1. In Supabase dashboard, go to: **Settings → Database**
2. Copy these details:
   ```
   Host: (something like: db.xxxxx.supabase.co)
   Port: 5432
   Database: postgres
   Username: postgres
   Password: (your password)
   ```

### Step 3: Update Your Backend (.env)
Replace your `.env` file content with:
```
PORT=4000
DB_TYPE=postgres
PG_HOST=db.xxxxx.supabase.co
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=your_password_here
PG_DATABASE=postgres
```

### Step 4: Install PostgreSQL Driver
```powershell
cd backend
npm install pg
```

### Step 5: Update Backend Code
Update `backend/db.js` to use PostgreSQL (provided below)

### Step 6: Restart Backend
```powershell
npm start
```

---

## Option 2: Railway.app (FREE - Also Good)

- ✅ Free database hosting
- ✅ PostgreSQL/MySQL support
- ✅ $5 free credits monthly
- ✅ Easy deployment

Steps:
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project → Add PostgreSQL
4. Copy connection string to `.env`
5. Restart backend

---

## Option 3: PlanetScale (FREE - MySQL)

- ✅ Free MySQL database
- ✅ Generous free tier
- ✅ No credit card needed initially

Steps:
1. Go to https://planetscale.com
2. Sign up
3. Create new database
4. Copy connection string
5. Update `.env` with MySQL credentials

---

## Recommended: Use Supabase + Railway Hosting

**Supabase** for database + **Railway/Render** for hosting backend

This gives you:
- ✅ Free database
- ✅ Free backend hosting
- ✅ Free frontend (Netlify)
- ✅ Completely free solution
- ✅ Production-ready

---

## Quick Decision Guide

| Service | Type | Cost | Best For |
|---------|------|------|----------|
| Supabase | PostgreSQL | Free (500MB) | Small projects |
| Railway | Any DB | Free ($5/mo) | Growing projects |
| PlanetScale | MySQL | Free (10GB) | Data-heavy apps |

---

**Which option do you want me to set up?**

Option A: Supabase (I'll update code)
Option B: Railway (I'll set up connection)
Option C: PlanetScale (MySQL ready)
