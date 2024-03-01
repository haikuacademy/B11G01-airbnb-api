import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection
import jwt from 'jsonwebtoken'
import { jwtSecret } from '../secrets.js'

// params for GET bookings/1
router.get('/bookings/:bookingId', async (req, res) => {
  //check if the user is logged in
  const token = req.cookies.jwt
  let decoded
  try {
    decoded = jwt.verify(token, jwtSecret)
  } catch (e) {
    res.json({ error: 'Invalid authentication token' })
    return
  }

  try {
    let bookingId = Number(req.params.bookingId)
    if (!bookingId) {
      throw new Error('Please insert a number')
    }
    const { rows } = await db.query(
      `SELECT * FROM bookings WHERE user_id = ${decoded.user_id} AND booking_id = ${req.params.bookingId}`
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
  //check if the user is logged in
  const token = req.cookies.jwt
  let decoded
  try {
    decoded = jwt.verify(token, jwtSecret)
  } catch (e) {
    res.json({ error: 'Invalid authentication token' })
    return
  }

  try {
    //only returns the bookings made by the requesting user
    let queryBookings = `
    SELECT * FROM bookings WHERE user_id = ${decoded.user_id} ORDER BY booking_start_date DESC
    `
    const { rows } = await db.query(queryBookings)
    if (rows.length === 0) {
      throw new Error('not authorized')
    }
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

// POST bookings
//still need to recheck
router.post('/bookings', async (req, res) => {
  const token = req.cookies.jwt
  const {
    house_id,
    booking_start_date,
    booking_end_date,
    price,
    message_to_host
  } = req.body
  let decoded
  try {
    decodedToken = jwt.verify(token, jwtSecret)
  } catch (e) {
    res.json({ error: 'Invalid authentication token' })
    return
  }
  try {
    // check if the user_id has the booking_id
    const queryString = `
    SELECT * FROM bookings WHERE user_id =
    ${decoded.user_id} AND booking_id = ${booking_id}
    `
    const result = await db.query(queryString)
    if (result.rowCount === 0) {
      throw new Error('Not authorized')
    }
    const queryString2 = `
      INSERT INTO bookings (user_id, house_id, booking_start_date, booking_end_date, price, message_to_host)
      VALUES (${decoded.user_id}, ${house_id}, '${booking_start_date}', '${booking_end_date}', ${price}, '${message_to_host}')
      RETURNING *
    `
    const { rows } = await db.query(queryString2)
    res.json(rows)
  } catch (err) {
    res.json({ error: err.message })
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
