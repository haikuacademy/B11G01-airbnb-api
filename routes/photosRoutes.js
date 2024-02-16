// import router
import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection

// create photos routes
router.get('/photos', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM pictures') // query the database
    console.log(rows)
    res.json(rows) // respond with the data
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

//create /photos/1
router.get('/photos/11', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM pictures WHERE picture_id = 11'
    ) // query the database
    console.log(rows)
    res.json(rows) // respond with the data
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

export default router
