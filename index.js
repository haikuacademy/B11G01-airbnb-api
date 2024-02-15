// import express

import express from 'express'

import photosRouter from './routes/photosRoutes.js'
import authRouter from './routes/authRoutes.js'
import homeRouter from './routes/homeRoutes.js'
import usersRouter from './routes/usersRoutes.js'

const app = express()

app.use(authRouter)
app.use(photosRouter)
app.use(homeRouter)
app.use(usersRouter)

app.listen(4100, () => {
  console.log('Airbnb API ready on localhost:4100')
})
