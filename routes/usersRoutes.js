import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection
import jwt from 'jsonwebtoken'
import { jwtSecret } from '../secrets.js'

// GET / users /:user_id route with Auth
router.get('/users/:userId', async (req, res) => {
  //if the user is not logged in, it throws the error 'Invalid authentication token'
  const token = req.cookies.jwt
  let decoded
  try {
    decoded = jwt.verify(token, jwtSecret)
  } catch (e) {
    res.json({ error: 'Invalid authentication token' })
    return
  }
  // checks if the requesting user id is the same user id in the request params.
  try {
    const queryString = `
      SELECT * FROM users WHERE user_id = ${decoded.user_id} AND user_id = ${req.params.userId}
    `
    const result = await db.query(queryString)
    if (result.rowCount === 0) {
      throw new Error('You are not authorized')
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err.message)
    res.json(err.message)
  }
})

//patch for update users
router.patch('/users/:userId', async (req, res) => {
  //if the user is not logged in, it throws the error 'Invalid authentication token'
  const token = req.cookies.jwt
  let decoded
  try {
    decoded = jwt.verify(token, jwtSecret)
  } catch (e) {
    res.json({ error: 'Invalid authentication token' })
    return
  }
  // checks if the requesting user id is the same user id in the request params.
  try {
    const queryString = `
      SELECT * FROM users WHERE user_id = ${decoded.user_id} AND user_id = ${req.params.userId}
    `
    const result = await db.query(queryString)
    if (result.rowCount === 0) {
      throw new Error('You are not authorized')
    }

    let queryArray = []
    if (req.body.first_name) {
      queryArray.push(`first_name = '${req.body.first_name}'`)
    }
    if (req.body.last_name) {
      queryArray.push(`last_name = '${req.body.last_name}'`)
    }
    if (req.body.email) {
      queryArray.push(`email = '${req.body.email}'`)
    }
    if (req.body.password) {
      queryArray.push(`password = '${req.body.password}'`)
    }
    const output = `UPDATE users SET ${queryArray.join()} WHERE user_id = ${req.params.userId} RETURNING *`
    const { rows } = await db.query(result)
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json({ error: 'Please insert a valid data' })
  }
})

export default router
