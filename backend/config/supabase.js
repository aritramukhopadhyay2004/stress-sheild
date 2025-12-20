const { createClient } = require("@supabase/supabase-js");

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error(
    "❌ Supabase environment variables are missing. Please set SUPABASE_URL and SUPABASE_KEY in your .env or env."
  );
  throw new Error("SUPABASE_URL and SUPABASE_KEY must be set");
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;
