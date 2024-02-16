// import router
import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection

// create photos routes
router.get('/photos', async (req, res) => {
  // don't forget async
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
// router.get('/photos/1', (req, res) => {
//   const photos1 = { id: 1, photo: 'https://random.imagecdn.app/500/150' }

//   res.json(photos1)
// })

// Export the router
export default router
