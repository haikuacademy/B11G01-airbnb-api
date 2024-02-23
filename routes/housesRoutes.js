import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection
import jwt from 'jsonwebtoken'
import { jwtSecret } from '../secrets.js'

// Houses
// Let's continue with the "houses" route.
// In the housesRoutes.js file, create a new POST route for /houses
// It is common practice to add the POST route above the GET routes, in order to follow the CRUD sequence of operations (Create, Read, Update, Delete).
// Make the new POST route insert a row in the houses table of the database using the data that comes from the req.body.
// Make the route respond with the row of data inserted into the database.
// Test, using Postman, that a POST request to http://localhost:4100/houses with a payload, results in the correct insertion of such data in the database.

//Update the POST /houses route so that it first decodes the incoming jwt from the cookies
router.post('/houses', async (req, res) => {
  try {
    const token = req.cookies.jwt
    if (!token) {
      throw new Error('No token provided')
    }
    const decodedToken = jwt.verify(token, jwtSecret)
    if (!decodedToken) {
      throw new Error('Invalid authentication token')
    } else {
      const {
        location,
        bedrooms,
        bathrooms,
        description,
        price_per_night,
        host_id
      } = req.body
      const queryString = `
      INSERT INTO houses (location, bedrooms, bathrooms, description, price_per_night, host_id)
      VALUES ('${location}', ${bedrooms}, ${bathrooms}, '${description}', ${price_per_night}, ${decodedToken.user_id})
      RETURNING *
    `
      const { rows } = await db.query(queryString)
      res.json(rows)
    }
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

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
      throw new Error(`No house found with id ${req.params.houseId}`)
    }
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err.message)
  }
})

// Update the /houses route with query using queryString
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
      queryString += ` AND bedrooms >= '${req.query.min_rooms}'`
    }
    //query for search
    if (req.query.search) {
      queryString += ` AND description LIKE '%${req.query.search}%'`
    }
    // query for sort and order
    if (req.query.sort && req.query.order) {
      queryString += ` ORDER BY ${req.query.sort} ${req.query.order}`
    } else if (req.query.sort) {
      // query for sort and make it ASC by default
      queryString += ` ORDER BY ${req.query.sort} ASC`
    }
    const { rows } = await db.query(queryString)
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

// PATCH for houses
router.patch('/houses/:house_id', async (req, res) => {
  try {
    const { location, bedrooms, bathrooms, description, price_per_night } =
      req.body
    let queryArray = []
    if (location) {
      queryArray.push(`location = '${location}'`)
    }
    if (bedrooms) {
      queryArray.push(`bedrooms = ${bedrooms}`)
    }
    if (bathrooms) {
      queryArray.push(`bathrooms = ${bathrooms}`)
    }
    if (description) {
      queryArray.push(`description = '${description}'`)
    }
    if (price_per_night) {
      queryArray.push(`price_per_night = ${price_per_night}`)
    }
    let result = `UPDATE houses SET ${queryArray.join()} WHERE house_id = ${req.params.house_id} RETURNING *`
    console.log(result)
    const r = await db.query(result)
    res.json(r.rows)
  } catch (err) {
    console.error(err.message)
    res.json({ error: 'Please insert valid data' })
  }
})

export default router
