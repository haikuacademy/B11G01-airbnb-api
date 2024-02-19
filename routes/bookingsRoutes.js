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

// params for GET bookings/1
router.get('/bookings/:bookingId', async (req, res) => {
  try {
    let bookingId = Number(req.params.bookingId)
    if (!bookingId) {
      throw new Error('Please insert a number')
    }
    const { rows } = await db.query(
      `SELECT * FROM bookings WHERE booking_id = ${req.params.bookingId}`
    )
    if (rows.length === 0) {
      throw new Error('Booking not found')
    }
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err.message)
  }
})

// router.get('/bookings/11', async (req, res) => {
//   // don't forget async
//   try {
//     const { rows } = await db.query(
//       'SELECT * FROM bookings WHERE booking_id = 11'
//     ) // query the database
//     console.log(rows)
//     res.json(rows) // respond with the data
//   } catch (err) {
//     console.error(err.message)
//     res.json(err)
//   }
// })

export default router
