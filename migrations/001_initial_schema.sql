/*
  # Initial Database Schema for Smart Cameos

  ## Overview
  This migration creates the complete database schema for the Smart Cameos application,
  including user profiles, video generations, credits system, and AI tool integrations.

  ## Tables Created

  ### 1. user_profiles
  - Stores user account information and credit balances
  - Links to auth.users table
  - Tracks credits and spending

  ### 2. generations
  - Video generation history and metadata
  - Links to user profiles
  - Tracks generation status and outcomes

  ### 3. credit_transactions
  - Complete audit log of credit changes
  - Supports purchases, generations, refunds, and bonuses

  ### 4. pricing_tiers
  - Available credit packages for purchase
  - Publicly readable for authenticated users

  ### 5. brand_guidelines
  - User-specific brand identity storage
  - Visual style, tone, and brand rules

  ### 6. tool_configurations
  - Per-user AI tool preferences and settings

  ### 7. campaigns
  - Multi-video campaign planning and tracking

  ### 8. storyboard_sequences
  - Frame-by-frame visual planning

  ### 9. style_presets
  - Saved visual styles for reuse

  ### 10. performance_metrics
  - Video performance tracking and predictions

  ### 11. tool_preset_chains
  - Saved sequences of tool workflows

  ### 12. platform_configurations
  - Platform-specific preferences (Instagram, TikTok, etc.)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies ensure users can only access their own data
  - Public data (pricing tiers) accessible to authenticated users

  ## Triggers
  - Automatic profile creation on user signup
  - Updated_at timestamp management

  ## Indexes
  - Performance-optimized for common query patterns
*/

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_url text DEFAULT '',
  credits integer DEFAULT 100 NOT NULL CHECK (credits >= 0),
  total_spent numeric DEFAULT 0 NOT NULL CHECK (total_spent >= 0),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Generations Table
CREATE TABLE IF NOT EXISTS generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  prompt text NOT NULL,
  model text DEFAULT 'veo-2' NOT NULL,
  aspect_ratio text DEFAULT '16:9' NOT NULL,
  resolution text DEFAULT '720p' NOT NULL,
  mode text DEFAULT 'standard' NOT NULL,
  status text DEFAULT 'generating' NOT NULL,
  video_url text,
  error_message text,
  reference_image_url text,
  credits_used integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz
);

ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own generations" ON generations;
CREATE POLICY "Users can view own generations"
  ON generations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own generations" ON generations;
CREATE POLICY "Users can insert own generations"
  ON generations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own generations" ON generations;
CREATE POLICY "Users can update own generations"
  ON generations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own generations" ON generations;
