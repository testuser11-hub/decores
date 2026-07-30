import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

function createStubClient() {
  const createQueryBuilder = () => ({
    select: () => createQueryBuilder(),
    insert: () => createQueryBuilder(),
    update: () => createQueryBuilder(),
    delete: () => createQueryBuilder(),
    eq: () => createQueryBuilder(),
    order: async () => ({ data: [], error: null }),
    single: async () => ({ data: null, error: null }),
  });

  return {
    auth: {
      signUp: async () => ({ data: null, error: new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.') }),
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.') }),
      signInWithOAuth: async () => ({ data: null, error: new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.') }),
      resetPasswordForEmail: async () => ({ data: null, error: new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.') }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
    },
    from: () => createQueryBuilder(),
  };
}

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))
);

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createStubClient();

export const supabaseAdmin = isConfigured && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : createStubClient();

export const isSupabaseConfigured = isConfigured;
