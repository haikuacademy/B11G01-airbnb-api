import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection

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
      throw new Error(`No Booking found with ID ${req.params.bookingId}`)
    }
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err.message)
  }
})

//Update the /bookings route with queries

router.get('/bookings', async (req, res) => {
  try {
    let queryBookings =
      'SELECT * FROM bookings ORDER BY booking_start_date DESC'
    if (req.query.user) {
      queryBookings = `SELECT * FROM bookings WHERE user_id = ${req.query.user} ORDER BY booking_start_date DESC`
    }
    const { rows } = await db.query(queryBookings)
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

// POST bookings

router.post('/bookings', async (req, res) => {
  try {
    const {
      user_id,
      booking_id,
      house_id,
      booking_start_date,
      booking_end_date,
      price,
      message_to_host
    } = req.body
    console.log(req.body, user_id, booking_id)
    const queryString = `
      INSERT INTO bookings (user_id, booking_id, house_id, booking_start_date, booking_end_date, price, message_to_host)
      VALUES (${user_id}, ${booking_id}, ${house_id}, '${booking_start_date}', '${booking_end_date}', ${price}, '${message_to_host}')
      RETURNING *
    `
    console.log(queryString)
    const { rows } = await db.query(queryString)
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

// DELETE bookings
router.delete('/bookings/:bookingId', async (req, res) => {
  try {
    const { rowCount } = await db.query(`
    DELETE FROM bookings WHERE booking_id = ${req.params.bookingId}`)
    if (!rowCount) {
      throw new Error('Delete Failed')
    }
    res.json(rowCount)
  } catch (err) {
    console.error(err)
    res.json({ error: 'Please insert a valid data' })
  }
})
export default router

// Similarly, update the /bookings route so that, by default and without any URL query, it responds with the list of bookings
// sorted by latest "start date"("from", or "from_date" depending on the database column name) in descending order.

// Update the /bookings route so that, if a user property is added to the request query, it should only return bookings that belong to (made by) that user, such as:

// /bookings?user=1
