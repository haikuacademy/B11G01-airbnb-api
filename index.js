// import express

import express from 'express'

// run the express function

const app = express()

// import users router
import usersRouter from './routes/usersRoutes.js'

// Tell the app to use the user router
app.use(usersRouter)

// keep the server open
app.listen(4100, () => {
  console.log('Airbnb API ready on localhost:4100')
})
