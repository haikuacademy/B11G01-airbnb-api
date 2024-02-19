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
    //query for houses with 1 = 1 to start with true condition
    let queryString = 'SELECT * FROM houses WHERE 1 = 1'
    // if (!req.query.location) {
    //   queryString
    // }
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
    //query for sort by price
    if (req.query.sort === 'price' || req.query.order === 'asc') {
      queryString += ` ORDER BY price_per_night`
    }
    //query for order by asc or desc
    if (req.query.order === 'desc') {
      queryString += ` ORDER BY price_per_night DESC`
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
