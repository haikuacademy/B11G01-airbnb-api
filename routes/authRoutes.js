import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection
import bcrypt from 'bcryptjs'

//authRoutes for /signup

router.post('/signup', async (req, res) => {
  try {
    //1.Create a salt
    const salt = await bcrypt.genSalt(10)

    //2. Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    console.log(hashedPassword)
    //
    const { first_name, last_name, email, password } = req.body
    const queryString = `
      INSERT INTO users (first_name, last_name, email, password)
      VALUES ('${first_name}', '${last_name}', '${email}', '${hashedPassword}')
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
  try {
    const { rows } = await db.query(
      `
    SELECT * FROM users
    WHERE email = '${req.body.email}'
    `)
    let user = rows[0]
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    )
    console.log(isPasswordValid)
    // if (isPasswordValid) {
    //   let token = jwt.sign(user, jwtSecret)
    //   console.log(token)
    //   res.send('Your credentials are correct')
    // } else {
    //   throw new Error('credentials not correct')
    // }
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
