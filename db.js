// db.js
import pg from 'pg'
const { Pool } = pg

// Database connection parameters
import { DBURL } from './secrets.js'
const db = new Pool({
  ssl: {
    rejectUnauthorized: false
  },
  connectionString: DBURL
})

export default db
