import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection

// Define a GET route for house_id with params
router.get('/houses/:houseId', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM houses WHERE house_id = ${req.params.houseId}`
    )
    if (rows.length === 0) {
      return res.json({ error: 'House not found' })
    }
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json({ error: 'Internal server error' })
  }
})

//Update the /houses route with queries
router.get('/houses', async (req, res) => {
  try {
    //query for houses
    let queryString = 'SELECT * FROM houses'
    if (!req.query.location) {
      queryString
    }
    //query for location
    if (req.query.location) {
      queryString += ` WHERE location = '${req.query.location}'`
    }
    //query for max price
    if (req.query.max_price) {
      queryString += ` AND price_per_night <= '${req.query.max_price}'`
    }
    //query for min rooms
    if (req.query.min_rooms) {
      queryString += ` AND bedrooms <= '${req.query.min_rooms}'`
    }
    const { rows } = await db.query(queryString)
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

// router.get('/houses', async (req, res) => {
//   try {
//     const { rows } = await db.query('SELECT * FROM houses') // query the database
//     console.log(rows)
//     res.json(rows) // respond with the data
//   } catch (err) {
//     console.error(err.message)
//     res.json(err)
//   }
// })
export default router
