// import express
import express from 'express'
// run the express function
const app = express()
// create routes
app.get('/users', (req, res) => {
  const users = [
    { id: 1, firstName: 'Alice' },
    { id: 2, firstName: 'Bob' }
  ]
  res.send(users)
})
app.get('/users/1', (req, res) => {
  const users = { id: 1, firstName: 'Alice' }
  res.send(users)
})
