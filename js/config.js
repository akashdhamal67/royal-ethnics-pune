// Supabase Project Credentials & Configuration
const SUPABASE_URL = "https://tyadztgaicxkochntcad.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_admjmfwMvAjTzUBj3k4mGA_1eM5Py2c";
const SUPABASE_PUBLISHABLE_KEY = SUPABASE_ANON_KEY;
const SUPABASE_STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public`;
const PRODUCT_IMAGES_BUCKET = "product-images";

// Initialize a shared, globally accessible Supabase Client
// Note: Never declare 'const supabase' or 'let supabase' because the Supabase CDN library
// already declares a global object window.supabase!
let supabaseClient = null;
if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.error('Failed to initialize shared supabaseClient:', err);
  }
}
