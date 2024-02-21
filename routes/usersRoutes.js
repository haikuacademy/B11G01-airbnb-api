import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection

// Define a GET route for fetching the list of users
router.get('/users', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM users') // query the database
    console.log(rows)
    res.json(rows) // respond with the data
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

router.get('/users/:userId', async (req, res) => {
  try {
    let userId = Number(req.params.userId)
    if (!userId) {
      throw new Error('Please insert a number')
    }
    const { rows } = await db.query(
      `SELECT * FROM users WHERE user_id = ${req.params.userId}`
    )
    if (rows.length === 0) {
      throw new Error('User not found')
    }
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err.message)
  }
})

//patch for changing user's first name
router.patch('/users/change-first_name/:userId', async (req, res) => {
  try {
    const { rows } = await db.query(`
    UPDATE users
    SET first_name = '${req.body.first_name}'
    WHERE user_id = ${req.params.userId}
    `)
    if (!req.body.first_name) {
      throw new Error('Please put your first name')
    }
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err.message)
  }
})

//patch for changing user's first name
router.patch('/users/change-last_name/:userId', async (req, res) => {
  try {
    const { rows } = await db.query(`
    UPDATE users
    SET last_name = '${req.body.last_name}'
    WHERE user_id = ${req.params.userId}
    `)
    if (!req.body.last_name) {
      throw new Error('Please put your last name')
    }
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err.message)
  }
})

//patch for changing user's email
router.patch('/users/change-email/:userId', async (req, res) => {
  try {
    const { rows } = await db.query(`
    UPDATE users
    SET email = '${req.body.email}'
    WHERE user_id = ${req.params.userId}
    `)
    if (!req.body.email) {
      throw new Error('Please put your email')
    }
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err.message)
  }
})

//patch for changing user's password
router.patch('/users/change-password/:userId', async (req, res) => {
  try {
    const { rows } = await db.query(`
    UPDATE users
    SET password = '${req.body.password}'
    WHERE user_id = ${req.params.userId}
    `)
    if (!req.body.email) {
      throw new Error('Please put your password')
    }
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err.message)
  }
})

export default router
