# 🚀 Supabase Setup Guide

## Why Supabase?

✅ **Online**: PostgreSQL cloud database  
✅ **Offline**: Works with PouchDB for local storage  
✅ **Realtime**: Live data synchronization  
✅ **Auth**: Built-in authentication  
✅ **Free Tier**: 500MB database, 2GB bandwidth  

---

## Setup Steps

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Sign up / Login
3. Create new project
4. Wait 2 minutes for setup

### 2. Get Credentials
1. Go to Project Settings → API
2. Copy:
   - `Project URL` → SUPABASE_URL
   - `anon public` key → SUPABASE_KEY

### 3. Run Schema
1. Go to SQL Editor
2. Copy contents of `supabase-schema.sql`
3. Run the SQL

### 4. Update Environment Variables

**Backend** (`backend/.env`):
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-anon-key
```

**Frontend** (`frontend/.env`):
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_KEY=your-anon-key
```

**Docker** (`.env.docker`):
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-anon-key
```

### 5. Install Dependencies

**Backend**:
```bash
cd backend
pip install supabase
```

**Frontend**:
```bash
cd frontend
npm install @supabase/supabase-js
```

### 6. Test Connection

**Backend**:
```python
from app.supabase_client import supabase
result = supabase.table('users').select('*').execute()
print(result)
```

**Frontend**:
```javascript
import hybridStorage from './services/supabase'
const contents = await hybridStorage.getContents('user_123')
console.log(contents)
```

---

## How It Works

### Online Mode
```
User Action → Supabase (cloud) → Local Cache (PouchDB)
```

### Offline Mode
```
User Action → PouchDB (local) → Queue for sync
```

### Sync on Reconnect
```
PouchDB → Check unsynced → Upload to Supabase → Mark synced
```

---

## Migration from SQLite

### Option 1: Keep Both (Recommended)
- Use SQLite for local development
- Use Supabase for production
- No code changes needed

### Option 2: Full Migration
1. Export SQLite data
2. Import to Supabase
3. Update `DATABASE_URL` in config

---

## Advantages

| Feature | SQLite | Supabase |
|---------|--------|----------|
| Offline | ✅ | ✅ (with PouchDB) |
| Scalability | ❌ | ✅ |
| Realtime | ❌ | ✅ |
| Backup | Manual | Automatic |
| Multi-user | ❌ | ✅ |
| Cost | Free | Free tier |

---

## Troubleshooting

**Connection Error**: Check SUPABASE_URL and SUPABASE_KEY

**RLS Error**: Disable Row Level Security for testing:
```sql
ALTER TABLE contents DISABLE ROW LEVEL SECURITY;
```

**Sync Issues**: Check browser console for errors

---

## Next Steps

1. ✅ Setup Supabase project
2. ✅ Run schema
3. ✅ Update .env files
4. ✅ Install dependencies
5. ✅ Test connection
6. 🚀 Deploy!
