# Quick Start Checklist

Get Smart Cameos up and running in 5 minutes.

## Prerequisites
- Supabase project created
- Environment variables configured in `.env`

## Step 1: Run Database Migration (5 minutes)

1. Open https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in left sidebar
4. Click **New Query**
5. Open `migrations/001_initial_schema.sql`
6. Copy ALL contents (24KB file)
7. Paste into SQL Editor
8. Click **Run** or press Ctrl/Cmd + Enter
9. Wait for "Success. No rows returned"

## Step 2: Verify Tables Created (30 seconds)

In SQL Editor, run:
```sql
SELECT count(*) FROM user_profiles;
```

Should return `0` (table exists, no users yet).

## Step 3: Test Authentication (2 minutes)

1. App should already be running
2. Click "Get Started"
3. Fill in signup form:
   - Email: test@example.com
   - Password: test123456
   - Username: testuser
4. Click "Sign Up"
5. Should see main app with 100 credits

## Step 4: Test Video Generation (2 minutes)

1. Enter a prompt in bottom bar
2. Click generate
3. Credits should decrease to 99
4. Generation should appear in feed
5. Click "Library" to see history

## Verify Everything Works

Check these items:
- [ ] Tables created in Supabase
- [ ] User signup works
- [ ] Profile created with 100 credits
- [ ] Can sign out and sign in
- [ ] Credits deduct on generation
- [ ] Generation appears in library
- [ ] Credit transactions logged

## Common Issues

**"relation user_profiles does not exist"**
→ Run the migration script

**"Invalid login credentials"**
→ Sign up first, then sign in

**"Insufficient credits"**
→ Check user_profiles table for credit balance

**Generation doesn't start**
→ Check API key configuration

## Next Steps

Once everything works:
1. Read `SETUP_GUIDE.md` for detailed info
2. Check `DATABASE_SCHEMA.md` for schema reference
3. Explore AI tools in the interface
4. Set up brand guidelines
5. Create your first campaign

## Production Checklist

Before deploying:
- [ ] Database migration complete
- [ ] RLS policies verified
- [ ] Authentication tested thoroughly
- [ ] Credit system working correctly
- [ ] Error handling tested
- [ ] Build completed successfully
- [ ] Environment variables secured

## Support Files

- `SETUP_GUIDE.md` - Complete setup guide
- `DATABASE_SCHEMA.md` - Schema documentation
- `SUPABASE_INTEGRATION_COMPLETE.md` - Integration details
- `migrations/README.md` - Migration instructions

## Success!

If all checks pass, your Smart Cameos app is ready to use!

Start creating amazing AI-generated videos with your personalized characters.