CREATE POLICY "Users can delete own generations"
  ON generations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Credit Transactions Table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  transaction_type text NOT NULL,
  description text NOT NULL,
  generation_id uuid REFERENCES generations(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own transactions" ON credit_transactions;
CREATE POLICY "Users can view own transactions"
  ON credit_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own transactions" ON credit_transactions;
CREATE POLICY "Users can insert own transactions"
  ON credit_transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Pricing Tiers Table
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  credits integer NOT NULL,
  price numeric NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  sort_order integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active pricing tiers" ON pricing_tiers;
CREATE POLICY "Anyone can view active pricing tiers"
  ON pricing_tiers FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Brand Guidelines Table
CREATE TABLE IF NOT EXISTS brand_guidelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  brand_name text NOT NULL,
  values text[] DEFAULT ARRAY[]::text[],
  tone_of_voice text[] DEFAULT ARRAY[]::text[],
  visual_style text DEFAULT '',
  do_list text[] DEFAULT ARRAY[]::text[],
  dont_list text[] DEFAULT ARRAY[]::text[],
  color_palette text[] DEFAULT ARRAY[]::text[],
  fonts text DEFAULT '',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE brand_guidelines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own brand guidelines" ON brand_guidelines;
CREATE POLICY "Users can view own brand guidelines"
  ON brand_guidelines FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own brand guidelines" ON brand_guidelines;
CREATE POLICY "Users can insert own brand guidelines"
  ON brand_guidelines FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own brand guidelines" ON brand_guidelines;
CREATE POLICY "Users can update own brand guidelines"
  ON brand_guidelines FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own brand guidelines" ON brand_guidelines;
CREATE POLICY "Users can delete own brand guidelines"
  ON brand_guidelines FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- AI TOOLS & WORKFLOW TABLES
-- ============================================================================

-- Tool Configurations Table
CREATE TABLE IF NOT EXISTS tool_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  tool_name text NOT NULL,
  character_id text,
  configuration jsonb DEFAULT '{}'::jsonb NOT NULL,
  is_favorite boolean DEFAULT false,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE tool_configurations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tool configurations" ON tool_configurations;
CREATE POLICY "Users can view own tool configurations"
  ON tool_configurations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own tool configurations" ON tool_configurations;
CREATE POLICY "Users can insert own tool configurations"
  ON tool_configurations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own tool configurations" ON tool_configurations;
CREATE POLICY "Users can update own tool configurations"
  ON tool_configurations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own tool configurations" ON tool_configurations;
CREATE POLICY "Users can delete own tool configurations"
  ON tool_configurations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  target_audience text DEFAULT '',
  platform text[] DEFAULT ARRAY[]::text[],
  status text DEFAULT 'draft' NOT NULL,
  total_videos integer DEFAULT 0,
  completed_videos integer DEFAULT 0,
  concepts jsonb DEFAULT '[]'::jsonb NOT NULL,
  brand_guidelines_id uuid REFERENCES brand_guidelines(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own campaigns" ON campaigns;
CREATE POLICY "Users can view own campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own campaigns" ON campaigns;
CREATE POLICY "Users can insert own campaigns"
  ON campaigns FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own campaigns" ON campaigns;
CREATE POLICY "Users can update own campaigns"
  ON campaigns FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own campaigns" ON campaigns;
CREATE POLICY "Users can delete own campaigns"
  ON campaigns FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Storyboard Sequences Table
CREATE TABLE IF NOT EXISTS storyboard_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  name text NOT NULL,
  frames jsonb DEFAULT '[]'::jsonb NOT NULL,
  total_duration integer DEFAULT 0,
  character_id text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE storyboard_sequences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own storyboard sequences" ON storyboard_sequences;
CREATE POLICY "Users can view own storyboard sequences"
  ON storyboard_sequences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own storyboard sequences" ON storyboard_sequences;
CREATE POLICY "Users can insert own storyboard sequences"
  ON storyboard_sequences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own storyboard sequences" ON storyboard_sequences;
CREATE POLICY "Users can update own storyboard sequences"
  ON storyboard_sequences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own storyboard sequences" ON storyboard_sequences;
CREATE POLICY "Users can delete own storyboard sequences"
  ON storyboard_sequences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Style Presets Table
CREATE TABLE IF NOT EXISTS style_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  character_id text,
  style_data jsonb DEFAULT '{}'::jsonb NOT NULL,
  thumbnail_url text,
  is_favorite boolean DEFAULT false,
  usage_count integer DEFAULT 0,
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE style_presets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own style presets" ON style_presets;
CREATE POLICY "Users can view own style presets"
  ON style_presets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own style presets" ON style_presets;
CREATE POLICY "Users can insert own style presets"
  ON style_presets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own style presets" ON style_presets;
CREATE POLICY "Users can update own style presets"
  ON style_presets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own style presets" ON style_presets;
CREATE POLICY "Users can delete own style presets"
  ON style_presets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Performance Metrics Table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  generation_id uuid REFERENCES generations(id) ON DELETE CASCADE,
  prompt text NOT NULL,
  character_id text,
  platform text DEFAULT 'general',
  predicted_score numeric DEFAULT 0,
  actual_engagement jsonb DEFAULT '{}'::jsonb,
  quality_score numeric DEFAULT 0,
  style_consistency numeric DEFAULT 0,
  brand_compliance numeric DEFAULT 0,
  improvements jsonb DEFAULT '[]'::jsonb NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own performance metrics" ON performance_metrics;
CREATE POLICY "Users can view own performance metrics"
  ON performance_metrics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own performance metrics" ON performance_metrics;
CREATE POLICY "Users can insert own performance metrics"
  ON performance_metrics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own performance metrics" ON performance_metrics;
CREATE POLICY "Users can update own performance metrics"
  ON performance_metrics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Tool Preset Chains Table
CREATE TABLE IF NOT EXISTS tool_preset_chains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  tools jsonb DEFAULT '[]'::jsonb NOT NULL,
  is_favorite boolean DEFAULT false,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE tool_preset_chains ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tool preset chains" ON tool_preset_chains;
CREATE POLICY "Users can view own tool preset chains"
  ON tool_preset_chains FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own tool preset chains" ON tool_preset_chains;
CREATE POLICY "Users can insert own tool preset chains"
  ON tool_preset_chains FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own tool preset chains" ON tool_preset_chains;
CREATE POLICY "Users can update own tool preset chains"
  ON tool_preset_chains FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own tool preset chains" ON tool_preset_chains;
CREATE POLICY "Users can delete own tool preset chains"
  ON tool_preset_chains FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Platform Configurations Table
CREATE TABLE IF NOT EXISTS platform_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  platform text NOT NULL,
  aspect_ratio text NOT NULL,
  preferred_style jsonb DEFAULT '{}'::jsonb,
  prompt_templates jsonb DEFAULT '[]'::jsonb NOT NULL,
  character_preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, platform)
);

