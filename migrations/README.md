# Database Migrations

This folder contains SQL migration files for setting up the Smart Cameos database.

## Setup Instructions

### Step 1: Access Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** section

### Step 2: Run the Initial Schema Migration

1. Open the file `001_initial_schema.sql` in a text editor
2. Copy the entire contents of the file
3. Paste it into the Supabase SQL Editor
4. Click **Run** to execute the migration

### Step 3: Verify Installation

After running the migration, verify that all tables were created successfully:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see the following tables:
- brand_guidelines
- campaigns
- credit_transactions
- generations
- performance_metrics
- platform_configurations
- pricing_tiers
- storyboard_sequences
- style_presets
- tool_configurations
- tool_preset_chains
- user_profiles

## What This Migration Does

### Core Tables
- **user_profiles**: User accounts with credit balances
- **generations**: Video generation history
- **credit_transactions**: Complete audit log of credits
- **pricing_tiers**: Available credit packages
- **brand_guidelines**: Brand identity storage

### AI Tools Tables
- **tool_configurations**: User preferences for AI tools
- **campaigns**: Multi-video campaign planning
- **storyboard_sequences**: Frame-by-frame planning
- **style_presets**: Saved visual styles
- **performance_metrics**: Performance tracking
- **tool_preset_chains**: Saved tool workflows
- **platform_configurations**: Platform-specific settings

### Security Features
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Automatic profile creation on signup
- Secure credit transactions

### Automatic Features
- New users get 100 free credits
- Updated_at timestamps auto-update
- Default pricing tiers are created

## Troubleshooting

If you encounter errors:

1. **Permission Errors**: Make sure you're using the Supabase dashboard as an admin
2. **Already Exists Errors**: The migration is idempotent and safe to run multiple times
3. **Foreign Key Errors**: Ensure auth.users table exists (it should by default in Supabase)

## Next Steps

After running the migration:

1. Test user signup to verify profile creation
2. Check that users receive 100 starting credits
3. Verify that the pricing tiers are visible in the app
