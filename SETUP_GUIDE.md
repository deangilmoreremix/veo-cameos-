# Smart Cameos - Setup Guide

Complete guide for setting up Supabase authentication and database integration.

## Overview

This application uses Supabase for:
- User authentication (email/password)
- User profiles and credit management
- Video generation history
- AI tool configurations and workflows
- Performance tracking and analytics

## Prerequisites

1. A Supabase account and project
2. Supabase project URL and anon key (already configured in `.env`)

## Step 1: Database Setup

### Run the Migration Script

1. Open your Supabase project dashboard at https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Open the migration file at `migrations/001_initial_schema.sql`
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** to execute

This will create:
- 12 database tables with proper relationships
- Row Level Security (RLS) policies on all tables
- Automatic triggers for profile creation and timestamp updates
- Performance-optimized indexes
- Default pricing tiers

### Verify Installation

After running the migration, verify tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see 12 tables including `user_profiles`, `generations`, `campaigns`, etc.

## Step 2: Authentication Configuration

The authentication is already configured in the application. Here's what's included:

### Features
- Email/password authentication
- Automatic user profile creation on signup
- Session management with auto-refresh
- Protected routes and data access

### User Flow
1. New users sign up with email, password, and username
2. Profile is automatically created with 100 free credits
3. Users can sign in/out
4. Authentication state persists across sessions

### Testing Authentication

1. Start the development server (already running)
2. Click "Get Started" or "Sign In"
3. Create a new account with:
   - Email address
   - Password (min 6 characters)
   - Username
4. After signup, you'll be signed in automatically
5. Check your profile to see 100 starting credits

## Step 3: Understanding the Database Schema

### Core Tables

**user_profiles**
- Stores user information and credit balance
- Automatically created on signup
- Tracks total credits spent

**generations**
- Records all video generation attempts
- Links to user profiles
- Tracks status (generating, success, error)
- Stores video URLs when successful

**credit_transactions**
- Complete audit log of all credit changes
- Supports purchases, generations, refunds, bonuses
- Immutable transaction history

**pricing_tiers**
- Available credit packages
- Pre-seeded with 4 tiers (Starter, Creator, Pro, Enterprise)

### AI Tools Tables

**brand_guidelines**
- User's brand identity and style preferences
- Colors, fonts, tone of voice
- Do's and don'ts for brand compliance

**tool_configurations**
- User preferences for individual AI tools
- Per-character settings
- Usage tracking

**campaigns**
- Multi-video campaign planning
- Target audience and platform tracking
- Campaign progress monitoring

**storyboard_sequences**
- Frame-by-frame video planning
- Scene descriptions and timing
- Links to campaigns

**style_presets**
- Saved visual styles for reuse
- Character-specific styling
- Favorites and usage tracking

**performance_metrics**
- Video performance predictions
- Quality and style scoring
- Improvement suggestions

**tool_preset_chains**
- Saved sequences of tool workflows
- Common multi-step processes

**platform_configurations**
- Platform-specific preferences (Instagram, TikTok, etc.)
- Aspect ratios and style templates

## Step 4: Security Features

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:
- Users can only read their own data
- Users can only modify their own data
- No cross-user data access
- Pricing tiers are publicly readable

### Authentication Checks

The application checks authentication at multiple levels:
- Frontend route protection
- Backend RLS policies
- API key validation for video generation

## Step 5: Credits System

### How Credits Work

1. New users start with 100 free credits
2. Each video generation costs 1 credit
3. Credits are deducted immediately when generation starts
4. Purchases add credits to the account
5. All transactions are logged for audit

### Purchasing Credits

The app includes a pricing modal with 4 tiers:
- Starter: 100 credits for $9.99
- Creator: 500 credits for $39.99
- Pro: 1500 credits for $99.99
- Enterprise: 5000 credits for $299.99

Note: Payment processing is not yet integrated. Purchases currently only update the database.

## Step 6: Data Flow

### User Signup
1. User submits signup form
2. Supabase creates auth.users entry
3. Trigger automatically creates user_profiles entry
4. User profile includes 100 starting credits
5. User is signed in automatically

### Video Generation
1. User submits prompt
2. App checks credits (must have >= 1)
3. Credit is deducted immediately
4. Generation record created with status "generating"
5. Video generation API called
6. On success: generation updated with video URL
7. On error: generation updated with error message
8. Credit transaction logged

### Loading User Data
1. App checks for existing session on load
2. If session exists, loads user profile
3. Fetches generation history
4. Displays credit balance
5. Enables authenticated features

## Troubleshooting

### "Tables don't exist" errors
- Run the migration script in Supabase SQL Editor
- Verify tables were created using the verification query

### "Permission denied" errors
- Check that RLS policies are enabled
- Verify user is signed in
- Check browser console for auth errors

### Profile not created on signup
- Verify the trigger `on_auth_user_created` exists
- Check Supabase logs for trigger errors
- Manually check if profile exists in user_profiles table

### Credit deduction not working
- Check credit_transactions table for transaction log
- Verify RLS policies allow inserts
- Check browser console for errors

## Development Workflow

### Starting Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Testing Authentication
1. Sign up with a test account
2. Sign out and sign back in
3. Verify credits are preserved
4. Test video generation
5. Check library shows history

## Production Deployment

Before deploying:

1. Verify database migration is complete
2. Test all authentication flows
3. Verify credit system works correctly
4. Test video generation and history
5. Ensure RLS policies are secure
6. Review and test all user flows

## Additional Resources

- Supabase Documentation: https://supabase.com/docs
- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase Database: https://supabase.com/docs/guides/database
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security

## Support

For issues related to:
- Authentication: Check AuthContext.tsx
- Database: Check migration file and RLS policies
- Credits: Check creditService.ts
- Video Generation: Check generationService.ts
