import express from 'express'
const app = express()

// Import the photos router module
import photosRouter from './routes/photosRoutes.js'

// Tell the app to use the photos router
app.use(photosRouter)

app.listen(4100, () => {
  console.log('Airbnb API ready on localhost:4100')
})
