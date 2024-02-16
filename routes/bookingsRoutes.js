import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection

router.get('/bookings', async (req, res) => {
  // don't forget async
  try {
    const { rows } = await db.query('SELECT * FROM bookings') // query the database
    console.log(rows)
    res.json(rows) // respond with the data
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

router.get('/bookings/11', async (req, res) => {
  // don't forget async
  try {
    const { rows } = await db.query(
      'SELECT * FROM bookings WHERE booking_id = 11'
    ) // query the database
    console.log(rows)
    res.json(rows) // respond with the data
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

export default router
