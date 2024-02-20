import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection

//authRoutes for /signup
router.post('/signup', (req, res) => {
  const insertion = await db.query(`
    INSERT INTO users (first_name, last_name)
    VALUE ('${req.body.first_name}', '${req.body.last_name}')
  `)
  res.json(insertion)
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
