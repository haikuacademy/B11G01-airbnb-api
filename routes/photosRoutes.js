// import router

import { Router } from 'express'
const router = Router()
import db from '../db.js' // import the database connection
import jwt from 'jsonwebtoken'
import { jwtSecret } from '../secrets.js'

// Patch photos

router.patch('/photos/:picture_id', async (req, res) => {
  const token = req.cookies.jwt
  const { pic_url, house_id } = req.body

  try {
    const decoded = jwt.verify(token, jwtSecret)
    // check if the user user_id (decoded.user_id) is the host of the house specified by house_id.
    // check if the user decoded.user_id is the same as the host_id that has the house house_id
    const queryString = `
      SELECT * FROM houses WHERE host_id = ${decoded.user_id} AND house_id = ${house_id}
    `
    const result = await db.query(queryString)
    if (result.rowCount === 0) {
      throw new Error('not authorized')
    }

    if (!pic_url) {
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
  const { pic_url, house_id } = req.body
  let decoded
  //check if the clent enters the correct info in req.body
  if (!house_id) {
    return res.json({ error: 'house_is is required' })
  }
  if (!pic_url) {
    return res.json({ error: 'pic_url is required' })
  }
  //check if the client has logged in
  try {
    decoded = jwt.decode(token, jwtSecret)
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
      throw new Error(
        `we have not found a house with house_id ${house_id} for user user_id ${decoded.user_id}`
      )
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

// get photos routes

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

// get photos routes that require house_id

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

// DELETE photos
router.delete('/photos/:photoId', async (req, res) => {
  // check if there's photoId params
  if (!req.params.photoId) {
    return res.json({ error: 'Please enter photoId' })
  }

  //check if the user is logged in
  const token = req.cookies.jwt
  let decoded
  try {
    decoded = jwt.verify(token, jwtSecret)
  } catch (e) {
    res.json({ error: 'Invalid authentication token' })
    return
  }

  // check if picture id exists in pictures table
  let result
  try {
    result = await db.query(`
      SELECT * FROM pictures WHERE picture_id = ${req.params.photoId} 
    `)
    if (result.rows.length === 0) {
      throw new Error('picture does not exist')
    }
  } catch (e) {
    res.json({ error: `Photo id ${req.params.photoId} doesn't exist.` })
    return
  }

  let houseId
  let getHostId
  try {
    houseId = result.rows[0].house_id
    // select * from houses WHERE house_id = {rows[0].house_id}
    // this query gives us the user_id (host_id) that owns the house_id
    getHostId = `
SELECT * FROM houses WHERE house_id = ${houseId}`
    result = await db.query(getHostId)
  } catch (e) {
    res.json({ error: 'You are not authorize to delete this photo.' })
    return
  }
  // when host id = user id from the token, it means that the photo belongs to that user and can be deleted
  let hostId
  let deletePhotoQuery
  try {
    hostId = result.rows[0].host_id
    if (hostId === decoded.user_id) {
      deletePhotoQuery = `
      DELETE FROM pictures WHERE picture_id = ${req.params.photoId} AND house_id = ${houseId} RETURNING *`
      const { rowCount } = await db.query(deletePhotoQuery)
      if (rowCount === 0) {
        throw new Error('User is not authorized to delete this photo')
      }
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.json({ error: err.message })
  }
})

export default router
