import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres:mugeshdecores@db.lttakodirkeyxdccpaqe.supabase.co:5432/postgres';

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  console.log('--- PRODUCTS IN DATABASE ---');
  const res = await client.query('SELECT id, name, slug, price, tag, event_category FROM products;');
  console.log(JSON.stringify(res.rows, null, 2));

  await client.end();
}

main().catch(console.error);
