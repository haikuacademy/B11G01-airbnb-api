import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection

// Define a GET route for fetching a single house
router.get('/houses/:houseId', async (req, res) => {
  try {
    let houseId = Number(req.params.houseId)
    if (!houseId) {
      throw new Error('Please insert a number')
    }
    const { rows } = await db.query(
      `SELECT * FROM houses WHERE house_id = ${req.params.houseId}`
    )
    if (rows.length === 0) {
      throw new Error('House not found')
    }
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err.message)
  }
})

//Update the /houses route with queries
router.get('/houses', async (req, res) => {
  try {
    //query for houses with 1 = 1 to start with true condition
    let queryString = 'SELECT * FROM houses WHERE 1 = 1'
    //query for location
    if (req.query.location) {
      queryString += ` AND location = '${req.query.location}'`
    }
    //query for max price
    if (req.query.max_price) {
      queryString += ` AND price_per_night <= '${req.query.max_price}'`
    }
    //query for min rooms
    if (req.query.min_rooms) {
      queryString += ` AND bedrooms <= '${req.query.min_rooms}'`
    }
    //query for search
    if (req.query.search) {
      queryString += ` AND description LIKE '%${req.query.search}%'`
    }
    //query for sort and order by price
    if (req.query.sort === 'price') {
      queryString += ` ORDER BY price_per_night ${req.query.order}`
    }
    //query for sort and order by bedrooms
    if (req.query.sort === 'bedrooms') {
      queryString += ` ORDER BY bedrooms ${req.query.order}`
    }
    const { rows } = await db.query(queryString)
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

export default router
