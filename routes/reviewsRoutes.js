import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection

router.get('/reviews', async (req, res) => {
  // don't forget async
  try {
    const { rows } = await db.query('SELECT * FROM reviews') // query the database
    console.log(rows)
    res.json(rows) // respond with the data
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

// Define a GET route  with params.

router.get('/reviews/:reviewId', async (req, res) => {
  // don't forget async
  try {
    const { rows } = await db.query(
      `SELECT * FROM reviews WHERE review_id = ${req.params.reviewId}`
    ) // query the database
    if (rows.length === 0) {
      return res.json({ error: 'Review not found' })
    }
    console.log(rows)
    res.json(rows) // respond with the data
  } catch (err) {
    console.error(err.message)
    res.json({ error: 'Please insert a number' })
  }
})
export default router

// // Define a GET route for fetching a single user
// router.get(‘/users/:userId’, async (req, res) => {
//   try {
//     const { rows } = await db.query(
//       `SELECT * FROM users WHERE user_id = ${req.params.userId}`
//     )
//     if (rows.length === 0) {
//       return res.json({ error: ‘User not found’ })
//     }
//     res.json(rows)
//   } catch (err) {
//     console.error(err.message)
//     res.json({ error: ‘Internal server error’ })
//   }
// })
// export default router
