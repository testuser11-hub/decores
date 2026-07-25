import { supabase } from '../config/supabase.js';

export async function getProducts() {
  const { data, error } = await supabase.from('products').select('*').eq('is_active', true).eq('is_deleted', false).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getProductBySlug(slug) {
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
  if (error) throw error;
  return data;
}

export async function createContactMessage(payload) {
  const { data, error } = await supabase.from('contact_messages').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function createBooking(payload) {
  const { data, error } = await supabase.from('orders').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function getSettings() {
  const { data, error } = await supabase.from('settings').select('key, value');
  if (error) throw error;
  return data;
}
