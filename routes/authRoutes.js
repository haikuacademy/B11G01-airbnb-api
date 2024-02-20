import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection

//authRoutes for /signup
router.post('/signup', async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body
    console.log(req.body, first_name, last_name)
    const queryString = `
      INSERT INTO users (first_name, last_name, email, password)
      VALUES ('${first_name}', '${last_name}', '${email}', '${password}')
      RETURNING *
    `
    console.log(queryString)
    const { rows } = await db.query(queryString)
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

//authRoutes for /login
router.get('/login', (req, res) => {
  let logInMessage = 'This is from login'
  res.send(logInMessage)
})

//authRoutes for /logout
router.get('/logout', (req, res) => {
  let logOutMessage = 'This is from logout'
  res.send(logOutMessage)
})

// Export the router
export default router
