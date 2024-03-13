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
    res.json({error: err.message})
  }
})

//Update the /bookings route with queries
router.get('/bookings', async (req, res) => {
  //check if the user is logged in
  const token = req.cookies.jwt
  
  try {
    const decoded = jwt.verify(token, jwtSecret)
    //only returns the bookings made by the requesting user
    let queryBookings = `
    SELECT * FROM bookings WHERE user_id = ${decoded.user_id} ORDER BY booking_start_date DESC
    `
    const { rows } = await db.query(queryBookings)

    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json({error: err.message})
  }
})

// POST bookings
//got error invalid token
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
    decoded = jwt.decode(token, jwtSecret)
  } catch (e) {
    // console.log(e)
    res.json({ error: 'Invalid authentication token' })
    return
  }
  try {
    const queryString = `
      INSERT INTO bookings (user_id, house_id, booking_start_date, booking_end_date, price, message_to_host)
      VALUES (${decoded.user_id}, ${house_id}, '${booking_start_date}', '${booking_end_date}', ${price}, '${message_to_host}')
      RETURNING *
    `
    const { rows } = await db.query(queryString)
    res.json(rows)
  } catch (err) {
    res.json({ error: err.message })
  }
})

// DELETE bookings
router.delete('/bookings/:bookingId', async (req, res) => {
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
    // first do a SELECT to see if the booking exists
    let queryBookings = `
    SELECT * FROM bookings WHERE user_id = ${decoded.user_id} ORDER BY booking_start_date DESC
    `
    const { rows } = await db.query(queryBookings)
    if (rows.length === 0) {
      throw new Error('booking does not exist')
    }

    // then I can delete
    const { rowCount } = await db.query(`
    DELETE FROM bookings WHERE booking_id = ${req.params.bookingId} AND user_id = ${decoded.user_id} RETURNING *`)
    if (rowCount === 0) {
      throw new Error('User is not authorized to delete this booking')
    }
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.json({ error: 'booking does not exist' })
  }
})

export default router

// Similarly, update the /bookings route so that, by default and without any URL query, it responds with the list of bookings
// sorted by latest "start date"("from", or "from_date" depending on the database column name) in descending order.

// Update the /bookings route so that, if a user property is added to the request query, it should only return bookings that belong to (made by) that user, such as:

// /bookings?user=1
