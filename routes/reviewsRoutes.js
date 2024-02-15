import { Router } from 'express'
const router = Router()

// create route reviews

router.get('/reviews', (req, res) => {
  const reviews = [
    { house_id: 1, name: 'House A' },
    { house_id: 2, name: 'House B' }
  ]
  res.json('reviews')
  console.log({ house_id: 1, name: 'House A' })
})
export default router