ALTER TABLE platform_configurations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own platform configurations" ON platform_configurations;
CREATE POLICY "Users can view own platform configurations"
  ON platform_configurations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own platform configurations" ON platform_configurations;
CREATE POLICY "Users can insert own platform configurations"
  ON platform_configurations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own platform configurations" ON platform_configurations;
CREATE POLICY "Users can update own platform configurations"
  ON platform_configurations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own platform configurations" ON platform_configurations;
CREATE POLICY "Users can delete own platform configurations"
  ON platform_configurations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, credits)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    100
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at columns
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_brand_guidelines_updated_at ON brand_guidelines;
CREATE TRIGGER update_brand_guidelines_updated_at
  BEFORE UPDATE ON brand_guidelines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tool_configurations_updated_at ON tool_configurations;
CREATE TRIGGER update_tool_configurations_updated_at
  BEFORE UPDATE ON tool_configurations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_storyboard_sequences_updated_at ON storyboard_sequences;
CREATE TRIGGER update_storyboard_sequences_updated_at
  BEFORE UPDATE ON storyboard_sequences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_style_presets_updated_at ON style_presets;
CREATE TRIGGER update_style_presets_updated_at
  BEFORE UPDATE ON style_presets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tool_preset_chains_updated_at ON tool_preset_chains;
CREATE TRIGGER update_tool_preset_chains_updated_at
  BEFORE UPDATE ON tool_preset_chains
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_platform_configurations_updated_at ON platform_configurations;
CREATE TRIGGER update_platform_configurations_updated_at
  BEFORE UPDATE ON platform_configurations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_status ON generations(status);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_brand_guidelines_user_id ON brand_guidelines(user_id);

CREATE INDEX IF NOT EXISTS idx_tool_configurations_user_id ON tool_configurations(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_configurations_tool_name ON tool_configurations(tool_name);

CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

CREATE INDEX IF NOT EXISTS idx_storyboard_sequences_user_id ON storyboard_sequences(user_id);
CREATE INDEX IF NOT EXISTS idx_storyboard_sequences_campaign_id ON storyboard_sequences(campaign_id);

CREATE INDEX IF NOT EXISTS idx_style_presets_user_id ON style_presets(user_id);
CREATE INDEX IF NOT EXISTS idx_style_presets_character_id ON style_presets(character_id);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_generation_id ON performance_metrics(generation_id);

CREATE INDEX IF NOT EXISTS idx_tool_preset_chains_user_id ON tool_preset_chains(user_id);

CREATE INDEX IF NOT EXISTS idx_platform_configurations_user_id ON platform_configurations(user_id);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default pricing tiers
INSERT INTO pricing_tiers (name, credits, price, sort_order)
VALUES
  ('Starter', 100, 9.99, 1),
  ('Creator', 500, 39.99, 2),
  ('Pro', 1500, 99.99, 3),
  ('Enterprise', 5000, 299.99, 4)
ON CONFLICT DO NOTHING;
