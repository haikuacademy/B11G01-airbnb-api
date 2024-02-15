import express from 'express'
const app = express()

import authRouter from './routes/authRoutes.js'
app.use(authRouter)

app.listen(4100, () => {
  console.log('Airbnb API ready on localhost:4100')
})
