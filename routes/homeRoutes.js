import { Router } from 'express'
const router = Router()

router.get('/home', (req, res) => {
  const home = [
    { id: 1, homeName: 'Bali' },
    { id: 2, homeName: 'Krabi' }
  ]
  console.log(home)
  res.json(home)
})

router.get('/home/1', (req, res) => {
  const home = { id: 1, homeName: 'Bali' }
  console.log(home)
  res.json(home)
})

export default router
