
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    console.log('URL:', process.env.SUPABASE_URL);
    
    // Try to query users table
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
    } else {
      console.log('✅ Successfully connected to Supabase!');
      console.log('Database is accessible');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

testConnection();
