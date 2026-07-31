import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres:mugeshdecores@db.lttakodirkeyxdccpaqe.supabase.co:5432/postgres';

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  const res = await client.query('SELECT COUNT(*) FROM public.users WHERE id != auth_user_id');
  const count = parseInt(res.rows[0].count, 10);
  console.log('Unaligned users count:', count);

  const users = await client.query('SELECT id, email, auth_user_id FROM public.users');
  console.log('All Users:', users.rows);

  const admins = await client.query('SELECT * FROM public.admins');
  console.log('Admins Table:', admins.rows);

  await client.end();
}

main().catch(console.error);
