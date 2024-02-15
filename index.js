import express from 'express'

import photosRouter from './routes/photosRoutes.js'
import authRouter from './routes/authRoutes.js'

const app = express()

app.use(authRouter)
app.use(photosRouter)

app.listen(4100, () => {
  console.log('Airbnb API ready on localhost:4100')
})
