import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Simple parser for .env file
function loadEnv() {
  const envPath = path.resolve('.env');
  if (!fs.existsSync(envPath)) {
    console.error('.env file not found!');
    return {};
  }
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      env[key] = val;
    }
  });
  return env;
}

async function checkConnection() {
  const env = loadEnv();
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('Supabase URL or Anon Key is missing in .env!');
    return;
  }

  console.log('Connecting to Supabase...');
  console.log(`URL: ${url}`);
  
  const supabase = createClient(url, key);

  // Attempt to select from products table
  console.log('\nTesting read connection (fetching 1 product)...');
  const { data, error } = await supabase.from('products').select('*').limit(1);

  if (error) {
    console.error('❌ Connection test failed with error:');
    console.error(error);
  } else {
    console.log('✅ Connection test succeeded!');
    console.log('Sample Data fetched:', data);
  }
}

checkConnection();
