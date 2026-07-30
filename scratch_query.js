import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lttakodirkeyxdccpaqe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dGFrb2RpcmtleXhkY2NwYXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyODI1NDYsImV4cCI6MjA5OTg1ODU0Nn0.qrw9uQcRpcEGUIZ-PFezM67lUF954soP3rnJS8cgR6I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSelectAll() {
  console.log('Fetching all orders from database...');
  const { data, error } = await supabase.from('orders').select('*');

  if (error) {
    console.error('Select failed:', error);
  } else {
    console.log('Select succeeded, count:', data.length);
    console.log('All items:', JSON.stringify(data, null, 2));
  }
}

testSelectAll();


