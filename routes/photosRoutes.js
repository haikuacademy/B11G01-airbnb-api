// import router

import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection
import jwt from 'jsonwebtoken'
import { jwtSecret } from '../secrets.js'

// Patch photos

router.patch('/photos/:picture_id', async (req, res) => {
  try {
    if (!req.body.pic_url) {
      throw new Error('Parameter pic_url is required')
    }
    const { rows } = await db.query(`
      UPDATE pictures
      SET pic_url = '${req.body.pic_url}'
      WHERE picture_id = ${req.params.picture_id}
    `)
    res.json(rows)
  } catch (err) {
    res.json({ error: err.message })
  }
})

// Post photos

router.post('/photos', async (req, res) => {
  const token = req.cookies.jwt
  const {pic_url, house_id } = req.body
  let decoded

  try {
    decoded = jwt.verify(token, jwtSecret)
  } catch (e) {
    res.json({ error: 'Invalid auth token' })
    return
  }

  try {
    // check if the user user_id has the house house_id
    const queryString = `
      SELECT * FROM houses WHERE host_id = ${decoded.user_id} AND house_id = ${house_id}
    `

    const result = await db.query(queryString)

    if (result.rowCount === 0) {
      throw new Error('not authorized')
    }

    const queryString2 = `
      INSERT INTO pictures (pic_url, house_id)
      VALUES ('${pic_url}', '${house_id}')
      RETURNING *
    `
    const { rows } = await db.query(queryString2)
    res.json(rows)
  } catch (err) {
    res.json({ error: err.message })
  }
})

// // create photos routes

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
// create photos routes that require house_id

router.get('/photos', async (req, res) => {
  try {
    if (req.query.house) {
      let queryPhotos = `SELECT * FROM pictures WHERE house_id = '${req.query.house}'`
      const { rows } = await db.query(queryPhotos)
      res.json(rows)
    } else {
      throw new Error('house parameter is required')
    }
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

//Params for GET /photos/11
router.get('/photos/:photoId', async (req, res) => {
  try {
    let photoId = Number(req.params.photoId)
    if (!photoId) {
      throw new Error('Please insert a number')
    }
    const { rows } = await db.query(
      `SELECT * FROM pictures WHERE picture_id = ${req.params.photoId}`
    )
    if (rows.length === 0) {
      throw new Error(`No photo found with id ${req.params.photoId}`)
    }
    res.json(rows)
  } catch (err) {
    console.error(err.message)
    res.json(err.message)
  }
})

//create hardcode for /photos/11
// router.get('/photos/11', async (req, res) => {
//   try {
//     const { rows } = await db.query(
//       'SELECT * FROM pictures WHERE picture_id = 11'
//     ) // query the database
//     console.log(rows)
//     res.json(rows) // respond with the data
//   } catch (err) {
//     console.error(err.message)
//     res.json(err)
//   }
// })

export default router
