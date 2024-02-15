import { Router } from 'express'
const router = Router()

router.get('/users', (req, res) => {
  const users = [
    { id: 1, firstName: 'Alice' },
    { id: 2, firstName: 'Bob' }
  ]
  console.log(users)
  res.send(users)
})

router.get('/users/1', (req, res) => {
  const users = { id: 1, firstName: 'Alice' }
  console.log(users)
  res.send(users)
})


export default router