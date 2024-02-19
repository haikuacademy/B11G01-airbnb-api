import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection

router.get('/houses', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM houses') // query the database
    console.log(rows)
    res.json(rows) // respond with the data
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

// // Define a GET route for fetching a single house
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

export default router
