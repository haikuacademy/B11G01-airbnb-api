import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection

// Define a GET route for fetching a single review
router.get('/reviews/:reviewId', async (req, res) => {
  try {
    let reviewId = Number(req.params.reviewId)
    if (!reviewId) {
      throw new Error('Please insert a number')
    }
    const { rows } = await db.query(
      `SELECT * FROM reviews WHERE review_id = ${req.params.reviewId}`
    )
    if (rows.length === 0) {
      throw new Error(`No review found with id ${req.params.reviewId}`)
    }
    console.log(rows)
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err.message)
  }
})
export default router

// Define a GET route for fetching the list of reviews
router.get('/reviews', async (req, res) => {
  try {
    // query to sort reviews to show newest first
    let queryReview = 'SELECT * FROM reviews ORDER BY review_date DESC'

    //  query to return reviews that belong a specific house
    if (req.query.house) {
      queryReview = `SELECT * FROM reviews WHERE house_id = '${req.query.house}'
      ORDER BY review_date DESC`
    }

    const { rows } = await db.query(queryReview)
    console.log(rows)
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})
