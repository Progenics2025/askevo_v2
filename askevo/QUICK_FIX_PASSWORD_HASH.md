# Quick Fix - Password Hash Issue

## The Problem

The `#` in `Prolab#05` was being treated as a comment in the `.env` file!

```
DB_PASSWORD=Prolab#05
```

Was read as:

```
DB_PASSWORD=Prolab
# 05 (comment)
```

## The Fix

Quote the password:

```env
DB_PASSWORD="Prolab#05"
```

## Already Fixed

The `.env` file has been updated. Just restart:

```bash
cd askevo/backend
npm run dev
```

You should see:
```
✓ Database connected successfully
```

## Verify

```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

---

**That's it! Your backend should now work!** 🧬
