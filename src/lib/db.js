
// import { Pool } from 'pg';
// const pool = new Pool({
//   user: 'localdb',
//   host: 'localhost',
//   database: 'ota-iot',
//   password: 'iatvmware',
//   port: 5433, // port default PostgreSQL
// });
// export default pool

"use server";

const { Client } = require('pg')

export function postsReadDbClient() {
  return new Client({
    connectionString : process.env.POSTS_READ_DB_URI,
  })
}


