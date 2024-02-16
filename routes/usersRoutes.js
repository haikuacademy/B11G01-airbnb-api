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

// Define a GET route for fetching a single user
router.get('/users/1', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE users.user_id = 1') // query the database
    console.log(rows)
    res.json(rows) // respond with the data
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

export default router
