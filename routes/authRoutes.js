import { Router } from 'express'
import db from '../db.js' // import the database connection
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '../secrets.js'

const router = Router()

//authRoutes for /signup

router.post('/signup', async (req, res) => {
  try {
    //check that a user with the same email address doesn't already exist
    const result = await db.query(
      `SELECT * FROM users WHERE email = '${req.body.email}'`
    )

    if (result.rows.length !== 0) { 
      throw new Error('user with this email already exists')
    }
    
    //1.Create a salt
    const salt = await bcrypt.genSalt(10)
    console.log(result.rows)
    //2. Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    console.log('hashedPassword', hashedPassword)
    //
    const { first_name, last_name, email } = req.body
    const queryString = `
    INSERT INTO users (first_name, last_name, email, password)
    VALUES ('${first_name}', '${last_name}', '${email}', '${hashedPassword}')
    RETURNING user_id, email
  `
    const { rows } = await db.query(queryString)

    // create jwt token
    
    const payload = {
      user_id: rows[0].user_id,
      email: rows[0].email
    }

    const token = jwt.sign(payload, jwtSecret)

    console.log('token', token)
    console.log('rows[0]', rows[0])
    console.log('payload', payload)

    res.cookie('jwt', token)

    res.json(rows[0])
  } catch (err) {
    console.error(err.message)
    res.json({error: err.message})
  }
})

router.get('/users', async (req, res) => { 
  const { rows } = await db.query(`SELECT * FROM users`)
  res.json(rows)
})

//authRoutes for /login
router.post('/login', async (req, res) => {
  try {
    console.log(req.body)
    if (!req.body.email) {
      throw new Error('we need an email')
    }
    if (!req.body.password) {
      throw new Error('we need a password')
    }
    const { rows } = await db.query(
      `
    SELECT * FROM users
    WHERE email = '${req.body.email}'
    `
    )
    let user = rows[0]

    if (!user) {
      throw new Error('user not found')
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    )

    console.log(isPasswordValid)
    
    if (isPasswordValid) {
      // create jwt token
      const payload = {
        user_id: rows[0].user_id,
        email: rows[0].email
      }
      const token = jwt.sign(payload, jwtSecret)
      res.cookie('jwt', token)
      console.log(token)
      console.log(user)
      res.json({ user_id: rows[0].user_id})
    } else {
      throw new Error('credentials not correct')
    }
  } catch (err) {
    console.error(err.message)
    res.json({error: err.message})
  }
})

//authRoutes for /logout
router.get('/logout', (req, res) => {
  res.clearCookie('jwt')
  res.send('You are logged out')
})

// Export the router
export default router
