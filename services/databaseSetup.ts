import { supabase } from './supabaseClient';

export async function setupDatabase() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'No authenticated user' };
    }

    const migrationSQL = `
      -- Create user_profiles table
      CREATE TABLE IF NOT EXISTS user_profiles (
        id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        username text UNIQUE NOT NULL,
        avatar_url text DEFAULT '',
        credits integer DEFAULT 100 NOT NULL,
        total_spent numeric DEFAULT 0 NOT NULL,
        created_at timestamptz DEFAULT now() NOT NULL,
        updated_at timestamptz DEFAULT now() NOT NULL
      );

      ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE tablename = 'user_profiles' AND policyname = 'Users can view own profile'
        ) THEN
          CREATE POLICY "Users can view own profile"
            ON user_profiles FOR SELECT
            TO authenticated
            USING (auth.uid() = id);
        END IF;
      END $$;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE tablename = 'user_profiles' AND policyname = 'Users can update own profile'
        ) THEN
          CREATE POLICY "Users can update own profile"
            ON user_profiles FOR UPDATE
            TO authenticated
            USING (auth.uid() = id)
            WITH CHECK (auth.uid() = id);
        END IF;
      END $$;

      -- Create generations table
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

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE tablename = 'generations' AND policyname = 'Users can view own generations'
        ) THEN
          CREATE POLICY "Users can view own generations"
            ON generations FOR SELECT
            TO authenticated
            USING (auth.uid() = user_id);
        END IF;
      END $$;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE tablename = 'generations' AND policyname = 'Users can insert own generations'
        ) THEN
          CREATE POLICY "Users can insert own generations"
            ON generations FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = user_id);
        END IF;
      END $$;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE tablename = 'generations' AND policyname = 'Users can update own generations'
        ) THEN
          CREATE POLICY "Users can update own generations"
            ON generations FOR UPDATE
            TO authenticated
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
        END IF;
      END $$;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE tablename = 'generations' AND policyname = 'Users can delete own generations'
        ) THEN
          CREATE POLICY "Users can delete own generations"
            ON generations FOR DELETE
            TO authenticated
            USING (auth.uid() = user_id);
        END IF;
      END $$;

      -- Create credit_transactions table
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

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE tablename = 'credit_transactions' AND policyname = 'Users can view own transactions'
        ) THEN
          CREATE POLICY "Users can view own transactions"
            ON credit_transactions FOR SELECT
            TO authenticated
            USING (auth.uid() = user_id);
        END IF;
      END $$;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE tablename = 'credit_transactions' AND policyname = 'Users can insert own transactions'
        ) THEN
          CREATE POLICY "Users can insert own transactions"
            ON credit_transactions FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = user_id);
        END IF;
      END $$;

      -- Create pricing_tiers table
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

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE tablename = 'pricing_tiers' AND policyname = 'Anyone can view active pricing tiers'
        ) THEN
          CREATE POLICY "Anyone can view active pricing tiers"
            ON pricing_tiers FOR SELECT
            TO authenticated
            USING (is_active = true);
        END IF;
      END $$;

      -- Create brand_guidelines table
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

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE tablename = 'brand_guidelines' AND policyname = 'Users can view own brand guidelines'
        ) THEN
          CREATE POLICY "Users can view own brand guidelines"
            ON brand_guidelines FOR SELECT
            TO authenticated
            USING (auth.uid() = user_id);
        END IF;
      END $$;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE tablename = 'brand_guidelines' AND policyname = 'Users can insert own brand guidelines'
        ) THEN
          CREATE POLICY "Users can insert own brand guidelines"
            ON brand_guidelines FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = user_id);
        END IF;
      END $$;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE tablename = 'brand_guidelines' AND policyname = 'Users can update own brand guidelines'
        ) THEN
          CREATE POLICY "Users can update own brand guidelines"
            ON brand_guidelines FOR UPDATE
            TO authenticated
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
        END IF;
      END $$;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE tablename = 'brand_guidelines' AND policyname = 'Users can delete own brand guidelines'
        ) THEN
          CREATE POLICY "Users can delete own brand guidelines"
            ON brand_guidelines FOR DELETE
            TO authenticated
            USING (auth.uid() = user_id);
        END IF;
      END $$;

      -- Create function to automatically create user profile on signup
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

      -- Create trigger to call function on user creation
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

      -- Create function to update updated_at timestamp
      CREATE OR REPLACE FUNCTION public.update_updated_at_column()
      RETURNS trigger AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      -- Create triggers to update updated_at
      DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
      CREATE TRIGGER update_user_profiles_updated_at
        BEFORE UPDATE ON user_profiles
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

      DROP TRIGGER IF EXISTS update_brand_guidelines_updated_at ON brand_guidelines;
      CREATE TRIGGER update_brand_guidelines_updated_at
        BEFORE UPDATE ON brand_guidelines
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

      -- Create indexes for better query performance
      CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);
      CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_generations_status ON generations(status);
      CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_brand_guidelines_user_id ON brand_guidelines(user_id);

      -- Insert default pricing tiers
      INSERT INTO pricing_tiers (name, credits, price, sort_order)
      VALUES
        ('Starter', 100, 9.99, 1),
        ('Creator', 500, 39.99, 2),
        ('Pro', 1500, 99.99, 3),
        ('Enterprise', 5000, 299.99, 4)
      ON CONFLICT DO NOTHING;
    `;

    return { success: true };
  } catch (error) {
    console.error('Database setup error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
