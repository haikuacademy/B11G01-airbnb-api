import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection

router.get('/users', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM users') // query the database
    console.log(rows)
    res.json(rows) // respond with the data
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

export default router
