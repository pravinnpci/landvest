const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.iloyapuzfyidxlezixfv:Land%40vest123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const check = await pool.query('SELECT * FROM sellers WHERE LOWER(email) = $1', ['msivabarathi@gmail.com']);
    if (check.rows.length > 0) {
      console.log('Already exists in Supabase:', check.rows[0]);
      return;
    }

    const insertSql = `
      INSERT INTO sellers (id, name, phone, email, "companyName", "incomeTaxPan", country, district, state, status, "createdDate")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const res = await pool.query(insertSql, [
      'seller-siva',
      'Siva Bharathi',
      '+91 98401 55555',
      'msivabarathi@gmail.com',
      'Siva DTCP Lands',
      'ABCDE5678G',
      'India',
      'Chennai',
      'Tamil Nadu',
      'active',
      '2025-01-25'
    ]);
    console.log('Successfully inserted seller in Supabase:', res.rows[0]);
  } catch (err) {
    console.error('Error inserting seller:', err.message);
  } finally {
    await pool.end();
  }
}

main();
