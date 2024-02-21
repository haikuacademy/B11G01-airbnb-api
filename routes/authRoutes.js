import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection

//authRoutes for /signup
router.post('/signup', async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body
    const queryString = `
      INSERT INTO users (first_name, last_name, email, password)
      VALUES ('${first_name}', '${last_name}', '${email}', '${password}')
      RETURNING *
    `
    const { rows } = await db.query(queryString)
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

//authRoutes for /login
router.post('/login', async (req, res) => {
  // let logInMessage = 'This is from login'
  // res.send(logInMessage)
  try {
    const { email, password } = req.body
    // Query the database to find a user with the provided email and password
    const { rows } = await db.query(
      `
    SELECT * FROM users
    WHERE email = $1 AND password = $2
    `,
      [email, password]
    )
    if (rows.length > 0) {
      res.json(rows)
    } else {
      // If no user found with provided email and password
      res.json({ error: 'Invalid email or password' })
    }
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

//authRoutes for /logout
router.get('/logout', (req, res) => {
  let logOutMessage = 'This is from logout'
  res.send(logOutMessage)
})

// Export the router
export default router
