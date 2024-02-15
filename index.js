import express from 'express'
const app = express()

// Import the users router module
import reviewsRouter from './routes/reviewsRoutes.js'
app.use(reviewsRouter)
import bookingsRouter from './routes/bookingsRoutes.js'
app.use(bookingsRouter)

// Tell the app to use the user router
app.listen(4100, () => {
  console.log('Airbnb API ready on localhost:4100')
})
