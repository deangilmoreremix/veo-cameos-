import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://fojsukqhfpnwnsptfsae.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvanN1a3FoZnBud25zcHRmc2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxOTA3MjAsImV4cCI6MjA1ODc2NjcyMH0.Vw-xVAbShysDb2B7kH40dKL8y5rNzocHAHmyuKsaBAQ';

console.log('Connecting to Supabase...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('\n📦 Setting up database tables...\n');

  try {
    // Read the migration SQL file
    const sql = readFileSync('./migrations/001_initial_schema.sql', 'utf-8');

    console.log('✅ Migration file loaded');
    console.log('📄 File size:', Math.round(sql.length / 1024), 'KB');

    console.log('\n⚠️  NOTE: This script cannot execute DDL statements directly.');
    console.log('Please run the migration manually:\n');
    console.log('1. Go to: https://supabase.com/dashboard/project/fojsukqhfpnwnsptfsae');
    console.log('2. Click "SQL Editor" in the left sidebar');
    console.log('3. Copy the contents of migrations/001_initial_schema.sql');
    console.log('4. Paste into the SQL Editor');
    console.log('5. Click "Run" or press Ctrl/Cmd + Enter\n');

    console.log('Checking if tables exist...\n');

    // Try to query user_profiles to see if it exists
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);

    if (error) {
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('❌ Tables do not exist yet');
        console.log('📋 Please run the migration SQL file in Supabase dashboard\n');
      } else {
        console.log('❌ Error checking tables:', error.message);
      }
    } else {
      console.log('✅ Tables already exist!');
      console.log('✅ Database is ready to use\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupDatabase();
