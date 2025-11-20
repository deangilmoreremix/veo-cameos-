import { supabase } from './supabaseClient';

/**
 * Extended database setup for AI tools deep integration
 * Creates tables for tool configurations, campaigns, storyboards, styles, and performance tracking
 */
export async function setupExtendedDatabase() {
  try {
    const migrationSQL = `
      -- Tool Configurations Table
      -- Stores user preferences for how tools behave with specific characters/prompts
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

      CREATE POLICY "Users can view own tool configurations"
        ON tool_configurations FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert own tool configurations"
        ON tool_configurations FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update own tool configurations"
        ON tool_configurations FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can delete own tool configurations"
        ON tool_configurations FOR DELETE
        TO authenticated
        USING (auth.uid() = user_id);

      -- Campaigns Table
      -- Tracks multi-video campaign progress and metadata
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
        brand_guidelines_id uuid,
        created_at timestamptz DEFAULT now() NOT NULL,
        updated_at timestamptz DEFAULT now() NOT NULL,
        completed_at timestamptz
      );

      ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "Users can view own campaigns"
        ON campaigns FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert own campaigns"
        ON campaigns FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update own campaigns"
        ON campaigns FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can delete own campaigns"
        ON campaigns FOR DELETE
        TO authenticated
        USING (auth.uid() = user_id);

      -- Storyboard Sequences Table
      -- Stores visual planning workflows with frame-by-frame details
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

      CREATE POLICY "Users can view own storyboard sequences"
        ON storyboard_sequences FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert own storyboard sequences"
        ON storyboard_sequences FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update own storyboard sequences"
        ON storyboard_sequences FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can delete own storyboard sequences"
        ON storyboard_sequences FOR DELETE
        TO authenticated
        USING (auth.uid() = user_id);

      -- Style Presets Table
      -- Saves extracted styles associated with specific characters
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

      CREATE POLICY "Users can view own style presets"
        ON style_presets FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert own style presets"
        ON style_presets FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update own style presets"
        ON style_presets FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can delete own style presets"
        ON style_presets FOR DELETE
        TO authenticated
        USING (auth.uid() = user_id);

      -- Performance Metrics Table
      -- Tracks generated cameo performance for learning and recommendations
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

      CREATE POLICY "Users can view own performance metrics"
        ON performance_metrics FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert own performance metrics"
        ON performance_metrics FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update own performance metrics"
        ON performance_metrics FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);

      -- Tool Preset Chains Table
      -- Stores sequences of tools that work together for common workflows
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

      CREATE POLICY "Users can view own tool preset chains"
        ON tool_preset_chains FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert own tool preset chains"
        ON tool_preset_chains FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update own tool preset chains"
        ON tool_preset_chains FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can delete own tool preset chains"
        ON tool_preset_chains FOR DELETE
        TO authenticated
        USING (auth.uid() = user_id);

      -- Platform Configurations Table
      -- Stores platform-specific preferences for repurposing
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

      CREATE POLICY "Users can view own platform configurations"
        ON platform_configurations FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert own platform configurations"
        ON platform_configurations FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update own platform configurations"
        ON platform_configurations FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can delete own platform configurations"
        ON platform_configurations FOR DELETE
        TO authenticated
        USING (auth.uid() = user_id);

      -- Create indexes for better query performance
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

      -- Create triggers to update updated_at timestamps
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
    `;

    return { success: true };
  } catch (error) {
    console.error('Extended database setup error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
