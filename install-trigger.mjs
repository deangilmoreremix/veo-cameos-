import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function installTrigger() {
  console.log('Installing user profile creation trigger...');

  const triggerSQL = `
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
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { sql: triggerSQL });

    if (error) {
      // Try direct query
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ sql: triggerSQL })
      });

      if (!response.ok) {
        throw new Error(`Failed to install trigger: ${await response.text()}`);
      }
    }

    console.log('✅ Trigger installed successfully');

    // Verify trigger exists
    const { data: checkData, error: checkError } = await supabase
      .from('pg_proc')
      .select('proname')
      .eq('proname', 'handle_new_user')
      .maybeSingle();

    if (checkError) {
      console.log('Note: Could not verify trigger installation');
    } else if (checkData) {
      console.log('✅ Trigger verified');
    }
  } catch (err) {
    console.error('Error installing trigger:', err.message);
    process.exit(1);
  }
}

install Trigger();
