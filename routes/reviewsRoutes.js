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
    let reviewId = Number(req.params.reviewId)
    if (!reviewId) {
      throw new Error('Please insert a number')
    }
    const { rows } = await db.query(
      `SELECT * FROM reviews WHERE review_id = ${req.params.reviewId}`
    ) // query the database
    if (rows.length === 0) {
      throw new Error('Review not found')
    }
    console.log(rows)
    res.json(rows) // respond with the data
  } catch (err) {
    console.error(err.message)
    res.json(err.message)
  }
})
export default router
