import { Router } from 'express'
const router = Router()

router.get('/users', (req, res) => {
  const users = [
    { id: 1, firstName: 'Alice' },
    { id: 2, firstName: 'Bob' }
  ]
  console.log(users)
  res.json(users)
})

router.get('/users/1', (req, res) => {
  const users = { id: 1, firstName: 'Alice' }
  console.log(users)
  res.json(users)
})


export default router